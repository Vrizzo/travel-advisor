// Mock mongoose module
module.exports = {
  connect: jest.fn().mockImplementation(() => Promise.resolve()),
  connection: {
    close: jest.fn().mockImplementation(() => Promise.resolve()),
  },
  // Add other needed methods here
}; 