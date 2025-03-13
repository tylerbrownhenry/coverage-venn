"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
describe('Utils', () => {
    describe('getThis', () => {
        it('should return the input text', () => {
            const input = 'test string';
            const result = (0, utils_1.getThis)(input);
            expect(result).toBe(input);
        });
        it('should handle empty string', () => {
            const input = '';
            const result = (0, utils_1.getThis)(input);
            expect(result).toBe('');
        });
        it('should handle special characters', () => {
            const input = '!@#$%^&*()';
            const result = (0, utils_1.getThis)(input);
            expect(result).toBe(input);
        });
    });
});
