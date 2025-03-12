import { jest } from '@jest/globals';

// Create a simple Schema class
class Schema {
  constructor(definition: any, options?: any) {
    // Implementation not needed for mock
  }
}

// Export the mock with proper typing
module.exports = {
  // @ts-ignore
  connect: jest.fn().mockResolvedValue(undefined),
  connection: {
    // @ts-ignore
    close: jest.fn().mockResolvedValue(undefined),
  },
  Schema,
  model: jest.fn().mockReturnValue({
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      // @ts-ignore
      exec: jest.fn().mockResolvedValue([])
    }),
    // @ts-ignore
    findById: jest.fn().mockResolvedValue(null),
    // @ts-ignore
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((doc: any) => Promise.resolve({ ...doc, _id: 'mock-id' })),
    // @ts-ignore
    updateOne: jest.fn().mockResolvedValue({ nModified: 1 }),
    // @ts-ignore
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
  }),
  Types: {
    // @ts-ignore
    ObjectId: jest.fn().mockImplementation((id: any) => id || 'mock-id')
  }
}; 