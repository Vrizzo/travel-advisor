import '@jest/globals';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { FindCompatibleRoutesUseCase } from '../find-compatible-routes.use-case';
import { TravelPreference } from '../../../domain/entities/travel-preference';
import { Route } from '../../../domain/entities/route';
import { TravelPreferenceRepository } from '../../../domain/repositories/travel-preference.repository';
import { RouteRepository } from '../../../domain/repositories/route.repository';

// Mock the global Date
const mockDate = new Date('2023-01-01T12:00:00.000Z');
global.Date = jest.fn(() => mockDate) as any;
(global.Date as any).now = jest.fn(() => mockDate.getTime());

// Create a real TravelPreference instance instead of typecasting
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

  // Properly type the mocks
  const mockTravelPreferenceRepository = {
    findById: jest.fn(),
    findNextToSearch: jest.fn(),
    updateLastSearched: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  } as jest.Mocked<TravelPreferenceRepository>;

  const mockRouteRepository = {
    findByDepartureAirport: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  } as jest.Mocked<RouteRepository>;

  const useCase = new FindCompatibleRoutesUseCase(
    mockTravelPreferenceRepository,
    mockRouteRepository
  );

  beforeEach(() => {
    jest.clearAllMocks();
    mockTravelPreference = createMockPreference();
    
    // Set up the mocks
    mockTravelPreferenceRepository.findById.mockResolvedValue(mockTravelPreference);
    mockTravelPreferenceRepository.findNextToSearch.mockResolvedValue(mockTravelPreference);
    mockTravelPreferenceRepository.updateLastSearched.mockResolvedValue({
      ...mockTravelPreference,
      lastSearchedAt: mockDate
    } as TravelPreference);
    mockRouteRepository.findByDepartureAirport.mockResolvedValue(mockRoutes);
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