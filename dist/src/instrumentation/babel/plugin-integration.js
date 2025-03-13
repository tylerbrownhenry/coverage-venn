"use strict";
/**
 * Coverage Babel Plugin Integration
 *
 * This module provides helpers to integrate the coverage instrumentation
 * Babel plugin with various build systems including:
 * - Webpack
 * - Metro (React Native)
 * - Jest
 * - Babel CLI
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBabelConfig = createBabelConfig;
exports.createWebpackConfig = createWebpackConfig;
exports.createMetroConfig = createMetroConfig;
exports.createJestConfig = createJestConfig;
exports.shouldInstrumentFile = shouldInstrumentFile;
exports.registerWithNodeRequire = registerWithNodeRequire;
const path_1 = __importDefault(require("path"));
const coverage_instrumentation_plugin_1 = __importDefault(require("./coverage-instrumentation-plugin"));
// Default plugin options
const defaultOptions = {
    // Which files to instrument
    include: [
        /\.tsx?$/, // TypeScript files
        /\.jsx?$/ // JavaScript files
    ],
    // Which files to exclude from instrumentation
    exclude: [
        /node_modules/,
        /\.test\./,
        /\.spec\./,
        /__tests__/,
        /__mocks__/
    ],
    // Coverage tracker module path (to be injected)
    coverageTrackerPath: require.resolve('../trackers/coverage-tracker'),
    // Whether to instrument all files or only React components
    instrumentAllFiles: false,
    // Whether to use source maps for accurate location tracking
    useSourceMaps: true,
    // Whether to add file paths to coverage data 
    addFilePaths: true
};
/**
 * Create a Babel configuration object for the coverage plugin
 */
function createBabelConfig(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    return {
        plugins: [
            [coverage_instrumentation_plugin_1.default, mergedOptions]
        ]
    };
}
/**
 * Create a Webpack configuration for using the coverage plugin
 */
function createWebpackConfig(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    return {
        module: {
            rules: [
                {
                    test: (filePath) => {
                        // Check if file should be included
                        const shouldInclude = mergedOptions.include.some(pattern => pattern instanceof RegExp
                            ? pattern.test(filePath)
                            : filePath.includes(pattern));
                        // Check if file should be excluded
                        const shouldExclude = mergedOptions.exclude.some(pattern => pattern instanceof RegExp
                            ? pattern.test(filePath)
                            : filePath.includes(pattern));
                        return shouldInclude && !shouldExclude;
                    },
                    use: {
                        loader: 'babel-loader',
                        options: {
                            plugins: [
                                [coverage_instrumentation_plugin_1.default, mergedOptions]
                            ]
                        }
                    }
                }
            ]
        },
        // Add coverage tracker as a global variable for instrumented code to use
        plugins: [
            new (require('webpack').DefinePlugin)({
                COVERAGE_TRACKER: 'window.COVERAGE_TRACKER'
            })
        ]
    };
}
/**
 * Create Metro configuration for React Native projects
 */
function createMetroConfig(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    return {
        transformer: {
            babelTransformerPath: require.resolve('./metro-transformer'),
            // Pass plugin options to the transformer
            pluginOptions: mergedOptions
        }
    };
}
/**
 * Create Jest configuration for using the coverage plugin
 */
function createJestConfig(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    return {
        transform: {
            '^.+\\.(js|jsx|ts|tsx)$': [
                'babel-jest',
                {
                    plugins: [
                        [coverage_instrumentation_plugin_1.default, mergedOptions]
                    ]
                }
            ]
        },
        // Auto-inject coverage tracker
        setupFiles: [
            path_1.default.join(__dirname, '../setup/jest-coverage-setup.js')
        ]
    };
}
/**
 * Simple helper to check if a file should be instrumented
 */
function shouldInstrumentFile(filePath, options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    // Check if file should be included
    const shouldInclude = mergedOptions.include.some(pattern => pattern instanceof RegExp
        ? pattern.test(filePath)
        : filePath.includes(pattern));
    // Check if file should be excluded
    const shouldExclude = mergedOptions.exclude.some(pattern => pattern instanceof RegExp
        ? pattern.test(filePath)
        : filePath.includes(pattern));
    return shouldInclude && !shouldExclude;
}
/**
 * Register babel plugin directly with Node.js require hook
 * This allows instrumentation during runtime without compilation
 */
function registerWithNodeRequire(options = {}) {
    const mergedOptions = { ...defaultOptions, ...options };
    // Require @babel/register dynamically
    try {
        const babelRegister = require('@babel/register');
        babelRegister({
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            plugins: [
                [coverage_instrumentation_plugin_1.default, mergedOptions]
            ],
            // Only instrument files matching our patterns
            only: (filePath) => shouldInstrumentFile(filePath, mergedOptions)
        });
        console.log('[Coverage Instrumentation] Registered Babel plugin with Node.js require hook');
    }
    catch (error) {
        console.error('[Coverage Instrumentation] Failed to register with Node.js require hook:', error);
        console.error('Make sure @babel/register is installed.');
    }
}
