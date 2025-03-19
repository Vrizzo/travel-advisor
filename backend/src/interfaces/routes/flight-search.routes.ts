import { Router } from 'express';
import { FlightSearchController } from '../controllers/flight-search.controller';
import { MongoTravelPreferenceRepository } from '../../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { MongoRouteRepository } from '../../infrastructure/repositories/mongodb/mongo-route.repository';
import { MongoFlightRepository } from '../../infrastructure/repositories/mongodb/mongo-flight.repository';
import { SearchFlightsUseCase } from '../../application/use-cases/search-flights.use-case';
import { FindCompatibleRoutesUseCase } from '../../application/use-cases/find-compatible-routes.use-case';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';
import { KiwiClient } from '../../infrastructure/clients/kiwi/kiwi.client';

const router = Router();

// Initialize repositories and clients
const travelPreferenceRepository = new MongoTravelPreferenceRepository();
const routeRepository = new MongoRouteRepository();
const flightRepository = new MongoFlightRepository();
const kiwiClient = new KiwiClient('eXvQj9tCWpz81UgB3blKh5POjZQeTjpg');

// Initialize use cases
const searchFlightsUseCase = new SearchFlightsUseCase(flightRepository, kiwiClient);
const findCompatibleRoutesUseCase = new FindCompatibleRoutesUseCase(
  travelPreferenceRepository,
  routeRepository,
  searchFlightsUseCase
);
const travelPreferenceUseCase = new TravelPreferenceUseCase(travelPreferenceRepository);

// Initialize controller
const flightSearchController = new FlightSearchController(
  findCompatibleRoutesUseCase,
  travelPreferenceUseCase
);

// Define routes
router.get('/search', flightSearchController.searchRoutes.bind(flightSearchController));
router.post('/trigger', flightSearchController.triggerSearch.bind(flightSearchController));

export default router;
