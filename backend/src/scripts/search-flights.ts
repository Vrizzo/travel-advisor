import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { FindCompatibleRoutesUseCase } from '../application/use-cases/find-compatible-routes.use-case';
import { MongoTravelPreferenceRepository } from '../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../infrastructure/repositories/mongodb/mongo-route.repository';
import { KiwiClient } from '../infrastructure/clients/kiwi/kiwi.client';

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
    const findCompatibleRoutes = new FindCompatibleRoutesUseCase(
      travelPreferenceRepo,
      routeRepo
    );
    
    // Find next preference to search and get compatible routes
    console.log('🔍 Finding next travel preference to search...');
    const result = await findCompatibleRoutes.executeNextSearch();
    
    if (result) {
      console.log(`✅ Found travel preference ID: ${result.preference.id}`);
      console.log(`🛣️ Found ${result.compatibleRoutes.length} compatible routes from ${result.preference.departureCity}`);
      
      // If KIWI_API_KEY is set, we can search for flights
      if (process.env.KIWI_API_KEY) {
        try {
          const kiwiClient = new KiwiClient();
          console.log('🔎 Searching flights with Kiwi API...');
          
          for (const route of result.compatibleRoutes) {
            // Format dates for the API
            const dateFrom = formatDate(result.preference.periodFrom);
            const dateTo = formatDate(result.preference.periodTo);
            
            console.log(`🛫 Searching flights from ${route.departureAirport} to ${route.arrivalAirport} (${dateFrom} - ${dateTo})`);
            
            try {
              const searchParams = {
                flyFrom: route.departureAirport,
                flyTo: route.arrivalAirport,
                dateFrom,
                dateTo,
                adults: 1,
                currency: 'EUR'
              };
              
              const flights = await kiwiClient.searchFlights(searchParams);
              console.log(`✅ Found ${flights.data.length} flights from ${route.departureAirport} to ${route.arrivalAirport}`);
              
              // Here you could save the flight results to a database
              // or perform other actions with the results
            } catch (error) {
              console.error(`❌ Error searching flights for route ${route.departureAirport} to ${route.arrivalAirport}:`, error);
            }
          }
        } catch (error) {
          console.error('❌ Error initializing Kiwi client:', error);
        }
      } else {
        console.log('⚠️ KIWI_API_KEY not set. Skipping flight search.');
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

// Helper function to format Date objects for the Kiwi API
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Execute if run directly
if (require.main === module) {
  searchFlights()
    .then(() => {
      console.log('✨ Flight search completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Flight search failed:', error);
      process.exit(1);
    });
}

export { searchFlights }; 