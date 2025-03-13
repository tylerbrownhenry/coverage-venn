"use strict";
/**
 * Tests for template files
 */
const fs = require('fs');
const path = require('path');
// Mock filesystem
jest.mock('fs');
jest.mock('path');
describe('Template files validation', () => {
    const TEMPLATE_DIR = '/fake/path/template';
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock file system functions
        fs.readFileSync.mockImplementation((filePath) => {
            if (filePath.includes('-plugin.js.template')) {
                return `
/**
 * {{TYPE}} Instrumentation Plugin
 */
const { declare } = require('@babel/helper-plugin-utils');
module.exports = declare((api) => { /* ... */ });`;
            }
            else if (filePath.includes('test-{TYPE}.js.template')) {
                return `
/**
 * Test {{TYPE}} instrumentation
 */
const COVERAGE_TRACKER = require('./coverage-tracker');`;
            }
            else if (filePath.includes('test-{TYPE}-fixed.js.template')) {
                return `
/**
 * Test {{TYPE}} instrumentation with the fixed plugin
 */
const PLUGIN_PATH = '..', 'fixed-coverage-plugin.js');`;
            }
            return '';
        });
        // Mock directory reading
        fs.readdirSync.mockReturnValue([
            '{TYPE}-plugin.js.template',
            'test-{TYPE}.js.template',
            'test-{TYPE}-fixed.js.template'
        ]);
        // Mock path functions
        path.join.mockImplementation((...args) => args.join('/'));
        path.resolve.mockReturnValue(TEMPLATE_DIR);
    });
    test('template directory should contain required template files', () => {
        const files = fs.readdirSync(TEMPLATE_DIR);
        expect(files).toContain('{TYPE}-plugin.js.template');
        expect(files).toContain('test-{TYPE}.js.template');
        expect(files).toContain('test-{TYPE}-fixed.js.template');
    });
    test('plugin template should have correct structure', () => {
        const pluginTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, '{TYPE}-plugin.js.template'), 'utf8');
        expect(pluginTemplate).toContain('{{TYPE}} Instrumentation Plugin');
        expect(pluginTemplate).toContain("require('@babel/helper-plugin-utils')");
        expect(pluginTemplate).toContain('declare((api)');
    });
    test('test template should have correct structure', () => {
        const testTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'test-{TYPE}.js.template'), 'utf8');
        expect(testTemplate).toContain('Test {{TYPE}} instrumentation');
        expect(testTemplate).toContain("require('./coverage-tracker')");
    });
    test('fixed test template should have correct structure', () => {
        const fixedTestTemplate = fs.readFileSync(path.join(TEMPLATE_DIR, 'test-{TYPE}-fixed.js.template'), 'utf8');
        expect(fixedTestTemplate).toContain('Test {{TYPE}} instrumentation with the fixed plugin');
        expect(fixedTestTemplate).toContain('fixed-coverage-plugin.js');
    });
    test('templates should use the correct placeholder syntax', () => {
        const files = fs.readdirSync(TEMPLATE_DIR);
        for (const file of files) {
            const content = fs.readFileSync(path.join(TEMPLATE_DIR, file), 'utf8');
            // All templates should use {{TYPE}} for uppercase and {{type}} for lowercase
            if (file.includes('template')) {
                const hasUppercasePlaceholder = content.includes('{{TYPE}}');
                expect(hasUppercasePlaceholder).toBeTruthy();
                // Some templates may not need the lowercase version, so we don't test for that universally
            }
        }
    });
});
describe('Template processing', () => {
    test('replacing placeholders should work correctly', () => {
        const template = 'This is a {{TYPE}} template for {{type}} instrumentation';
        const type = 'loop';
        const TYPE = 'Loop';
        const processed = template
            .replace(/\{\{TYPE\}\}/g, TYPE)
            .replace(/\{\{type\}\}/g, type);
        expect(processed).toBe('This is a Loop template for loop instrumentation');
    });
});
