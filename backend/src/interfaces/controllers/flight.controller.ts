import { Request, Response } from 'express';
import { GetFlightsByPreferenceUseCase } from '../../application/use-cases/get-flights-by-preference.use-case';
import { FlightRepository } from '../../domain/repositories/flight.repository';

export class FlightController {
  private getFlightsByPreferenceUseCase: GetFlightsByPreferenceUseCase;

  constructor(flightRepository: FlightRepository) {
    this.getFlightsByPreferenceUseCase = new GetFlightsByPreferenceUseCase(flightRepository);
  }

  async getFlightsByPreference(req: Request, res: Response) {
    try {
      const { preferenceId } = req.query;

      if (!preferenceId || typeof preferenceId !== 'string') {
        return res.status(400).json({ 
          error: 'Preference ID is required' 
        });
      }

      const flights = await this.getFlightsByPreferenceUseCase.execute(preferenceId);
      
      return res.json(flights);
    } catch (error) {
      console.error('Error fetching flights:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch flights' 
      });
    }
  }
} 