"use strict";
const COVERAGE_TRACKER = {
    branches: {},
    switches: {},
    cases: {},
    functions: {},
    jsx: {},
    // Branch tracking
    trackBranch(component, branchId, type, condition) {
        if (!this.branches[component]) {
            this.branches[component] = {};
        }
        if (!this.branches[component][branchId]) {
            this.branches[component][branchId] = {
                type,
                hits: 0,
                conditions: []
            };
        }
        this.branches[component][branchId].hits++;
        this.branches[component][branchId].conditions.push(condition);
        return condition;
    },
    // Switch statement tracking
    trackSwitch(component, switchId, value) {
        if (!this.switches[component]) {
            this.switches[component] = {};
        }
        if (!this.switches[component][switchId]) {
            this.switches[component][switchId] = {
                hits: 0,
                values: []
            };
        }
        this.switches[component][switchId].hits++;
        this.switches[component][switchId].values.push(value);
        return value;
    },
    // Case tracking
    trackCase(component, switchId, caseId, isMatch) {
        if (!this.cases[component]) {
            this.cases[component] = {};
        }
        if (!this.cases[component][caseId]) {
            this.cases[component][caseId] = {
                switchId,
                hits: 0,
                matches: 0
            };
        }
        this.cases[component][caseId].hits++;
        if (isMatch) {
            this.cases[component][caseId].matches++;
        }
        return isMatch;
    },
    // Function tracking
    trackFunctionStart(component, functionId, name) {
        if (!this.functions[component]) {
            this.functions[component] = {};
        }
        if (!this.functions[component][functionId]) {
            this.functions[component][functionId] = {
                name,
                calls: 0,
                errors: 0
            };
        }
        this.functions[component][functionId].calls++;
        return functionId;
    },
    trackFunctionEnd(component, functionId) {
        // Just for tracking successful completion
        return functionId;
    },
    trackFunctionError(component, functionId, error) {
        if (this.functions[component] && this.functions[component][functionId]) {
            this.functions[component][functionId].errors++;
        }
        throw error; // Re-throw to preserve original behavior
    },
    // JSX tracking
    trackJSX(component, jsxId, elementType) {
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
    },
    getSummary() {
        const branchCount = Object.values(this.branches)
            .reduce((count, branches) => count + Object.keys(branches).length, 0);
        const switchCount = Object.values(this.switches)
            .reduce((count, switches) => count + Object.keys(switches).length, 0);
        const caseCount = Object.values(this.cases)
            .reduce((count, cases) => count + Object.keys(cases).length, 0);
        const functionCount = Object.values(this.functions)
            .reduce((count, funcs) => count + Object.keys(funcs).length, 0);
        const jsxCount = Object.values(this.jsx)
            .reduce((count, elements) => count + Object.keys(elements).length, 0);
        return {
            branches: branchCount,
            switches: switchCount,
            cases: caseCount,
            functions: functionCount,
            jsx: jsxCount
        };
    },
    getResults() {
        return {
            branches: this.branches,
            switches: this.switches,
            cases: this.cases,
            functions: this.functions,
            jsx: this.jsx
        };
    }
};
// Make it global for testing
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
