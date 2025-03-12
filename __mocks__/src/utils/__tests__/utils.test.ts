import { getThis } from '../utils';

describe('Utils', () => {
  describe('getThis', () => {
    it('should return the input text', () => {
      const input = 'test string';
      const result = getThis(input);
      expect(result).toBe(input);
    });

    it('should handle empty string', () => {
      const input = '';
      const result = getThis(input);
      expect(result).toBe('');
    });

    it('should handle special characters', () => {
      const input = '!@#$%^&*()';
      const result = getThis(input);
      expect(result).toBe(input);
    });
  });
}); 