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

import path from 'path';
import coverageInstrumentationPlugin from './coverage-instrumentation-plugin';

// Default plugin options
interface PluginOptions {
  // Which files to instrument
  include: RegExp[];
  // Which files to exclude from instrumentation
  exclude: RegExp[];
  // Coverage tracker module path (to be injected)
  coverageTrackerPath: string;
  // Whether to instrument all files or only React components
  instrumentAllFiles: boolean;
  // Whether to use source maps for accurate location tracking
  useSourceMaps: boolean;
  // Whether to add file paths to coverage data 
  addFilePaths: boolean;
}

// Default plugin options
const defaultOptions: PluginOptions = {
  // Which files to instrument
  include: [
    /\.tsx?$/,  // TypeScript files
    /\.jsx?$/   // JavaScript files
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
export function createBabelConfig(options: Partial<PluginOptions> = {}): any {
  const mergedOptions = { ...defaultOptions, ...options };
  
  return {
    plugins: [
      [coverageInstrumentationPlugin, mergedOptions]
    ]
  };
}

/**
 * Create a Webpack configuration for using the coverage plugin
 */
export function createWebpackConfig(options: Partial<PluginOptions> = {}): any {
  const mergedOptions = { ...defaultOptions, ...options };
  
  return {
    module: {
      rules: [
        {
          test: (filePath: string) => {
            // Check if file should be included
            const shouldInclude = mergedOptions.include.some(pattern => 
              pattern instanceof RegExp 
                ? pattern.test(filePath) 
                : filePath.includes(pattern)
            );
            
            // Check if file should be excluded
            const shouldExclude = mergedOptions.exclude.some(pattern => 
              pattern instanceof RegExp 
                ? pattern.test(filePath) 
                : filePath.includes(pattern)
            );
            
            return shouldInclude && !shouldExclude;
          },
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                [coverageInstrumentationPlugin, mergedOptions]
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
export function createMetroConfig(options: Partial<PluginOptions> = {}): any {
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
export function createJestConfig(options: Partial<PluginOptions> = {}): any {
  const mergedOptions = { ...defaultOptions, ...options };
  
  return {
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': [
        'babel-jest', 
        { 
          plugins: [
            [coverageInstrumentationPlugin, mergedOptions]
          ]
        }
      ]
    },
    // Auto-inject coverage tracker
    setupFiles: [
      path.join(__dirname, '../setup/jest-coverage-setup.js')
    ]
  };
}

/**
 * Simple helper to check if a file should be instrumented
 */
export function shouldInstrumentFile(filePath: string, options: Partial<PluginOptions> = {}): boolean {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Check if file should be included
  const shouldInclude = mergedOptions.include.some(pattern => 
    pattern instanceof RegExp 
      ? pattern.test(filePath) 
      : filePath.includes(pattern)
  );
  
  // Check if file should be excluded
  const shouldExclude = mergedOptions.exclude.some(pattern => 
    pattern instanceof RegExp 
      ? pattern.test(filePath) 
      : filePath.includes(pattern)
  );
  
  return shouldInclude && !shouldExclude;
}

/**
 * Register babel plugin directly with Node.js require hook
 * This allows instrumentation during runtime without compilation
 */
export function registerWithNodeRequire(options: Partial<PluginOptions> = {}): void {
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Require @babel/register dynamically
  try {
    const babelRegister = require('@babel/register');
    
    babelRegister({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      plugins: [
        [coverageInstrumentationPlugin, mergedOptions]
      ],
      // Only instrument files matching our patterns
      only: (filePath: string) => shouldInstrumentFile(filePath, mergedOptions)
    });
    
    console.log('[Coverage Instrumentation] Registered Babel plugin with Node.js require hook');
  } catch (error) {
    console.error('[Coverage Instrumentation] Failed to register with Node.js require hook:', error);
    console.error('Make sure @babel/register is installed.');
  }
} 