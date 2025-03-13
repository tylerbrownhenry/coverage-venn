"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import jest-dom matchers
require("@testing-library/jest-dom");
// Adding the property to globalThis directly to fix TypeScript error
const globalAny = global;
// Global mock for react-native components if needed later
// jest.mock('react-native', () => { ... });
// Global setup
globalAny.mockComponent = (name) => ({
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
