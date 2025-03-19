import { Router } from 'express';
import { travelPreferenceRouter } from './travel-preference.routes';
import flightSearchRouter from './flight-search.routes';
import { flightRouter } from './flight.routes';

const router = Router();

// Register routes
router.use('/travel-preferences', travelPreferenceRouter);
router.use('/flight-search', flightSearchRouter);
router.use('/flights', flightRouter);

export default router; 