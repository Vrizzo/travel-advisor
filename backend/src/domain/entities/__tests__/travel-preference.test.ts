import { describe, expect, it } from '@jest/globals';
import { TravelPreference } from '../travel-preference';

describe('TravelPreference', () => {
  const validPreference = {
    departureCity: 'New York',
    periodFrom: '2024-05-01',
    periodTo: '2024-05-10',
    budget: 5000,
    id: '123'
  };

  it('should create a valid travel preference', () => {
    const preference = new TravelPreference(
      validPreference.departureCity,
      validPreference.periodFrom,
      validPreference.periodTo,
      validPreference.budget,
      validPreference.id
    );

    expect(preference.departureCity).toBe(validPreference.departureCity);
    expect(preference.periodFrom).toBe(validPreference.periodFrom);
    expect(preference.periodTo).toBe(validPreference.periodTo);
    expect(preference.budget).toBe(validPreference.budget);
    expect(preference.id).toBe(validPreference.id);
  });

  it('should throw error when departure city is empty', () => {
    expect(() => {
      new TravelPreference(
        '',
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );
    }).toThrow('Departure city is required');
  });

  it('should throw error when period from is invalid', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        'invalid-date',
        validPreference.periodTo,
        validPreference.budget
      );
    }).toThrow('Period from must be a valid date in YYYY-MM-DD format');
  });

  it('should throw error when period to is invalid', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        'invalid-date',
        validPreference.budget
      );
    }).toThrow('Period to must be a valid date in YYYY-MM-DD format');
  });

  it('should throw error when budget is negative', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        -100
      );
    }).toThrow('Budget must be a positive number');
  });
}); 