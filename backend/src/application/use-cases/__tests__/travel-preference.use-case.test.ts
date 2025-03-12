import '@jest/globals';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { TravelPreferenceUseCase } from '../travel-preference.use-case';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';

class MockTravelPreferenceRepository implements TravelPreferenceRepository {
  private preferences: TravelPreference[] = [];

  async findAll(): Promise<TravelPreference[]> {
    return this.preferences;
  }

  async findById(id: string): Promise<TravelPreference | null> {
    return this.preferences.find(p => p.id === id) || null;
  }

  async save(preference: TravelPreference): Promise<TravelPreference> {
    const id = Math.random().toString(36).substring(7);
    const newPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id
    );
    this.preferences.push(newPreference);
    return newPreference;
  }

  async update(id: string, preference: TravelPreference): Promise<TravelPreference | null> {
    const index = this.preferences.findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id
    );
    this.preferences[index] = updatedPreference;
    return updatedPreference;
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.preferences.length;
    this.preferences = this.preferences.filter(p => p.id !== id);
    return this.preferences.length !== initialLength;
  }

  async findNextToSearch(): Promise<TravelPreference | null> {
    // Return the first preference sorted by lastSearchedAt (null first)
    return this.preferences
      .sort((a, b) => {
        if (!a.lastSearchedAt) return -1;
        if (!b.lastSearchedAt) return 1;
        return a.lastSearchedAt.getTime() - b.lastSearchedAt.getTime();
      })[0] || null;
  }

  async updateLastSearched(id: string, lastSearchedAt: Date): Promise<TravelPreference | null> {
    const preference = await this.findById(id);
    if (!preference) return null;
    
    const updatedPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      id,
      lastSearchedAt
    );
    
    const index = this.preferences.findIndex(p => p.id === id);
    this.preferences[index] = updatedPreference;
    return updatedPreference;
  }
}

describe('TravelPreferenceUseCase', () => {
  let useCase: TravelPreferenceUseCase;
  let repository: MockTravelPreferenceRepository;

  beforeEach(() => {
    repository = new MockTravelPreferenceRepository();
    useCase = new TravelPreferenceUseCase(repository);
  });

  it('should create a travel preference', async () => {
    const departureCity = 'MXP';
    const periodFrom = new Date('2023-05-01');
    const periodTo = new Date('2023-05-10');
    const budget = 1000;

    const preference = await useCase.create(departureCity, periodFrom, periodTo, budget);

    expect(preference).toBeDefined();
    expect(preference.departureCity).toBe(departureCity);
    expect(preference.periodFrom).toEqual(periodFrom);
    expect(preference.periodTo).toEqual(periodTo);
    expect(preference.budget).toBe(budget);
    expect(preference.id).toBeDefined();
  });

  it('should get all travel preferences', async () => {
    const preference1 = await useCase.create('MXP', new Date('2023-05-01'), new Date('2023-05-10'), 1000);
    const preference2 = await useCase.create('FCO', new Date('2023-06-01'), new Date('2023-06-10'), 1500);

    const preferences = await useCase.getAll();

    expect(preferences).toHaveLength(2);
    expect(preferences).toContainEqual(preference1);
    expect(preferences).toContainEqual(preference2);
  });

  it('should get a travel preference by id', async () => {
    const preference = await useCase.create('MXP', new Date('2023-05-01'), new Date('2023-05-10'), 1000);

    const result = await useCase.getById(preference.id!);

    expect(result).toEqual(preference);
  });

  it('should return null when getting a non-existent travel preference', async () => {
    const result = await useCase.getById('non-existent-id');

    expect(result).toBeNull();
  });

  it('should update a travel preference', async () => {
    const preference = await useCase.create('MXP', new Date('2023-05-01'), new Date('2023-05-10'), 1000);
    const updatedPreference = await useCase.update(
      preference.id!,
      'FCO',
      new Date('2023-06-01'),
      new Date('2023-06-10'),
      1500
    );

    expect(updatedPreference).toBeDefined();
    expect(updatedPreference!.departureCity).toBe('FCO');
    expect(updatedPreference!.periodFrom).toEqual(new Date('2023-06-01'));
    expect(updatedPreference!.periodTo).toEqual(new Date('2023-06-10'));
    expect(updatedPreference!.budget).toBe(1500);
    expect(updatedPreference!.id).toBe(preference.id);
  });

  it('should return null when updating a non-existent travel preference', async () => {
    const result = await useCase.update(
      'non-existent-id',
      'FCO',
      new Date('2023-06-01'),
      new Date('2023-06-10'),
      1500
    );

    expect(result).toBeNull();
  });

  it('should delete a travel preference', async () => {
    const preference = await useCase.create('MXP', new Date('2023-05-01'), new Date('2023-05-10'), 1000);

    const result = await useCase.delete(preference.id!);

    expect(result).toBe(true);
    expect(await useCase.getById(preference.id!)).toBeNull();
  });

  it('should return false when deleting a non-existent travel preference', async () => {
    const result = await useCase.delete('non-existent-id');

    expect(result).toBe(false);
  });
}); 