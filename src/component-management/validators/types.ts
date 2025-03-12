import { ComponentNode } from '../scanners/ComponentHierarchyScanner';

export interface TestIdRule {
  name: string;
  pattern: RegExp;
  message: string;
  severity: 'error' | 'warning';
  validate: (testId: string, component: ComponentNode) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  rule: string;
  message: string;
  testId: string;
  component: string;
  suggestion?: string;
} 