const mongoose = require('mongoose');
const { TravelPreference } = require('./dist/domain/entities/travel-preference');
const { MongoTravelPreferenceRepository } = require('./dist/infrastructure/repositories/mongodb/mongo-travel-preference.repository');

async function createPreference() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-advisor';
    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB');
    
    const repo = new MongoTravelPreferenceRepository();
    const preference = new TravelPreference(
      'MXP',
      new Date('2023-12-01'),
      new Date('2023-12-15'),
      500
    );
    
    const saved = await repo.save(preference);
    console.log('✅ Created travel preference:', saved);
    
    await mongoose.connection.close();
    console.log('📦 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createPreference(); 