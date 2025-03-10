import '@jest/globals';
import { RouteModel } from '../../repositories/mongodb/models/route.model';
import { seedRoutes } from '../route.seeder';

// Set test environment
process.env.NODE_ENV = 'test';

// Mock Route entity
jest.mock('../../../domain/entities/route', () => ({
  Route: jest.fn().mockImplementation((departureAirport, arrivalAirport) => ({
    departureAirport,
    arrivalAirport
  }))
}));

// Mock RouteModel
jest.mock('../../repositories/mongodb/models/route.model', () => ({
  RouteModel: {
    deleteMany: jest.fn().mockResolvedValue({}),
    insertMany: jest.fn().mockResolvedValue([]),
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    countDocuments: jest.fn().mockResolvedValue(0)
  }
}));

describe('Route Seeder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should seed routes successfully', async () => {
    await seedRoutes();

    expect(RouteModel.deleteMany).toHaveBeenCalled();
    expect(RouteModel.insertMany).toHaveBeenCalled();
  });

  it('should clear existing routes before seeding', async () => {
    // First seeding
    await seedRoutes();
    const firstSeedingCount = (RouteModel.insertMany as jest.Mock).mock.calls[0][0].length;

    // Second seeding
    await seedRoutes();
    const secondSeedingCount = (RouteModel.insertMany as jest.Mock).mock.calls[1][0].length;

    expect(firstSeedingCount).toBe(secondSeedingCount);
  });
}); 