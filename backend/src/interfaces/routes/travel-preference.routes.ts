import { Router } from 'express';
import { TravelPreferenceController } from '../controllers/travel-preference.controller';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';
import { MongoTravelPreferenceRepository } from '../../infrastructure/repositories/mongodb/travel-preference.repository';

export const travelPreferenceRouter = Router();

// Initialize dependencies
const repository = new MongoTravelPreferenceRepository();
const useCase = new TravelPreferenceUseCase(repository);
const controller = new TravelPreferenceController(useCase);

// Bind controller methods to routes
travelPreferenceRouter.post('/', (req, res) => controller.create(req, res));
travelPreferenceRouter.get('/', (req, res) => controller.getAll(req, res));
travelPreferenceRouter.get('/:id', (req, res) => controller.getById(req, res));
travelPreferenceRouter.put('/:id', (req, res) => controller.update(req, res));
travelPreferenceRouter.delete('/:id', (req, res) => controller.delete(req, res)); 