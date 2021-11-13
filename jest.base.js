module.exports = {
  config: {
    preset: 'ts-jest',
    resetMocks: true,
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePathIgnorePatterns: [
      '<rootDir>/build/',
      '<rootDir>/dist/',
      '<rootDir>/.*/__mocks__',
    ],
    testEnvironment: 'node',
  },
};
