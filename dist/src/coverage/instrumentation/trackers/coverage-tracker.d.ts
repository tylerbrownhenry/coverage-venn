/**
 * Coverage Tracker
 *
 * Collects and manages coverage data from Babel-instrumented code.
 * This module is injected into the runtime and collects data about:
 * - Branch execution (conditional statements, ternary operations)
 * - Function execution
 * - JSX rendering
 */
interface BranchCoverage {
    id: number;
    type: string;
    location?: {
        line: number;
        column: number;
    };
    hits: number;
    lastExecuted?: number;
    trueCount: number;
    falseCount: number;
}
interface FunctionCoverage {
    id: number;
    name: string;
    location?: {
        line: number;
        column: number;
    };
    hits: number;
    lastExecuted?: number;
    executionTime: number;
    errorCount: number;
    _startTime?: number;
}
interface JSXCoverage {
    id: number;
    elementType: string;
    location?: {
        line: number;
        column: number;
    };
    hits: number;
    lastRendered?: number;
}
interface ComponentCoverage {
    name: string;
    filePath?: string;
    branches: Record<number, BranchCoverage>;
    functions: Record<number, FunctionCoverage>;
    jsx: Record<number, JSXCoverage>;
    props?: Record<string, number>;
}
interface CoverageData {
    components: Record<string, ComponentCoverage>;
    startTime?: number;
    endTime?: number;
    testName?: string;
}
/**
 * Coverage Tracker class
 */
declare class CoverageTracker {
    private data;
    private active;
    private sourceMapInfo;
    /**
     * Initialize the tracker
     */
    constructor();
    /**
     * Reset all coverage data
     */
    reset(): void;
    /**
     * Check if tracking is active
     */
    get isActive(): boolean;
    /**
     * Start collecting coverage for a test
     */
    start(testName: string): void;
    /**
     * Stop collecting coverage and return the data
     */
    stop(): CoverageData;
    /**
     * Track branch execution (if statements, ternary operators)
     */
    trackBranch(componentName: string, branchId: number, branchType: string, outcome: number): void;
    /**
     * Track function start
     */
    trackFunctionStart(componentName: string, functionName: string, functionId: number): void;
    /**
     * Track function end
     */
    trackFunctionEnd(componentName: string, functionName: string, functionId: number): void;
    /**
     * Track function errors
     */
    trackFunctionError(componentName: string, functionName: string, functionId: number): void;
    /**
     * Track JSX element rendering
     */
    trackJSXRender(componentName: string, jsxId: number, elementType: string): void;
    /**
     * Track component prop usage
     */
    trackPropUsage(componentName: string, propName: string): void;
    /**
     * Set source map information for more accurate location reporting
     */
    setSourceMapInfo(filePath: string, sourceMap: any): void;
    /**
     * Get all collected coverage data
     */
    getData(): CoverageData;
    /**
     * Convert coverage data to Istanbul format for integration with existing tools
     */
    toIstanbulFormat(): Record<string, any>;
}
declare const coverageTracker: CoverageTracker;
export default coverageTracker;
