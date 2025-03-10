import '@jest/globals';
import { RouteModel } from '../../repositories/mongodb/models/route.model';
import { seedRoutes } from '../route.seeder';

describe('Route Seeder', () => {
  beforeEach(async () => {
    await RouteModel.deleteMany({});
  });

  it('should seed routes successfully', async () => {
    await seedRoutes();

    const routes = await RouteModel.find({});
    expect(routes.length).toBeGreaterThan(0);

    // Check if some expected routes exist
    const lhrToCdg = await RouteModel.findOne({ departureAirport: 'LHR', arrivalAirport: 'CDG' });
    expect(lhrToCdg).toBeTruthy();

    const fcoToMxp = await RouteModel.findOne({ departureAirport: 'FCO', arrivalAirport: 'MXP' });
    expect(fcoToMxp).toBeTruthy();

    const linToBgy = await RouteModel.findOne({ departureAirport: 'LIN', arrivalAirport: 'BGY' });
    expect(linToBgy).toBeTruthy();
  });

  it('should clear existing routes before seeding', async () => {
    // First seeding
    await seedRoutes();
    const firstSeedingCount = await RouteModel.countDocuments();

    // Second seeding
    await seedRoutes();
    const secondSeedingCount = await RouteModel.countDocuments();

    expect(firstSeedingCount).toBe(secondSeedingCount);
  });
}); 