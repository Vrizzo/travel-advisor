import '@jest/globals';
import mongoose from 'mongoose';

// Add any global test setup here
beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-advisor-test');
});

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
}); 