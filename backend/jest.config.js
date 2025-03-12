module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '^mongoose$': '<rootDir>/src/test/mocks/mongoose.ts',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  }
}; 