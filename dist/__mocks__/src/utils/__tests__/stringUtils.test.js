"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringUtils_1 = require("../stringUtils");
describe('stringUtils', () => {
    describe('formatString', () => {
        it('returns empty string for null or undefined input', () => {
            expect((0, stringUtils_1.formatString)(null)).toBe('');
            expect((0, stringUtils_1.formatString)(undefined)).toBe('');
        });
        it('returns uppercase for strings less than 5 characters', () => {
            expect((0, stringUtils_1.formatString)('abc')).toBe('ABC');
            expect((0, stringUtils_1.formatString)('hi')).toBe('HI');
        });
        it('returns title case for strings between 5-10 characters', () => {
            // Note: 'hello' is exactly 5 chars, so it will be title-cased
            expect((0, stringUtils_1.formatString)('hello')).toBe('Hello');
            // Note: 'hello world' is 11 chars (including space), so it gets truncated
            expect((0, stringUtils_1.formatString)('hello you')).toBe('Hello You');
        });
        // Note: We're deliberately not testing strings > 10 chars
        // and the reverse option to demonstrate partial coverage
    });
    describe('titleCase', () => {
        it('capitalizes the first letter of each word', () => {
            expect((0, stringUtils_1.titleCase)('hello world')).toBe('Hello World');
            expect((0, stringUtils_1.titleCase)('test string')).toBe('Test String');
        });
        it('returns empty string for empty input', () => {
            expect((0, stringUtils_1.titleCase)('')).toBe('');
        });
        // Not testing multiple spaces or edge cases
    });
    describe('validateString', () => {
        it('returns validation results for a simple string', () => {
            const result = (0, stringUtils_1.validateString)('Test123');
            expect(result.isValid).toBe(true);
            expect(result.hasNumbers).toBe(true);
            expect(result.hasUpperCase).toBe(true);
            expect(result.hasLowerCase).toBe(true);
            expect(result.hasSpecialChars).toBe(false);
            expect(result.errors).toHaveLength(0);
        });
        it('identifies invalid empty strings', () => {
            const result = (0, stringUtils_1.validateString)('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('String cannot be empty');
        });
        // Not testing other validation rules like:
        // - String length < 3
        // - Trailing/leading spaces
        // - Double spaces
    });
    // Note: We're completely skipping tests for truncateWithEllipsis
    // to demonstrate partial coverage
});
