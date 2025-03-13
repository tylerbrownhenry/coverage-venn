"use strict";
/**
 * Babel configuration for Jest with instrumentation support.
 *
 * This configuration will be used by Jest when transforming files for testing.
 * It includes our custom instrumentation plugin when the environment variable
 * COVERAGE_INSTRUMENTATION is set to 'true'.
 *
 * Usage:
 *   COVERAGE_INSTRUMENTATION=true jest
 */
const path = require('path');
// Get the project root directory
const projectRoot = path.resolve(__dirname, '../../..');
// Get the absolute path to the instrumentation plugin
const pluginPath = path.resolve(__dirname, '../babel/coverage-instrumentation-plugin.js');
module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    plugins: [
        // Only include our instrumentation plugin when the env var is set
        process.env.COVERAGE_INSTRUMENTATION === 'true' ?
            [pluginPath] :
            []
    ].filter(Boolean), // Filter out empty entries
    // Configure the module resolver to handle absolute imports
    sourceType: 'unambiguous'
};
