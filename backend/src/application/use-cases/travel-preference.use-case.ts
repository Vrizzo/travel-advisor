import { TravelPreference } from '../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../domain/repositories/travel-preference.repository';

export class TravelPreferenceUseCase {
  constructor(private readonly repository: TravelPreferenceRepository) {}

  async createTravelPreference(
    departureCity: string,
    periodFrom: string,
    periodTo: string,
    budget: number
  ): Promise<TravelPreference> {
    const preference = new TravelPreference(
      departureCity,
      periodFrom,
      periodTo,
      budget
    );
    return this.repository.save(preference);
  }

  async getAllTravelPreferences(): Promise<TravelPreference[]> {
    return this.repository.findAll();
  }

  async getTravelPreferenceById(id: string): Promise<TravelPreference | null> {
    return this.repository.findById(id);
  }

  async updateTravelPreference(
    id: string,
    departureCity: string,
    periodFrom: string,
    periodTo: string,
    budget: number
  ): Promise<TravelPreference | null> {
    const preference = new TravelPreference(
      departureCity,
      periodFrom,
      periodTo,
      budget,
      id
    );
    return this.repository.update(id, preference);
  }

  async deleteTravelPreference(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
} 