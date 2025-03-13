"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestIdValidator_1 = require("../TestIdValidator");
describe('TestIdValidator', () => {
    let validator;
    beforeEach(() => {
        validator = new TestIdValidator_1.TestIdValidator();
    });
    const createMockComponent = (name, path) => ({
        name,
        path,
        children: [],
        parents: [],
        imports: [],
        testIds: []
    });
    it('should validate correct root component test ID', () => {
        const component = createMockComponent('Button', 'src/components/Button.tsx');
        const result = validator.validate('root_button', component);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    it('should validate correct shared component test ID', () => {
        const component = createMockComponent('Button', 'src/shared/Button.tsx');
        const result = validator.validate('shared_button', component);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    it('should reject invalid prefix', () => {
        const component = createMockComponent('Button', 'src/components/Button.tsx');
        const result = validator.validate('button', component);
        expect(result.isValid).toBe(false);
        expect(result.errors[0].message).toContain('must start with');
    });
    it('should reject incorrect casing', () => {
        const component = createMockComponent('Button', 'src/components/Button.tsx');
        const result = validator.validate('root_Button', component);
        expect(result.isValid).toBe(false);
        expect(result.errors[0].message).toContain('must be lowercase');
    });
});
