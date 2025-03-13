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
export declare function formatString(text: string | null | undefined, reverse?: boolean): string;
/**
 * Converts a string to title case (first letter of each word capitalized)
 */
export declare function titleCase(text: string): string;
/**
 * Truncates a string and adds ellipsis if it exceeds maxLength
 */
export declare function truncateWithEllipsis(text: string, maxLength: number): string;
/**
 * Validates a string against various criteria
 * Returns an object with validation results
 */
export declare function validateString(text: string): {
    isValid: boolean;
    hasNumbers: boolean;
    hasSpecialChars: boolean;
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    errors: string[];
};
