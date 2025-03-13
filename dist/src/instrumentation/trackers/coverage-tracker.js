"use strict";
/**
 * Coverage Tracker
 *
 * Collects and manages coverage data from Babel-instrumented code.
 * This module is injected into the runtime and collects data about:
 * - Branch execution (conditional statements, ternary operations)
 * - Function execution
 * - JSX rendering
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Coverage Tracker class
 */
class CoverageTracker {
    /**
     * Initialize the tracker
     */
    constructor() {
        this.data = {
            components: {}
        };
        this.active = false;
        this.sourceMapInfo = {};
        // Reset data structure
        this.reset();
    }
    /**
     * Reset all coverage data
     */
    reset() {
        this.data = {
            components: {}
        };
        this.active = false;
    }
    /**
     * Check if tracking is active
     */
    get isActive() {
        return this.active;
    }
    /**
     * Start collecting coverage for a test
     */
    start(testName) {
        this.reset();
        this.data.startTime = Date.now();
        this.data.testName = testName;
        this.active = true;
        console.log(`[CoverageTracker] Started tracking coverage for "${testName}"`);
    }
    /**
     * Stop collecting coverage and return the data
     */
    stop() {
        if (!this.active) {
            console.warn('[CoverageTracker] stop() called but tracker was not active');
            return this.data;
        }
        this.data.endTime = Date.now();
        this.active = false;
        console.log(`[CoverageTracker] Stopped tracking coverage for "${this.data.testName}"`);
        console.log(`[CoverageTracker] Collected data for ${Object.keys(this.data.components).length} components`);
        return this.data;
    }
    /**
     * Track branch execution (if statements, ternary operators)
     */
    trackBranch(componentName, branchId, branchType, outcome) {
        if (!this.active)
            return;
        // Ensure component exists in data
        if (!this.data.components[componentName]) {
            this.data.components[componentName] = {
                name: componentName,
                branches: {},
                functions: {},
                jsx: {}
            };
        }
        // Ensure branch exists
        if (!this.data.components[componentName].branches[branchId]) {
            this.data.components[componentName].branches[branchId] = {
                id: branchId,
                type: branchType,
                hits: 0,
                trueCount: 0,
                falseCount: 0
            };
        }
        // Update branch statistics
        const branch = this.data.components[componentName].branches[branchId];
        branch.hits++;
        branch.lastExecuted = Date.now();
        // Track which path was taken (0 = true branch, 1 = false branch)
        if (outcome === 0) {
            branch.trueCount++;
        }
        else {
            branch.falseCount++;
        }
    }
    /**
     * Track function start
     */
    trackFunctionStart(componentName, functionName, functionId) {
        if (!this.active)
            return;
        // Ensure component exists in data
        if (!this.data.components[componentName]) {
            this.data.components[componentName] = {
                name: componentName,
                branches: {},
                functions: {},
                jsx: {}
            };
        }
        // Ensure function exists
        if (!this.data.components[componentName].functions[functionId]) {
            this.data.components[componentName].functions[functionId] = {
                id: functionId,
                name: functionName,
                hits: 0,
                executionTime: 0,
                errorCount: 0
            };
        }
        // Update function statistics
        const func = this.data.components[componentName].functions[functionId];
        func.hits++;
        func.lastExecuted = Date.now();
        // Store start time in function object
        func._startTime = Date.now();
    }
    /**
     * Track function end
     */
    trackFunctionEnd(componentName, functionName, functionId) {
        if (!this.active)
            return;
        // Ensure component and function exist
        if (!this.data.components[componentName]?.functions[functionId]) {
            console.warn(`[CoverageTracker] trackFunctionEnd called for unknown function: ${componentName}.${functionName}(${functionId})`);
            return;
        }
        // Update function execution time
        const func = this.data.components[componentName].functions[functionId];
        const endTime = Date.now();
        if (func._startTime) {
            func.executionTime += (endTime - func._startTime);
            delete func._startTime; // Clean up temporary property
        }
    }
    /**
     * Track function errors
     */
    trackFunctionError(componentName, functionName, functionId) {
        if (!this.active)
            return;
        // Ensure component and function exist
        if (!this.data.components[componentName]?.functions[functionId]) {
            console.warn(`[CoverageTracker] trackFunctionError called for unknown function: ${componentName}.${functionName}(${functionId})`);
            return;
        }
        // Update function error count
        const func = this.data.components[componentName].functions[functionId];
        func.errorCount++;
        // Clean up temporary property
        delete func._startTime;
    }
    /**
     * Track JSX element rendering
     */
    trackJSXRender(componentName, jsxId, elementType) {
        if (!this.active)
            return;
        // Ensure component exists in data
        if (!this.data.components[componentName]) {
            this.data.components[componentName] = {
                name: componentName,
                branches: {},
                functions: {},
                jsx: {}
            };
        }
        // Ensure JSX element exists
        if (!this.data.components[componentName].jsx[jsxId]) {
            this.data.components[componentName].jsx[jsxId] = {
                id: jsxId,
                elementType,
                hits: 0
            };
        }
        // Update JSX statistics
        const jsx = this.data.components[componentName].jsx[jsxId];
        jsx.hits++;
        jsx.lastRendered = Date.now();
    }
    /**
     * Track component prop usage
     */
    trackPropUsage(componentName, propName) {
        if (!this.active)
            return;
        // Ensure component exists in data
        if (!this.data.components[componentName]) {
            this.data.components[componentName] = {
                name: componentName,
                branches: {},
                functions: {},
                jsx: {},
                props: {}
            };
        }
        // Ensure props object exists
        if (!this.data.components[componentName].props) {
            this.data.components[componentName].props = {};
        }
        // Update prop usage count
        const props = this.data.components[componentName].props;
        props[propName] = (props[propName] || 0) + 1;
    }
    /**
     * Set source map information for more accurate location reporting
     */
    setSourceMapInfo(filePath, sourceMap) {
        this.sourceMapInfo[filePath] = sourceMap;
    }
    /**
     * Get all collected coverage data
     */
    getData() {
        return this.data;
    }
    /**
     * Convert coverage data to Istanbul format for integration with existing tools
     */
    toIstanbulFormat() {
        const istanbulCoverage = {};
        // Convert our format to Istanbul format
        Object.entries(this.data.components).forEach(([componentName, component]) => {
            // Skip if no file path (we need this for Istanbul)
            if (!component.filePath)
                return;
            // Create Istanbul coverage entry for this file
            const filePath = component.filePath;
            if (!istanbulCoverage[filePath]) {
                istanbulCoverage[filePath] = {
                    path: filePath,
                    statementMap: {},
                    fnMap: {},
                    branchMap: {},
                    s: {},
                    f: {},
                    b: {}
                };
            }
            // Add function coverage
            Object.entries(component.functions).forEach(([funcId, func]) => {
                const id = `${componentName}_${funcId}`;
                istanbulCoverage[filePath].fnMap[id] = {
                    name: func.name,
                    decl: {
                        start: { line: func.location?.line || 0, column: func.location?.column || 0 },
                        end: { line: func.location?.line || 0, column: (func.location?.column || 0) + 1 }
                    },
                    loc: {
                        start: { line: func.location?.line || 0, column: func.location?.column || 0 },
                        end: { line: func.location?.line || 0, column: (func.location?.column || 0) + 1 }
                    }
                };
                istanbulCoverage[filePath].f[id] = func.hits;
            });
            // Add branch coverage
            Object.entries(component.branches).forEach(([branchId, branch]) => {
                const id = `${componentName}_${branchId}`;
                istanbulCoverage[filePath].branchMap[id] = {
                    type: branch.type,
                    loc: {
                        start: { line: branch.location?.line || 0, column: branch.location?.column || 0 },
                        end: { line: branch.location?.line || 0, column: (branch.location?.column || 0) + 1 }
                    },
                    locations: [
                        { start: { line: branch.location?.line || 0, column: branch.location?.column || 0 },
                            end: { line: branch.location?.line || 0, column: (branch.location?.column || 0) + 1 } },
                        { start: { line: branch.location?.line || 0, column: branch.location?.column || 0 },
                            end: { line: branch.location?.line || 0, column: (branch.location?.column || 0) + 1 } }
                    ]
                };
                istanbulCoverage[filePath].b[id] = [branch.trueCount, branch.falseCount];
            });
            // Add statement coverage (from JSX renders for now)
            Object.entries(component.jsx).forEach(([jsxId, jsx]) => {
                const id = `${componentName}_jsx_${jsxId}`;
                istanbulCoverage[filePath].statementMap[id] = {
                    start: { line: jsx.location?.line || 0, column: jsx.location?.column || 0 },
                    end: { line: jsx.location?.line || 0, column: (jsx.location?.column || 0) + 1 }
                };
                istanbulCoverage[filePath].s[id] = jsx.hits;
            });
        });
        return istanbulCoverage;
    }
}
// Create singleton instance
const coverageTracker = new CoverageTracker();
// Export instance
exports.default = coverageTracker;
