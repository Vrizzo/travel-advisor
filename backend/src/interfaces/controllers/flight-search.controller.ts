import { Request, Response } from 'express';
import { FindCompatibleRoutesUseCase } from '../../application/use-cases/find-compatible-routes.use-case';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';
import { TravelPreference } from '../../domain/entities/travel-preference';
import { MongoTravelPreferenceRepository } from '../../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../../infrastructure/repositories/mongodb/mongo-route.repository';
import { MongoFlightRepository } from '../../infrastructure/repositories/mongodb/mongo-flight.repository';
import { SearchFlightsUseCase } from '../../application/use-cases/search-flights.use-case';
import { KiwiClient } from '../../infrastructure/clients/kiwi/kiwi.client';

export class FlightSearchController {
  constructor(
    private readonly findCompatibleRoutesUseCase: FindCompatibleRoutesUseCase,
    private readonly travelPreferenceUseCase: TravelPreferenceUseCase
  ) {}

  async searchRoutes(req: Request, res: Response): Promise<void> {
    try {
      const { preferenceId } = req.query;
      
      if (!preferenceId || typeof preferenceId !== 'string') {
        res.status(400).json({ error: 'Preference ID is required' });
        return;
      }

      const preference = await this.travelPreferenceUseCase.getById(preferenceId);
      if (!preference) {
        res.status(404).json({ error: 'Preference not found' });
        return;
      }

      const routes = await this.findCompatibleRoutesUseCase.execute(preferenceId);
      res.json(routes);
    } catch (error) {
      console.error('Error searching routes:', error);
      res.status(500).json({ error: 'Failed to search routes' });
    }
  }

  async triggerSearch(req: Request, res: Response) {
    try {
      const travelPreferenceRepository = new MongoTravelPreferenceRepository();
      const routeRepository = new MongoRouteRepository();
      
      const findCompatibleRoutesUseCase = new FindCompatibleRoutesUseCase(
        travelPreferenceRepository,
        routeRepository,
        new SearchFlightsUseCase(new MongoFlightRepository(), new KiwiClient('eXvQj9tCWpz81UgB3blKh5POjZQeTjpg'))
      );
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