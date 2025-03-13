"use strict";
const COVERAGE_TRACKER = {
    branches: {},
    switches: {},
    cases: {},
    functions: {},
    // Function tracking
    trackFunctionStart(funcName, component, id) {
        const key = `${component}:${id}:${funcName}`;
        if (!this.functions[key]) {
            this.functions[key] = {
                name: funcName,
                calls: 0
            };
        }
        this.functions[key].calls++;
        console.log(`Function ${funcName} in ${component} (id: ${id}) called`);
        return true;
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
        console.log(`Switch ${switchId} in ${component} evaluated with value: ${value}`);
        return value;
    },
    // Case tracking
    trackCase(component, switchId, caseId, matches) {
        const key = `${component}:${switchId}:${caseId}`;
        if (!this.cases[key]) {
            this.cases[key] = {
                hits: 0,
                matches: 0
            };
        }
        this.cases[key].hits++;
        if (matches) {
            this.cases[key].matches++;
        }
        console.log(`Case ${caseId} for switch ${switchId} in ${component} evaluated: ${matches ? 'matched' : 'not matched'}`);
        return matches;
    },
    // Get coverage report
    getReport() {
        return {
            switches: this.switches,
            cases: this.cases
        };
    },
    // Print coverage report
    printReport() {
        console.log('\nCoverage Report:');
        console.log('----------------');
        // Report switches
        console.log('\nSwitch Statements:');
        for (const component in this.switches) {
            console.log(`  Component: ${component}`);
            for (const switchId in this.switches[component]) {
                const sw = this.switches[component][switchId];
                console.log(`    Switch ${switchId}: ${sw.hits} hits with values ${JSON.stringify(sw.values)}`);
            }
        }
        // Report cases
        console.log('\nCase Statements:');
        for (const key in this.cases) {
            const [component, switchId, caseId] = key.split(':');
            const c = this.cases[key];
            console.log(`  ${component} - Switch ${switchId} - Case ${caseId}: ${c.hits} evaluations, ${c.matches} matches`);
        }
    }
};
module.exports = COVERAGE_TRACKER;
