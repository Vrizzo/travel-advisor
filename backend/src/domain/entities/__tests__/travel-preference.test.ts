import '@jest/globals';
import { describe, it, expect } from '@jest/globals';
import { TravelPreference } from '../travel-preference';

describe('TravelPreference', () => {
  const validPreference = {
    departureCity: 'MXP',
    periodFrom: new Date('2023-01-01'),
    periodTo: new Date('2023-01-10'),
    budget: 1000
  };

  it('should create a valid travel preference', () => {
    const travelPreference = new TravelPreference(
      validPreference.departureCity,
      validPreference.periodFrom,
      validPreference.periodTo,
      validPreference.budget
    );

    expect(travelPreference.departureCity).toBe(validPreference.departureCity);
    expect(travelPreference.periodFrom).toEqual(validPreference.periodFrom);
    expect(travelPreference.periodTo).toEqual(validPreference.periodTo);
    expect(travelPreference.budget).toBe(validPreference.budget);
  });

  it('should throw error when departure city is missing', () => {
    expect(() => {
      new TravelPreference(
        '',
        validPreference.periodFrom,
        validPreference.periodTo,
        validPreference.budget
      );
    }).toThrow('Departure city is required');
  });

  it('should throw error when period from date is missing', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        null as any,
        validPreference.periodTo,
        validPreference.budget
      );
    }).toThrow('Period from date is required');
  });

  it('should throw error when period to date is missing', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        null as any,
        validPreference.budget
      );
    }).toThrow('Period to date is required');
  });

  it('should throw error when period from is after period to', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        new Date('2023-01-15'),
        new Date('2023-01-10'),
        validPreference.budget
      );
    }).toThrow('Period from date must be before period to date');
  });

  it('should throw error when budget is negative', () => {
    expect(() => {
      new TravelPreference(
        validPreference.departureCity,
        validPreference.periodFrom,
        validPreference.periodTo,
        -100
      );
    }).toThrow('Budget must be greater than zero');
  });
}); 