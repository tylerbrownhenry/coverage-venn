import '@testing-library/jest-dom';

// Declare the global interface to avoid TypeScript errors
declare global {
  var mockComponent: (name: string) => {
    name: string;
    timestamp: number;
  };
}

// Mock environment variables
process.env.COVERAGE_TRACKING = 'true';
process.env.TEST_CONTEXT = 'jest';

// Global test utilities
global.mockComponent = (name: string) => ({
  name,
  timestamp: Date.now()
});
