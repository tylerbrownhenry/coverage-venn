"use strict";
/**
 * Metro Transformer with Coverage Instrumentation
 *
 * This transformer extends Metro's default transformer to include
 * our coverage instrumentation Babel plugin.
 */
const { transform } = require('metro-react-native-babel-transformer');
const coverageInstrumentationPlugin = require('./coverage-instrumentation-plugin').default;
// Default plugin options
const defaultOptions = {
    include: [
        /\.tsx?$/, // TypeScript files
        /\.jsx?$/ // JavaScript files
    ],
    exclude: [
        /node_modules/,
        /\.test\./,
        /\.spec\./,
        /__tests__/,
        /__mocks__/
    ],
    coverageTrackerPath: require.resolve('../trackers/coverage-tracker'),
    instrumentAllFiles: false,
    useSourceMaps: true,
    addFilePaths: true
};
/**
 * Main metro transformer function
 */
function babelTransformerWithCoverage(sourceBuffer, filename, options) {
    // Get plugin options from Metro config or use defaults
    const pluginOptions = options.config?.transformer?.pluginOptions || {};
    const mergedOptions = { ...defaultOptions, ...pluginOptions };
    // Determine if we should instrument this file
    const shouldInstrument = shouldInstrumentFile(filename, mergedOptions);
    if (!shouldInstrument) {
        // Skip instrumentation for excluded files
        return transform(sourceBuffer, filename, options);
    }
    // Add our plugin to the Babel config
    if (!options.plugins) {
        options.plugins = [];
    }
    // Add coverage plugin to beginning of plugins list
    options.plugins.unshift([coverageInstrumentationPlugin, {
            ...mergedOptions,
            filename
        }]);
    // Run the standard transform with our modified options
    return transform(sourceBuffer, filename, options);
}
/**
 * Helper to check if a file should be instrumented
 */
function shouldInstrumentFile(filePath, options) {
    // Check if file should be included
    const shouldInclude = options.include.some(pattern => pattern instanceof RegExp
        ? pattern.test(filePath)
        : filePath.includes(pattern));
    // Check if file should be excluded
    const shouldExclude = options.exclude.some(pattern => pattern instanceof RegExp
        ? pattern.test(filePath)
        : filePath.includes(pattern));
    return shouldInclude && !shouldExclude;
}
// Export the transformer
module.exports = {
    transform: babelTransformerWithCoverage
};
