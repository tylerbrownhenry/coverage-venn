"use strict";
// Simple coverage tracker with memory optimizations
let coverageData = {
    branches: {},
    jsxRenders: {},
    functionCalls: {},
    errors: {}
};
let _flowCoverage = {};
global.COVERAGE_TRACKER = {
    // Track branch coverage
    trackBranch(component, id, type, result) {
        if (!coverageData.branches[component]) {
            coverageData.branches[component] = {};
        }
        const key = `${id}:${type}`;
        if (!coverageData.branches[component][key]) {
            coverageData.branches[component][key] = {
                count: 0,
                trueCount: 0,
                falseCount: 0
            };
        }
        coverageData.branches[component][key].count++;
        if (result) {
            coverageData.branches[component][key].trueCount++;
        }
        else {
            coverageData.branches[component][key].falseCount++;
        }
        console.log(`[${component}] Branch ${type} (id: ${id}) evaluated to ${result}`);
        return result;
    },
    // Track JSX renders
    trackJSXRender(component, id, type) {
        if (!coverageData.jsxRenders[component]) {
            coverageData.jsxRenders[component] = {};
        }
        const key = `${id}:${type}`;
        if (!coverageData.jsxRenders[component][key]) {
            coverageData.jsxRenders[component][key] = {
                count: 0
            };
        }
        coverageData.jsxRenders[component][key].count++;
        console.log(`[${component}] JSX element ${type} (id: ${id}) rendered`);
        return true;
    },
    // Track function calls
    trackFunction(component, id, name, args) {
        if (!coverageData.functionCalls[component]) {
            coverageData.functionCalls[component] = {};
        }
        const key = `${id}:${name}`;
        if (!coverageData.functionCalls[component][key]) {
            coverageData.functionCalls[component][key] = {
                count: 0,
                args: []
            };
        }
        const data = coverageData.functionCalls[component][key];
        data.count++;
        // Only store up to 10 argument samples to prevent memory issues
        if (data.args.length < 10) {
            data.args.push(args || []);
        }
        console.log(`[${component}] Function ${name} (id: ${id}) called`);
        return true;
    },
    // Track errors
    trackError(component, id, type, error) {
        if (!coverageData.errors[component]) {
            coverageData.errors[component] = {};
        }
        const key = `${id}:${type}`;
        if (!coverageData.errors[component][key]) {
            coverageData.errors[component][key] = {
                count: 0,
                errors: []
            };
        }
        const data = coverageData.errors[component][key];
        data.count++;
        // Only store up to 5 error samples to prevent memory issues
        if (data.errors.length < 5) {
            data.errors.push(error ? error.toString() : 'Unknown error');
        }
        console.log(`[${component}] Error in ${type} (id: ${id}): ${error}`);
        return true;
    },
    // Get coverage report
    getCoverageReport() {
        return coverageData;
    }
};
module.exports = global.COVERAGE_TRACKER;
