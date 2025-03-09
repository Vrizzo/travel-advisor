import { TravelPreference } from '../entities/travel-preference';

export interface TravelPreferenceRepository {
  save(preference: TravelPreference): Promise<TravelPreference>;
  findAll(): Promise<TravelPreference[]>;
  findById(id: string): Promise<TravelPreference | null>;
  update(id: string, preference: TravelPreference): Promise<TravelPreference | null>;
  delete(id: string): Promise<boolean>;
} 