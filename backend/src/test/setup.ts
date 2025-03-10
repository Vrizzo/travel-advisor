import '@jest/globals';
// Mock MongoDB connection
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(undefined),
    connection: {
      close: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      once: jest.fn(),
    },
  };
});

beforeAll(async () => {
  // No need to actually connect to MongoDB
  console.log('Using mock MongoDB connection');
});

afterAll(async () => {
  // No need to actually close connection
  console.log('Mock MongoDB connection closed');
}); 