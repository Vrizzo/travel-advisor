import { Router } from 'express';
import { TravelPreferenceController } from '../controllers/travel-preference.controller';
import { MongoTravelPreferenceRepository } from '../../infrastructure/repositories/mongodb/mongo-travel-preference.repository';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';

const router = Router();

const travelPreferenceRepository = new MongoTravelPreferenceRepository();
const travelPreferenceUseCase = new TravelPreferenceUseCase(travelPreferenceRepository);
const travelPreferenceController = new TravelPreferenceController(travelPreferenceUseCase);

router.get('/', travelPreferenceController.getAll.bind(travelPreferenceController));
router.get('/:id', travelPreferenceController.getById.bind(travelPreferenceController));
router.post('/', travelPreferenceController.create.bind(travelPreferenceController));
router.put('/:id', travelPreferenceController.update.bind(travelPreferenceController));
router.delete('/:id', travelPreferenceController.delete.bind(travelPreferenceController));

export { router as travelPreferenceRouter }; 