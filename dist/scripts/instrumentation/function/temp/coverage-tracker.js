"use strict";
// Global coverage tracker for our instrumentation
global.COVERAGE_TRACKER = {
    coverageData: {
        branches: {},
        jsxElements: {},
        functions: {},
        tryCatch: {}
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
    trackFunctionStart(funcName, component, id) {
        const key = `${component}:${id}:${funcName}`;
        if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = {
                count: 0,
                calls: []
            };
        }
        this.coverageData.functions[key].count++;
        console.log(`Function ${funcName} (id: ${id}) in ${component} started`);
        return true;
    },
    trackFunctionEnd(funcName, component, id) {
        console.log(`Function ${funcName} (id: ${id}) in ${component} completed`);
        return true;
    },
    trackFunctionError(funcName, component, id) {
        console.log(`Function ${funcName} (id: ${id}) in ${component} encountered an error`);
        return true;
    },
    trackFunction(component, id, functionName, params) {
        const key = `${component}:${id}:${functionName}`;
        if (!this.coverageData.functions[key]) {
            this.coverageData.functions[key] = {
                count: 0,
                calls: []
            };
        }
        this.coverageData.functions[key].count++;
        this.coverageData.functions[key].calls.push({
            timestamp: Date.now(),
            params: params || []
        });
        console.log(`Function ${functionName} (${id}) in ${component} called`);
        return true;
    },
    trackTryCatch(component, id, blockType, status) {
        const key = `${component}:${id}:${blockType}`;
        if (!this.coverageData.tryCatch[key]) {
            this.coverageData.tryCatch[key] = {
                count: 0,
                try: 0,
                catch: 0,
                finally: 0
            };
        }
        this.coverageData.tryCatch[key].count++;
        this.coverageData.tryCatch[key][status]++;
        console.log(`Try/Catch block ${id} in ${component} entered ${status} section`);
        return true;
    },
    getReport() {
        return this.coverageData;
    }
};
module.exports = global.COVERAGE_TRACKER;
