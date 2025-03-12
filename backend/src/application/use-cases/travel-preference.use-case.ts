import { TravelPreference } from '../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../domain/repositories/travel-preference.repository';

export class TravelPreferenceUseCase {
  constructor(private readonly repository: TravelPreferenceRepository) {}

  async create(
    departureCity: string,
    periodFrom: Date,
    periodTo: Date,
    budget: number
  ): Promise<TravelPreference> {
    try {
      const preference = new TravelPreference(
        departureCity,
        periodFrom,
        periodTo,
        budget
      );
      return await this.repository.save(preference);
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<TravelPreference[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<TravelPreference | null> {
    return this.repository.findById(id);
  }

  async update(
    id: string,
    departureCity: string,
    periodFrom: Date,
    periodTo: Date,
    budget: number
  ): Promise<TravelPreference | null> {
    try {
      const preference = new TravelPreference(
        departureCity,
        periodFrom,
        periodTo,
        budget,
        id
      );
      return await this.repository.update(id, preference);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
} 