import '@jest/globals';

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.KIWI_API_KEY = 'test-api-key';

beforeAll(async () => {
  console.log('Using mock MongoDB connection');
});

afterAll(async () => {
  console.log('Mock MongoDB connection closed');
}); 