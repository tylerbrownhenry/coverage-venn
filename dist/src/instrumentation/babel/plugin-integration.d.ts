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
interface PluginOptions {
    include: RegExp[];
    exclude: RegExp[];
    coverageTrackerPath: string;
    instrumentAllFiles: boolean;
    useSourceMaps: boolean;
    addFilePaths: boolean;
}
/**
 * Create a Babel configuration object for the coverage plugin
 */
export declare function createBabelConfig(options?: Partial<PluginOptions>): any;
/**
 * Create a Webpack configuration for using the coverage plugin
 */
export declare function createWebpackConfig(options?: Partial<PluginOptions>): any;
/**
 * Create Metro configuration for React Native projects
 */
export declare function createMetroConfig(options?: Partial<PluginOptions>): any;
/**
 * Create Jest configuration for using the coverage plugin
 */
export declare function createJestConfig(options?: Partial<PluginOptions>): any;
/**
 * Simple helper to check if a file should be instrumented
 */
export declare function shouldInstrumentFile(filePath: string, options?: Partial<PluginOptions>): boolean;
/**
 * Register babel plugin directly with Node.js require hook
 * This allows instrumentation during runtime without compilation
 */
export declare function registerWithNodeRequire(options?: Partial<PluginOptions>): void;
export {};
