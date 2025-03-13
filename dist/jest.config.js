"use strict";
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.json',
        },
    },
    rootDir: './',
    // Include both src and scripts/instrumentation directories
    roots: [
        '<rootDir>/src',
        '<rootDir>/__mocks__',
        '<rootDir>/scripts/instrumentation'
    ],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
                tsconfig: 'tsconfig.json',
                isolatedModules: true,
            }],
    },
    // Combined testMatch for both TypeScript files and JS files
    testMatch: [
        "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
        "<rootDir>/src/**/*.{spec,test}.{ts,tsx}",
        "<rootDir>/__mocks__/src/**/__tests__/**/*.{ts,tsx}",
        "<rootDir>/__mocks__/src/**/*.{spec,test}.{ts,tsx}",
        "<rootDir>/scripts/instrumentation/**/__tests__/**/*.test.js"
    ],
    // Combine collectCoverageFrom from both configurations
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "__mocks__/src/**/*.{ts,tsx}",
        "scripts/instrumentation/**/*.js",
        "!src/**/*.d.ts",
        "!src/**/*.stories.*",
        "!src/**/*.test.*",
        "!src/**/*.spec.*",
        "!src/**/__tests__/**/*.*",
        "!__mocks__/src/**/*.d.ts",
        "!__mocks__/src/**/*.stories.*",
        "!__mocks__/src/**/*.test.*",
        "!__mocks__/src/**/*.spec.*",
        "!__mocks__/src/**/__tests__/**/*.*",
        "!**/node_modules/**",
        "!**/__tests__/**",
        "!**/__mocks__/**",
        "!**/temp*/**"
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    clearMocks: true,
    // Enhanced coverage settings
    coverageDirectory: '<rootDir>/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'html', 'json-summary'],
    coverageProvider: 'v8', // Use V8 provider for more accurate coverage
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/dist/',
        '/__tests__/'
    ],
    // Settings to help with accurate coverage reporting
    collectCoverage: true,
    automock: false,
    verbose: true,
};
