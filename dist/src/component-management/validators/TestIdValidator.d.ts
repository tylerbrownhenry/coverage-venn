import { ComponentNode } from '../scanners/ComponentHierarchyScanner';
import { ValidationResult } from './types';
export declare class TestIdValidator {
    private rules;
    validate(testId: string, component: ComponentNode): ValidationResult;
    private generateExpectedPrefix;
    private generateSuggestion;
}
