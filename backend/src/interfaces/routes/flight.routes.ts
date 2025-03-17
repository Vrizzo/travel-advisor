import { Router } from 'express';
import { FlightController } from '../controllers/flight.controller';
import { container } from '../../infrastructure/container';

export const flightRouter = Router();

// Initialize controller with dependencies from container
const controller = new FlightController(container.flightRepository);

// Bind controller methods to routes
flightRouter.get('/', (req, res) => controller.getFlightsByPreference(req, res)); 