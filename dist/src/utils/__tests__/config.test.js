"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
// Just mock the console.log to avoid noise in tests
jest.spyOn(console, 'log').mockImplementation(() => { });
describe('getConfig', () => {
    // Store original require and process.env
    const originalEnv = process.env;
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });
    afterEach(() => {
        process.env = originalEnv;
    });
    it('should throw error when required config is missing', () => {
        expect(() => (0, config_1.getConfig)('missing', { required: true }))
            .toThrow('Could not find config');
    });
    it('should return empty object when no config is found', () => {
        const config = (0, config_1.getConfig)('missing');
        expect(config).toEqual({});
    });
});
