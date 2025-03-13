"use strict";
// Global coverage tracker
global.COVERAGE_TRACKER = {
    branches: {},
    functions: {},
    jsx: {},
    trackBranch(component, branchId, branchType, path) {
        if (!this.branches[component]) {
            this.branches[component] = {};
        }
        const key = `${branchId}:${branchType}`;
        if (!this.branches[component][key]) {
            this.branches[component][key] = {
                type: branchType,
                paths: { 0: 0, 1: 0 }
            };
        }
        this.branches[component][key].paths[path]++;
        console.log(`Branch ${branchType} in ${component} took path ${path}`);
        return path === 0;
    },
    trackJSXRender(component, jsxId, elementType) {
        if (!this.jsx[component]) {
            this.jsx[component] = {};
        }
        if (!this.jsx[component][jsxId]) {
            this.jsx[component][jsxId] = {
                elementType,
                renders: 0
            };
        }
        this.jsx[component][jsxId].renders++;
        console.log(`JSX element ${elementType} in ${component} rendered`);
    },
    trackFunctionStart(component, functionName, functionId) {
        if (!this.functions[component]) {
            this.functions[component] = {};
        }
        const key = `${functionId}:${functionName}`;
        if (!this.functions[component][key]) {
            this.functions[component][key] = {
                name: functionName,
                calls: 0,
                errors: 0,
                completions: 0
            };
        }
        this.functions[component][key].calls++;
        console.log(`Function ${functionName} in ${component} called`);
    },
    trackFunctionEnd(component, functionName, functionId) {
        const key = `${functionId}:${functionName}`;
        if (this.functions[component] && this.functions[component][key]) {
            this.functions[component][key].completions++;
            console.log(`Function ${functionName} in ${component} completed`);
        }
    },
    trackFunctionError(component, functionName, functionId) {
        const key = `${functionId}:${functionName}`;
        if (this.functions[component] && this.functions[component][key]) {
            this.functions[component][key].errors++;
            console.log(`Function ${functionName} in ${component} had an error`);
        }
    },
    getResults() {
        return {
            branches: this.branches,
            jsx: this.jsx,
            functions: this.functions
        };
    },
    printSummary() {
        let totalBranches = 0;
        let totalJSX = 0;
        let totalFunctions = 0;
        Object.keys(this.branches).forEach(component => {
            totalBranches += Object.keys(this.branches[component]).length;
        });
        Object.keys(this.jsx).forEach(component => {
            totalJSX += Object.keys(this.jsx[component]).length;
        });
        Object.keys(this.functions).forEach(component => {
            totalFunctions += Object.keys(this.functions[component]).length;
        });
        console.log('\n--- Coverage Summary ---');
        console.log(`Branches tracked: ${totalBranches}`);
        console.log(`JSX elements tracked: ${totalJSX}`);
        console.log(`Functions tracked: ${totalFunctions}`);
        console.log('------------------------\n');
    }
};
module.exports = global.COVERAGE_TRACKER;
