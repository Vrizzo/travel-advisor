import { Router } from 'express';
import { FlightSearchController } from '../controllers/flight-search.controller';

export const flightSearchRouter = Router();

// Initialize controller
const controller = new FlightSearchController();

// Bind controller methods to routes
flightSearchRouter.post('/trigger', (req, res) => controller.triggerSearch(req, res)); 