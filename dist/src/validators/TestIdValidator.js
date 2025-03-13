"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestIdValidator = void 0;
class TestIdValidator {
    constructor() {
        this.rules = [
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
    }
    validate(testId, component) {
        const errors = [];
        const warnings = [];
        this.rules.forEach(rule => {
            if (!rule.validate(testId, component)) {
                const error = {
                    rule: rule.name,
                    message: rule.message,
                    testId,
                    component: component.name,
                    suggestion: this.generateSuggestion(rule, component)
                };
                if (rule.severity === 'error') {
                    errors.push(error);
                }
                else {
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
    generateExpectedPrefix(component) {
        const pathSegments = component.path
            .split('/')
            .filter(segment => segment.length > 0);
        const isShared = pathSegments.includes('shared');
        const prefix = isShared ? 'shared' : 'root';
        return `${prefix}_${component.name.toLowerCase()}`;
    }
    generateSuggestion(rule, component) {
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
exports.TestIdValidator = TestIdValidator;
