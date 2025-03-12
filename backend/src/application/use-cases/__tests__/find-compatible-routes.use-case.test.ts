import '@jest/globals';
import { jest, describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import { FindCompatibleRoutesUseCase } from '../find-compatible-routes.use-case';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { Route } from '../../../domain/entities/route';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { RouteRepository } from '../../../domain/repositories/route.repository';
import { FlightRepository } from '../../../domain/repositories/flight.repository';
import '../../../test/jest.d.ts';

// Set NODE_ENV to test to disable the actual KiwiClient initialization
process.env.NODE_ENV = 'test';

// Mock the global Date
const mockDate = new Date('2023-01-01T12:00:00.000Z');

// Mock global Date
jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
// Mock Date.now
const originalNow = Date.now;
Date.now = jest.fn(() => mockDate.getTime());

// Create a real TravelPreference instance
const createMockPreference = (): TravelPreference => {
  const periodFrom = new Date('2023-02-01');
  const periodTo = new Date('2023-02-15');
  return new TravelPreference('MXP', periodFrom, periodTo, 1000, '1');
};

describe('FindCompatibleRoutesUseCase', () => {
  let mockTravelPreference: TravelPreference;
  
  const mockRoutes = [
    new Route('MXP', 'LHR'),
    new Route('MXP', 'CDG'),
    new Route('MXP', 'AMS')
  ];

  // Initialize mocks
  const mockTravelPreferenceRepository: jest.Mocked<TravelPreferenceRepository> = {
    findById: jest.fn(),
    findNextToSearch: jest.fn(),
    updateLastSearched: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const mockRouteRepository: jest.Mocked<RouteRepository> = {
    findByDepartureAirport: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  };

  const mockFlightRepository: jest.Mocked<FlightRepository> = {
    save: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByTravelPreferenceId: jest.fn(),
    findByRoute: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteByTravelPreferenceId: jest.fn()
  };

  const useCase = new FindCompatibleRoutesUseCase(
    mockTravelPreferenceRepository,
    mockRouteRepository,
    mockFlightRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockTravelPreference = createMockPreference();
    
    // Setup mock implementations
    mockTravelPreferenceRepository.findById.mockResolvedValue(mockTravelPreference);
    mockTravelPreferenceRepository.findNextToSearch.mockResolvedValue(mockTravelPreference);
    mockTravelPreferenceRepository.updateLastSearched.mockResolvedValue(mockTravelPreference);
    mockRouteRepository.findByDepartureAirport.mockResolvedValue(mockRoutes);
  });

  afterAll(() => {
    // Restore Date.now
    Date.now = originalNow;
  });

  it('should find compatible routes for a travel preference and update lastSearchedAt', async () => {
    const result = await useCase.execute('1');

    expect(result.preference).toBe(mockTravelPreference);
    expect(result.compatibleRoutes).toEqual(mockRoutes);
    expect(mockTravelPreferenceRepository.findById).toHaveBeenCalledWith('1');
    expect(mockRouteRepository.findByDepartureAirport).toHaveBeenCalledWith('MXP');
    expect(mockTravelPreferenceRepository.updateLastSearched).toHaveBeenCalledWith('1', mockDate);
  });

  it('should throw error when travel preference is not found', async () => {
    mockTravelPreferenceRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute('1')).rejects.toThrow('Travel preference with id 1 not found');
  });

  it('should find the next preference to search', async () => {
    const result = await useCase.findNextPreferenceToSearch();

    expect(result).toBe(mockTravelPreference);
    expect(mockTravelPreferenceRepository.findNextToSearch).toHaveBeenCalled();
  });

  it('should execute search for the next preference', async () => {
    const result = await useCase.executeNextSearch();

    expect(result!.preference).toBe(mockTravelPreference);
    expect(result!.compatibleRoutes).toEqual(mockRoutes);
    expect(mockTravelPreferenceRepository.findNextToSearch).toHaveBeenCalled();
    expect(mockTravelPreferenceRepository.findById).toHaveBeenCalledWith('1');
    expect(mockRouteRepository.findByDepartureAirport).toHaveBeenCalledWith('MXP');
    expect(mockTravelPreferenceRepository.updateLastSearched).toHaveBeenCalledWith('1', mockDate);
  });

  it('should return null when there are no preferences to search', async () => {
    mockTravelPreferenceRepository.findNextToSearch.mockResolvedValueOnce(null);

    const result = await useCase.executeNextSearch();

    expect(result).toBeNull();
    expect(mockTravelPreferenceRepository.findNextToSearch).toHaveBeenCalled();
    expect(mockTravelPreferenceRepository.findById).not.toHaveBeenCalled();
  });
}); 