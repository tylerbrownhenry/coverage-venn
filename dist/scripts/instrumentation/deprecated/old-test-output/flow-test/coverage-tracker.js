"use strict";
// Simple coverage tracker with memory optimizations
let coverageData = {
    branches: {},
    jsxRenders: {},
    functionCalls: {},
    errors: {}
};
// Memory optimization - enable object pooling
const NODE_POOL_SIZE = 1000;
const nodePool = [];
function resetPool() {
    nodePool.length = 0;
}
function getFromPool() {
    if (nodePool.length > 0) {
        return nodePool.pop();
    }
    return {};
}
function returnToPool(obj) {
    if (nodePool.length < NODE_POOL_SIZE) {
        Object.keys(obj).forEach(key => {
            delete obj[key];
        });
        nodePool.push(obj);
    }
}
// Circuit breaker - prevent infinite tracking
const MAX_NODES_PER_TYPE = 2000;
const trackedNodes = new Set();
function shouldTrack(id, type) {
    const key = `${type}:${id}`;
    if (trackedNodes.has(key)) {
        return false;
    }
    // Count nodes by type
    let countByType = 0;
    for (const existingKey of trackedNodes) {
        if (existingKey.startsWith(type)) {
            countByType++;
            if (countByType >= MAX_NODES_PER_TYPE) {
                console.log(`Circuit breaker: maximum ${type} nodes (${MAX_NODES_PER_TYPE}) reached`);
                return false;
            }
        }
    }
    trackedNodes.add(key);
    return true;
}
// Export the COVERAGE_TRACKER global
global.COVERAGE_TRACKER = {
    // Track branches (if/else, ternary, logical expressions)
    trackBranch: function (id, componentName, branchType, condition, location) {
        if (!shouldTrack(id, 'branch'))
            return condition;
        const key = `${componentName}-${branchType}-${location}`;
        if (!coverageData.branches[key]) {
            coverageData.branches[key] = { count: 0, paths: {} };
        }
        coverageData.branches[key].count++;
        const pathKey = String(condition);
        if (!coverageData.branches[key].paths[pathKey]) {
            coverageData.branches[key].paths[pathKey] = 0;
        }
        coverageData.branches[key].paths[pathKey]++;
        if (branchType === 'if' || branchType === 'ternary') {
            console.log(`Branch ${branchType} in ${componentName} took path ${condition}`);
        }
        else if (branchType.startsWith('logical')) {
            console.log(`Branch ${branchType} in ${componentName} took path ${condition}`);
        }
        return condition;
    },
    // Track JSX renders
    trackJsxRender: function (id, componentName, elementType, props) {
        if (!shouldTrack(id, 'jsx'))
            return;
        const key = `${componentName}-${elementType}`;
        if (!coverageData.jsxRenders[key]) {
            coverageData.jsxRenders[key] = 0;
        }
        coverageData.jsxRenders[key]++;
        console.log(`JSX Render: ${elementType} in ${componentName}`);
    },
    // Track function calls
    trackFunctionCall: function (id, functionName, arguments) {
        if (!shouldTrack(id, 'function'))
            return;
        const key = functionName;
        if (!coverageData.functionCalls[key]) {
            coverageData.functionCalls[key] = 0;
        }
        coverageData.functionCalls[key]++;
        console.log(`Function Call: ${functionName}`);
    },
    // Track errors
    trackError: function (id, componentName, errorMessage) {
        if (!shouldTrack(id, 'error'))
            return;
        const key = `${componentName}-${errorMessage}`;
        if (!coverageData.errors[key]) {
            coverageData.errors[key] = 0;
        }
        coverageData.errors[key]++;
        console.error(`Error in ${componentName}: ${errorMessage}`);
    },
    // Get coverage data
    getCoverageData: function () {
        return coverageData;
    },
    // Print summary of coverage data
    printSummary: function () {
        console.log('\nCoverage Summary:');
        console.log('----------------');
        console.log(`Branches covered: ${Object.keys(coverageData.branches).length}`);
        console.log(`JSX elements covered: ${Object.keys(coverageData.jsxRenders).length}`);
        console.log(`Functions covered: ${Object.keys(coverageData.functionCalls).length}`);
        console.log(`Errors tracked: ${Object.keys(coverageData.errors).length}`);
        console.log('----------------\n');
    },
    // Reset coverage data (for memory optimization)
    reset: function () {
        coverageData = {
            branches: {},
            jsxRenders: {},
            functionCalls: {},
            errors: {}
        };
        trackedNodes.clear();
        resetPool();
        // Force garbage collection if available
        if (global.gc) {
            try {
                global.gc();
                console.log("Garbage collection executed");
            }
            catch (e) {
                // GC not available, ignore
            }
        }
        console.log("Coverage data reset");
    }
};
module.exports = global.COVERAGE_TRACKER;
