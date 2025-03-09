import { describe, expect, it, beforeEach } from '@jest/globals';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { TravelPreferenceUseCase } from '../travel-preference.use-case';

// Mock repository implementation
class MockTravelPreferenceRepository implements TravelPreferenceRepository {
  private preferences: TravelPreference[] = [];

  async save(preference: TravelPreference): Promise<TravelPreference> {
    const newPreference = new TravelPreference(
      preference.departureCity,
      preference.periodFrom,
      preference.periodTo,
      preference.budget,
      'mock-id'
    );
    this.preferences.push(newPreference);
    return newPreference;
  }

  async findAll(): Promise<TravelPreference[]> {
    return this.preferences;
  }

  async findById(id: string): Promise<TravelPreference | null> {
    return this.preferences.find(p => p.id === id) || null;
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
    return this.preferences.length < initialLength;
  }
}

describe('TravelPreferenceUseCase', () => {
  let useCase: TravelPreferenceUseCase;
  let repository: TravelPreferenceRepository;

  const validPreference = {
    departureCity: 'New York',
    periodFrom: '2024-05-01',
    periodTo: '2024-05-10',
    budget: 5000
  };

  beforeEach(() => {
    repository = new MockTravelPreferenceRepository();
    useCase = new TravelPreferenceUseCase(repository);
  });

  describe('createTravelPreference', () => {
    it('should create a new travel preference', async () => {
      const preference = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      expect(preference).toBeDefined();
      expect(preference.departureCity).toBe(validPreference.departureCity);
      expect(preference.id).toBe('mock-id');
    });
  });

  describe('getAllTravelPreferences', () => {
    it('should return all travel preferences', async () => {
      await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const preferences = await useCase.getAllTravelPreferences();
      expect(preferences).toHaveLength(1);
      expect(preferences[0].departureCity).toBe(validPreference.departureCity);
    });
  });

  describe('getTravelPreferenceById', () => {
    it('should return a travel preference by id', async () => {
      const created = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const found = await useCase.getTravelPreferenceById(created.id!);
      expect(found).toBeDefined();
      expect(found?.departureCity).toBe(validPreference.departureCity);
    });

    it('should return null for non-existent id', async () => {
      const found = await useCase.getTravelPreferenceById('non-existent');
      expect(found).toBeNull();
    });
  });

  describe('updateTravelPreference', () => {
    it('should update an existing travel preference', async () => {
      const created = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const updated = await useCase.updateTravelPreference(
        created.id!,
        'Los Angeles',
        validPreference.periodFrom,
        validPreference.periodTo,
        6000
      );

      expect(updated).toBeDefined();
      expect(updated?.departureCity).toBe('Los Angeles');
      expect(updated?.budget).toBe(6000);
    });

    it('should return null when updating non-existent preference', async () => {
      const updated = await useCase.updateTravelPreference(
        'non-existent',
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      expect(updated).toBeNull();
    });
  });

  describe('deleteTravelPreference', () => {
    it('should delete an existing travel preference', async () => {
      const created = await useCase.createTravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );

      const deleted = await useCase.deleteTravelPreference(created.id!);
      expect(deleted).toBe(true);

      const found = await useCase.getTravelPreferenceById(created.id!);
      expect(found).toBeNull();
    });

    it('should return false when deleting non-existent preference', async () => {
      const deleted = await useCase.deleteTravelPreference('non-existent');
      expect(deleted).toBe(false);
    });
  });
}); 