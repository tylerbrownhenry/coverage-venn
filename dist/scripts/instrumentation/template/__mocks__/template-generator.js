"use strict";
/**
 * Mock for template generator
 */
// Mock template generator functions
const templateGenerator = {
    // Mock function to generate a file from a template
    generateFromTemplate: jest.fn((templatePath, outputPath, replacements) => {
        return {
            templatePath,
            outputPath,
            replacements,
            success: true
        };
    }),
    // Mock function to list available templates
    listTemplates: jest.fn(() => {
        return [
            '{TYPE}-plugin.js.template',
            'test-{TYPE}.js.template',
            'test-{TYPE}-fixed.js.template'
        ];
    }),
    // Mock function to validate a template
    validateTemplate: jest.fn((templateContent) => {
        return {
            isValid: templateContent.includes('{{TYPE}}'),
            errors: []
        };
    })
};
module.exports = templateGenerator;
