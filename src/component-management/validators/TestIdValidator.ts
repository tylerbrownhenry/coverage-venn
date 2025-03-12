import { ComponentNode } from '../scanners/ComponentHierarchyScanner';
import { TestIdRule, ValidationResult, ValidationError } from './types';

export class TestIdValidator {
  private rules: TestIdRule[] = [
    {
      name: 'prefix',
      pattern: /^(root|shared)_/,
      message: 'Test ID must start with "root_" or "shared_"',
      severity: 'error',
      validate: (testId) => /^(root|shared)_/.test(testId)
    },
    {
      name: 'case',
      pattern: /^[a-z]+(_[a-z]+)*$/,
      message: 'Test ID must be lowercase with underscore separators',
      severity: 'error',
      validate: (testId) => /^[a-z]+(_[a-z]+)*$/.test(testId)
    },
    {
      name: 'hierarchy',
      pattern: /^.*$/,
      message: 'Test ID must reflect component hierarchy',
      severity: 'error',
      validate: (testId, component) => {
        const expectedPrefix = this.generateExpectedPrefix(component);
        return testId.startsWith(expectedPrefix);
      }
    }
  ];

  validate(testId: string, component: ComponentNode): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    this.rules.forEach(rule => {
      if (!rule.validate(testId, component)) {
        const error: ValidationError = {
          rule: rule.name,
          message: rule.message,
          testId,
          component: component.name,
          suggestion: this.generateSuggestion(rule, component)
        };

        if (rule.severity === 'error') {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private generateExpectedPrefix(component: ComponentNode): string {
    const pathSegments = component.path
      .split('/')
      .filter(segment => segment.length > 0);
    
    const isShared = pathSegments.includes('shared');
    const prefix = isShared ? 'shared' : 'root';
    
    return `${prefix}_${component.name.toLowerCase()}`;
  }

  private generateSuggestion(rule: TestIdRule, component: ComponentNode): string {
    switch (rule.name) {
      case 'prefix':
        return this.generateExpectedPrefix(component);
      case 'case':
        return component.name.toLowerCase();
      case 'hierarchy':
        return this.generateExpectedPrefix(component);
      default:
        return '';
    }
  }
}
