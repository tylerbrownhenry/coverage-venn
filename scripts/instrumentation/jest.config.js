/**
 * Jest configuration for instrumentation tests
 */

module.exports = {
  testEnvironment: 'node',
  roots: [
    '.'
  ],
  testMatch: [
    '**/__tests__/**/*.test.js'
  ],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/temp*/**'
  ],
  modulePathIgnorePatterns: [
    '/temp/',
    '/temp-fixed/'
  ],
  setupFilesAfterEnv: [
    './jest.setup.js'
  ],
  testTimeout: 10000,
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    "coverage-tracker": "<rootDir>/__mocks__/coverage-tracker.js",
    "coverage-instrumentation-plugin": "<rootDir>/__mocks__/coverage-instrumentation-plugin.js",
    "\\./coverage-tracker": "<rootDir>/__mocks__/coverage-tracker.js",
    "\\./coverage-instrumentation-plugin": "<rootDir>/__mocks__/coverage-instrumentation-plugin.js",
    "^.+/src/coverage-tracker$": "<rootDir>/__mocks__/coverage-tracker.js",
  }
}; 