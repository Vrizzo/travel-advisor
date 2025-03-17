import { Request, Response } from 'express';
import { FindCompatibleRoutesUseCase } from '../../application/use-cases/find-compatible-routes.use-case';
import { MongoTravelPreferenceRepository } from '../../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../../infrastructure/repositories/mongodb/mongo-route.repository';
import { MongoFlightRepository } from '../../infrastructure/repositories/mongodb/mongo-flight.repository';
import { SearchFlightsUseCase } from '../../application/use-cases/search-flights.use-case';
import { KiwiClient } from '../../infrastructure/clients/kiwi/kiwi.client';

export class FlightSearchController {
  async triggerSearch(req: Request, res: Response) {
    try {
      // Initialize repositories
      const travelPreferenceRepository = new MongoTravelPreferenceRepository();
      const routeRepository = new MongoRouteRepository();
      const flightRepository = new MongoFlightRepository();
      
      // Initialize use cases
      const searchFlightsUseCase = new SearchFlightsUseCase(flightRepository, new KiwiClient('eXvQj9tCWpz81UgB3blKh5POjZQeTjpg'));
      const findCompatibleRoutesUseCase = new FindCompatibleRoutesUseCase(
        travelPreferenceRepository,
        routeRepository,
        searchFlightsUseCase
      );

      // Execute the search
      await findCompatibleRoutesUseCase.executeNextSearch();
      
      res.json({ 
        success: true, 
        message: 'Flight search completed successfully' 
      });
    } catch (error) {
      console.error('Error triggering flight search:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to trigger flight search',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 