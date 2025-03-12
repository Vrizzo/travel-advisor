import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FindCompatibleRoutesUseCase } from '../application/use-cases/find-compatible-routes.use-case';
import { MongoTravelPreferenceRepository } from '../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../infrastructure/repositories/mongodb/mongo-route.repository';
import { MongoFlightRepository } from '../infrastructure/repositories/mongodb/mongo-flight.repository';
import { formatDate } from '../utils/date-utils';

// Load environment variables
dotenv.config();

async function searchFlights() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-advisor';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');

    // Initialize repositories and use case
    const travelPreferenceRepo = new MongoTravelPreferenceRepository();
    const routeRepo = new MongoRouteRepository();
    const flightRepo = new MongoFlightRepository();
    
    const findCompatibleRoutes = new FindCompatibleRoutesUseCase(
      travelPreferenceRepo,
      routeRepo,
      flightRepo
    );
    
    // Find next preference to search and get compatible routes
    console.log('🔍 Finding next travel preference to search...');
    const result = await findCompatibleRoutes.executeNextSearch();
    
    if (result) {
      console.log(`✅ Found travel preference ID: ${result.preference.id}`);
      console.log(`🛣️ Found ${result.compatibleRoutes.length} compatible routes from ${result.preference.departureCity}`);
      console.log(`✈️ Found ${result.flights.length} affordable flights within budget (${result.preference.budget} EUR)`);
      
      // Display some stats about the flights found
      if (result.flights.length > 0) {
        const cheapestFlight = result.flights.reduce((prev, curr) => 
          prev.price < curr.price ? prev : curr);
        
        console.log(`💰 Cheapest flight: ${cheapestFlight.departureAirport} to ${cheapestFlight.arrivalAirport} for ${cheapestFlight.price} EUR`);
        console.log(`🔗 Booking link: ${cheapestFlight.deepLink}`);
      }
    } else {
      console.log('⚠️ No travel preferences found to search');
    }
  } catch (error) {
    console.error('❌ Error searching flights:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('📦 Disconnected from MongoDB');
  }
}

// Run the script
searchFlights().catch(console.error); 