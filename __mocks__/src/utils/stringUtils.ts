/**
 * String utility functions with complex branching logic
 */

/**
 * Formats a string based on different criteria
 * - If the string is null or undefined, returns an empty string
 * - If the string is less than 5 characters, returns it uppercase
 * - If the string is between 5-10 characters, returns it title case
 * - If the string is over 10 characters, truncates it and adds ellipsis
 * - If the 'reverse' flag is true, it reverses the string first
 */
export function formatString(text: string | null | undefined, reverse = false): string {
  // Handle null/undefined case
  if (text === null || text === undefined) {
    return '';
  }

  // Optional reversal
  let processedText = reverse ? text.split('').reverse().join('') : text;
  
  // Format based on length
  if (processedText.length < 5) {
    return processedText.toUpperCase();
  } else if (processedText.length <= 10) {
    return titleCase(processedText);
  } else {
    return truncateWithEllipsis(processedText, 10);
  }
}

/**
 * Converts a string to title case (first letter of each word capitalized)
 */
export function titleCase(text: string): string {
  if (!text) return '';
  
  // Split by spaces and capitalize first letter of each word
  return text
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Truncates a string and adds ellipsis if it exceeds maxLength
 */
export function truncateWithEllipsis(text: string, maxLength: number): string {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  // Check if we're cutting in the middle of a word
  const nextSpaceIndex = text.indexOf(' ', maxLength - 3);
  
  if (nextSpaceIndex !== -1 && nextSpaceIndex < maxLength + 5) {
    // If there's a space nearby, cut at the space
    return text.substring(0, nextSpaceIndex) + '...';
  } else {
    // Otherwise cut at exact length
    return text.substring(0, maxLength - 3) + '...';
  }
}

/**
 * Validates a string against various criteria
 * Returns an object with validation results
 */
export function validateString(text: string): { 
  isValid: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  errors: string[];
} {
  const result = {
    isValid: true,
    hasNumbers: false,
    hasSpecialChars: false,
    hasUpperCase: false,
    hasLowerCase: false,
    errors: [] as string[]
  };
  
  if (!text) {
    result.isValid = false;
    result.errors.push('String cannot be empty');
    return result;
  }
  
  // Check for numbers
  result.hasNumbers = /\d/.test(text);
  
  // Check for special characters
  result.hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(text);
  
  // Check for uppercase letters
  result.hasUpperCase = /[A-Z]/.test(text);
  
  // Check for lowercase letters
  result.hasLowerCase = /[a-z]/.test(text);
  
  // Complex validation logic
  if (text.length < 3) {
    result.isValid = false;
    result.errors.push('String must be at least 3 characters long');
  }
  
  if (text.trim() !== text) {
    result.isValid = false;
    result.errors.push('String should not have leading or trailing spaces');
  }
  
  if (text.includes('  ')) {
    result.isValid = false;
    result.errors.push('String should not have double spaces');
  }
  
  return result;
} 