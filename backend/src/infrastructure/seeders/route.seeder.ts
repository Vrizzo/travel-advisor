import mongoose from 'mongoose';
import { RouteModel } from '../repositories/mongodb/models/route.model';
import { Route } from '../../domain/entities/route';

const routes: Route[] = [
  // Major European Hubs
  new Route('LHR', 'CDG'),
  new Route('LHR', 'AMS'),
  new Route('LHR', 'FRA'),
  new Route('LHR', 'MAD'),
  new Route('LHR', 'FCO'),
  new Route('LHR', 'MXP'),
  new Route('LHR', 'VCE'),
  new Route('LHR', 'NAP'),

  new Route('CDG', 'LHR'),
  new Route('CDG', 'AMS'),
  new Route('CDG', 'FRA'),
  new Route('CDG', 'MAD'),
  new Route('CDG', 'FCO'),
  new Route('CDG', 'MXP'),
  new Route('CDG', 'VCE'),
  new Route('CDG', 'NAP'),

  new Route('AMS', 'LHR'),
  new Route('AMS', 'CDG'),
  new Route('AMS', 'FRA'),
  new Route('AMS', 'MAD'),
  new Route('AMS', 'FCO'),
  new Route('AMS', 'MXP'),
  new Route('AMS', 'VCE'),
  new Route('AMS', 'NAP'),

  new Route('FRA', 'LHR'),
  new Route('FRA', 'CDG'),
  new Route('FRA', 'AMS'),
  new Route('FRA', 'MAD'),
  new Route('FRA', 'FCO'),
  new Route('FRA', 'MXP'),
  new Route('FRA', 'VCE'),
  new Route('FRA', 'NAP'),

  // Italian Airports
  new Route('FCO', 'LHR'),
  new Route('FCO', 'CDG'),
  new Route('FCO', 'AMS'),
  new Route('FCO', 'FRA'),
  new Route('FCO', 'MAD'),
  new Route('FCO', 'MXP'),
  new Route('FCO', 'VCE'),
  new Route('FCO', 'NAP'),

  new Route('MXP', 'LHR'),
  new Route('MXP', 'CDG'),
  new Route('MXP', 'AMS'),
  new Route('MXP', 'FRA'),
  new Route('MXP', 'MAD'),
  new Route('MXP', 'FCO'),
  new Route('MXP', 'VCE'),
  new Route('MXP', 'NAP'),

  new Route('VCE', 'LHR'),
  new Route('VCE', 'CDG'),
  new Route('VCE', 'AMS'),
  new Route('VCE', 'FRA'),
  new Route('VCE', 'MAD'),
  new Route('VCE', 'FCO'),
  new Route('VCE', 'MXP'),
  new Route('VCE', 'NAP'),

  new Route('NAP', 'LHR'),
  new Route('NAP', 'CDG'),
  new Route('NAP', 'AMS'),
  new Route('NAP', 'FRA'),
  new Route('NAP', 'MAD'),
  new Route('NAP', 'FCO'),
  new Route('NAP', 'MXP'),
  new Route('NAP', 'VCE'),

  // Secondary European Routes
  new Route('MAD', 'LHR'),
  new Route('MAD', 'CDG'),
  new Route('MAD', 'AMS'),
  new Route('MAD', 'FRA'),
  new Route('MAD', 'FCO'),
  new Route('MAD', 'MXP'),
  new Route('MAD', 'VCE'),
  new Route('MAD', 'NAP'),

  // Milan Airports
  // Linate (LIN) routes
  new Route('LIN', 'LHR'),
  new Route('LIN', 'CDG'),
  new Route('LIN', 'AMS'),
  new Route('LIN', 'FRA'),
  new Route('LIN', 'MAD'),
  new Route('LIN', 'FCO'),
  new Route('LIN', 'MXP'),
  new Route('LIN', 'VCE'),
  new Route('LIN', 'NAP'),
  new Route('LIN', 'BGY'),

  // Bergamo (BGY) routes
  new Route('BGY', 'LHR'),
  new Route('BGY', 'CDG'),
  new Route('BGY', 'AMS'),
  new Route('BGY', 'FRA'),
  new Route('BGY', 'MAD'),
  new Route('BGY', 'FCO'),
  new Route('BGY', 'MXP'),
  new Route('BGY', 'VCE'),
  new Route('BGY', 'NAP'),
  new Route('BGY', 'LIN'),

  // Return routes for Linate (LIN)
  new Route('LHR', 'LIN'),
  new Route('CDG', 'LIN'),
  new Route('AMS', 'LIN'),
  new Route('FRA', 'LIN'),
  new Route('MAD', 'LIN'),
  new Route('FCO', 'LIN'),
  new Route('MXP', 'LIN'),
  new Route('VCE', 'LIN'),
  new Route('NAP', 'LIN'),

  // Return routes for Bergamo (BGY)
  new Route('LHR', 'BGY'),
  new Route('CDG', 'BGY'),
  new Route('AMS', 'BGY'),
  new Route('FRA', 'BGY'),
  new Route('MAD', 'BGY'),
  new Route('FCO', 'BGY'),
  new Route('MXP', 'BGY'),
  new Route('VCE', 'BGY'),
  new Route('NAP', 'BGY'),
];

export async function seedRoutes(): Promise<void> {
  try {
    // Clear existing routes
    await RouteModel.deleteMany({});

    // Insert new routes
    await RouteModel.insertMany(routes);

    console.log('✅ Routes seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding routes:', error);
    throw error;
  }
}

// Run seeder if this script is run directly
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-advisor')
    .then(() => {
      console.log('📦 Connected to MongoDB');
      return seedRoutes();
    })
    .then(() => {
      console.log('🌱 Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
} 