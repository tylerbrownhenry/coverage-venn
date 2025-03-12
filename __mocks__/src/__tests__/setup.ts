// Import jest-dom matchers
import '@testing-library/jest-dom';

// Declare the global interface to avoid TypeScript errors
declare global {
  // Modern approach using globalThis
  interface Window {
    mockComponent: (name: string) => {
      name: string;
      timestamp: number;
    };
  }
}

// Adding the property to globalThis directly to fix TypeScript error
const globalAny: any = global;

// Global mock for react-native components if needed later
// jest.mock('react-native', () => { ... });

// Global setup
globalAny.mockComponent = (name: string) => ({
  name,
  timestamp: Date.now()
});

// Add a dummy test to satisfy Jest's requirement
describe('Setup', () => {
  it('should have mockComponent function globally available', () => {
    expect(globalAny.mockComponent).toBeDefined();
    const result = globalAny.mockComponent('test');
    expect(result.name).toBe('test');
    expect(typeof result.timestamp).toBe('number');
  });
}); 