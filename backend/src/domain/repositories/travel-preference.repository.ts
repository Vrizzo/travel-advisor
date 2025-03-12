import { TravelPreference } from '../entities/travel-preference';

export interface TravelPreferenceRepository {
  save(travelPreference: TravelPreference): Promise<TravelPreference>;
  findAll(): Promise<TravelPreference[]>;
  findById(id: string): Promise<TravelPreference | null>;
  findNextToSearch(): Promise<TravelPreference | null>;
  update(id: string, travelPreference: TravelPreference): Promise<TravelPreference | null>;
  delete(id: string): Promise<boolean>;
  updateLastSearched(id: string, lastSearchedAt: Date): Promise<TravelPreference | null>;
} 