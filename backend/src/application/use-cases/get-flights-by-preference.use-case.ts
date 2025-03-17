import { FlightRepository } from '../../domain/repositories/flight.repository';

export class GetFlightsByPreferenceUseCase {
  constructor(private flightRepository: FlightRepository) {}

  async execute(preferenceId: string) {
    try {
      const flights = await this.flightRepository.findByTravelPreferenceId(preferenceId);
      return flights;
    } catch (error) {
      console.error('Error in GetFlightsByPreferenceUseCase:', error);
      throw error;
    }
  }
} 