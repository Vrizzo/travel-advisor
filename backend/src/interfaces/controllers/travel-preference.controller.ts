import { Request, Response } from 'express';
import { TravelPreferenceUseCase } from '../../application/use-cases/travel-preference.use-case';

export class TravelPreferenceController {
  constructor(private readonly useCase: TravelPreferenceUseCase) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { departureCity, periodFrom, periodTo, budget } = req.body;
      const preference = await this.useCase.createTravelPreference(
        departureCity,
        periodFrom,
        periodTo,
        budget
      );
      res.status(201).json({
        success: true,
        data: preference
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const preferences = await this.useCase.getAllTravelPreferences();
      res.status(200).json({
        success: true,
        data: preferences
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const preference = await this.useCase.getTravelPreferenceById(id);
      
      if (!preference) {
        res.status(404).json({
          success: false,
          error: 'Travel preference not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: preference
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { departureCity, periodFrom, periodTo, budget } = req.body;
      
      const preference = await this.useCase.updateTravelPreference(
        id,
        departureCity,
        periodFrom,
        periodTo,
        budget
      );

      if (!preference) {
        res.status(404).json({
          success: false,
          error: 'Travel preference not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: preference
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          error: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Internal server error'
        });
      }
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.useCase.deleteTravelPreference(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Travel preference not found'
        });
        return;
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 