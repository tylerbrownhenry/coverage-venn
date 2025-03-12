/**
 * Test file for string utilities with various code constructs
 * to test instrumentation.
 * 
 * This file contains a mix of:
 * - If/else statements
 * - Ternary expressions
 * - Switch statements
 * - Try/catch blocks
 * - Function declarations
 */

const stringUtils = {
  /**
   * Capitalizes the first letter of a string
   */
  capitalize(str) {
    if (!str) {
      return '';
    }
    
    try {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    } catch (error) {
      console.error('Error capitalizing string:', error);
      return str;
    }
  },
  
  /**
   * Truncates a string to a specified length
   */
  truncate(str, maxLength, suffix = '...') {
    if (!str) {
      return '';
    }
    
    const length = typeof maxLength === 'number' ? maxLength : 30;
    return str.length <= length ? str : `${str.substr(0, length)}${suffix}`;
  },
  
  /**
   * Formats a string based on the specified type
   */
  format(str, type) {
    if (!str) {
      return '';
    }
    
    switch (type) {
      case 'uppercase':
        return str.toUpperCase();
      case 'lowercase':
        return str.toLowerCase();
      case 'capitalize':
        return this.capitalize(str);
      case 'title':
        return str.split(' ')
          .map(word => this.capitalize(word))
          .join(' ');
      default:
        return str;
    }
  },
  
  /**
   * Extracts initials from a name
   */
  getInitials(name) {
    try {
      if (!name) {
        throw new Error('Name is required');
      }
      
      return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase();
    } catch (error) {
      console.warn('Failed to get initials:', error.message);
      return '';
    } finally {
      // Logging can go here in finally block
    }
  },
  
  /**
   * Removes special characters from a string
   */
  removeSpecialChars(str) {
    return str ? str.replace(/[^\w\s]/gi, '') : '';
  },
  
  /**
   * Checks if a string is valid JSON
   */
  isValidJson(str) {
    if (!str) return false;
    
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
};

describe('String Utilities', () => {
  describe('capitalize', () => {
    test('should capitalize first letter', () => {
      expect(stringUtils.capitalize('hello')).toBe('Hello');
    });
    
    test('should handle empty string', () => {
      expect(stringUtils.capitalize('')).toBe('');
    });
    
    test('should handle null', () => {
      expect(stringUtils.capitalize(null)).toBe('');
    });
  });
  
  describe('truncate', () => {
    test('should truncate string if longer than maxLength', () => {
      expect(stringUtils.truncate('This is a long string', 10)).toBe('This is a ...');
    });
    
    test('should not truncate if string is shorter than maxLength', () => {
      expect(stringUtils.truncate('Short', 10)).toBe('Short');
    });
    
    test('should use custom suffix', () => {
      expect(stringUtils.truncate('This is a long string', 10, ' [...]')).toBe('This is a  [...]');
    });
  });
  
  describe('format', () => {
    test('should format to uppercase', () => {
      expect(stringUtils.format('hello', 'uppercase')).toBe('HELLO');
    });
    
    test('should format to lowercase', () => {
      expect(stringUtils.format('HELLO', 'lowercase')).toBe('hello');
    });
    
    test('should capitalize string', () => {
      expect(stringUtils.format('hello world', 'capitalize')).toBe('Hello world');
    });
    
    test('should format to title case', () => {
      expect(stringUtils.format('hello world', 'title')).toBe('Hello World');
    });
    
    test('should return original string for unknown format', () => {
      expect(stringUtils.format('hello', 'unknown')).toBe('hello');
    });
  });
  
  describe('getInitials', () => {
    test('should get initials from name', () => {
      expect(stringUtils.getInitials('John Doe')).toBe('JD');
    });
    
    test('should handle empty string', () => {
      expect(stringUtils.getInitials('')).toBe('');
    });
  });
  
  describe('removeSpecialChars', () => {
    test('should remove special characters', () => {
      expect(stringUtils.removeSpecialChars('Hello, World!')).toBe('Hello World');
    });
  });
  
  describe('isValidJson', () => {
    test('should return true for valid JSON', () => {
      expect(stringUtils.isValidJson('{"name":"John"}')).toBe(true);
    });
    
    test('should return false for invalid JSON', () => {
      expect(stringUtils.isValidJson('{name:John}')).toBe(false);
    });
  });
}); 