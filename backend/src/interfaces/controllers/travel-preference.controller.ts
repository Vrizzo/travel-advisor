import { Request, Response } from 'express';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';

export class TravelPreferenceController {
  constructor(private readonly travelPreferenceUseCase: TravelPreferenceUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { departureCity, periodFrom, periodTo, budget } = req.body;
      const preference = await this.travelPreferenceUseCase.create(
        departureCity,
        new Date(periodFrom),
        new Date(periodTo),
        budget
      );
      res.status(201).json(preference);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create travel preference' });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const preferences = await this.travelPreferenceUseCase.getAll();
      res.status(200).json(preferences);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get travel preferences' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const preference = await this.travelPreferenceUseCase.getById(id);
      if (!preference) {
        res.status(404).json({ error: 'Travel preference not found' });
        return;
      }
      res.status(200).json(preference);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to get travel preference' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { departureCity, periodFrom, periodTo, budget } = req.body;
      const preference = await this.travelPreferenceUseCase.update(
        id,
        departureCity,
        new Date(periodFrom),
        new Date(periodTo),
        budget
      );
      if (!preference) {
        res.status(404).json({ error: 'Travel preference not found' });
        return;
      }
      res.status(200).json(preference);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update travel preference' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.travelPreferenceUseCase.delete(id);
      if (!success) {
        res.status(404).json({ error: 'Travel preference not found' });
        return;
      }
      res.sendStatus(204);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete travel preference' });
    }
  }
} 