import { TravelPreference } from '../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../domain/repositories/travel-preference.repository';

export class TravelPreferenceUseCase {
  constructor(private readonly repository: TravelPreferenceRepository) {}

  async create(departureCity: string, periodFrom: Date, periodTo: Date, budget: number): Promise<TravelPreference> {
    const preference = new TravelPreference(
      departureCity,
      periodFrom,
      periodTo,
      budget
    );
    
    return this.repository.save(preference);
  }

  async getAll(): Promise<TravelPreference[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<TravelPreference | null> {
    return this.repository.findById(id);
  }

  async update(id: string, departureCity: string, periodFrom: Date, periodTo: Date, budget: number): Promise<TravelPreference | null> {
    const preference = await this.repository.findById(id);
    if (!preference) {
      return null;
    }

    preference.departureCity = departureCity;
    preference.periodFrom = periodFrom;
    preference.periodTo = periodTo;
    preference.budget = budget;

    return this.repository.update(id, preference);
  }

  async delete(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }
} 