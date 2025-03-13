import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import { FindCompatibleRoutesUseCase } from '../application/use-cases/find-compatible-routes.use-case';
import { MongoTravelPreferenceRepository } from '../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../infrastructure/repositories/mongodb/mongo-route.repository';
import { MongoFlightRepository } from '../infrastructure/repositories/mongodb/mongo-flight.repository';
import { SearchFlightsUseCase } from '../application/use-cases/search-flights.use-case';

// Function to disconnect from MongoDB
const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error);
  }
};

// Load environment variables
dotenv.config();

async function searchFlights() {
  try {
    // Connect to the database
    await connectDB();
    
    // Initialize repositories
    const travelPreferenceRepository = new MongoTravelPreferenceRepository();
    const routeRepository = new MongoRouteRepository();
    const flightRepository = new MongoFlightRepository();
    
    // Initialize use case
    const searchFlightsUseCase = new SearchFlightsUseCase(flightRepository);
    const findCompatibleRoutesUseCase = new FindCompatibleRoutesUseCase(
      travelPreferenceRepository,
      routeRepository,
      searchFlightsUseCase
    );

    // Execute the search
    await findCompatibleRoutesUseCase.executeNextSearch();
    
    // Disconnect from the database
    await disconnectDB();
    
    console.log('Flight search completed successfully');
  } catch (error) {
    console.error('Error searching for flights:', error);
    await disconnectDB();
    process.exit(1);
  }
}

// Run the search
searchFlights(); 