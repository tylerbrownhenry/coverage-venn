"use strict";
// Global coverage tracker for our instrumentation
global.COVERAGE_TRACKER = {
    coverageData: {
        branches: {},
        jsxElements: {},
        functions: {}
    },
    trackBranch(component, id, type, outcome) {
        const key = `${component}:${id}:${type}`;
        if (!this.coverageData.branches[key]) {
            this.coverageData.branches[key] = { count: 0, outcomes: {} };
        }
        this.coverageData.branches[key].count++;
        const outcomeKey = outcome.toString();
        if (!this.coverageData.branches[key].outcomes[outcomeKey]) {
            this.coverageData.branches[key].outcomes[outcomeKey] = 0;
        }
        this.coverageData.branches[key].outcomes[outcomeKey]++;
        console.log(`Branch ${id} in ${component} (${type}) took path ${outcome}`);
        return outcome; // Return to not interfere with code logic
    },
    trackJSXRender(component, id, elementType) {
        const key = `${component}:${id}:${elementType}`;
        if (!this.coverageData.jsxElements[key]) {
            this.coverageData.jsxElements[key] = { count: 0 };
        }
        this.coverageData.jsxElements[key].count++;
        console.log(`JSX ${elementType} (${id}) in ${component} rendered`);
        return true; // Return a value to not break the code flow
    },
    trackFunctionStart(component, name, id) {
        const key = `${component}:${name}:${id}`;
        if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = {
                count: 0,
                completed: 0,
                errors: 0
            };
        }
        this.coverageData.functions[key].count++;
        console.log(`Function ${name} (${id}) in ${component} started`);
    },
    trackFunctionEnd(component, name, id) {
        const key = `${component}:${name}:${id}`;
        if (this.coverageData.functions[key]) {
            this.coverageData.functions[key].completed++;
        }
        console.log(`Function ${name} (${id}) in ${component} ended`);
    },
    trackFunctionError(component, name, id) {
        const key = `${component}:${name}:${id}`;
        if (this.coverageData.functions[key]) {
            this.coverageData.functions[key].errors++;
        }
        console.log(`Function ${name} (${id}) in ${component} threw error`);
    },
    getCoverageReport() {
        return this.coverageData;
    }
};
module.exports = global.COVERAGE_TRACKER;
