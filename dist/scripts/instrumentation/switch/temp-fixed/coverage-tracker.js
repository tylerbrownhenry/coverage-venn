"use strict";
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
    functions: {},
    branches: {},
    switches: {},
    trackFunctionStart(functionName, component, id) {
        const key = `${component}:${id}:${functionName}`;
        if (!this.functions[key]) {
            this.functions[key] = { calls: 0 };
        }
        this.functions[key].calls++;
        console.log(`Function ${functionName} (id: ${id}) in ${component} started`);
        return true;
    },
    trackBranch(component, branchId, branchType, condition) {
        const key = `${component}:${branchId}:${branchType}`;
        if (!this.branches[key]) {
            this.branches[key] = {
                evaluations: 0,
                truthy: 0,
                falsy: 0
            };
        }
        this.branches[key].evaluations++;
        if (condition) {
            this.branches[key].truthy++;
            console.log(`Branch ${branchType} (id: ${branchId}) in ${component} evaluated to true`);
        }
        else {
            this.branches[key].falsy++;
            console.log(`Branch ${branchType} (id: ${branchId}) in ${component} evaluated to false`);
        }
        return condition;
    },
    trackSwitch(component, switchId, discriminant, caseIndex) {
        const key = `${component}:${switchId}`;
        if (!this.switches[key]) {
            this.switches[key] = {
                evaluations: 0,
                cases: {}
            };
        }
        this.switches[key].evaluations++;
        if (caseIndex !== undefined) {
            if (!this.switches[key].cases[caseIndex]) {
                this.switches[key].cases[caseIndex] = 0;
            }
            this.switches[key].cases[caseIndex]++;
            console.log(`Switch (id: ${switchId}) in ${component} executed case: ${caseIndex}`);
        }
        return discriminant;
    },
    printReport() {
        console.log('\nCoverage Report:');
        console.log('-----------------');
        console.log('\nFunctions:');
        for (const key in this.functions) {
            const [component, id, name] = key.split(':');
            console.log(`  ${name} in ${component}: ${this.functions[key].calls} calls`);
        }
        console.log('\nBranches:');
        for (const key in this.branches) {
            const [component, id, type] = key.split(':');
            const branch = this.branches[key];
            console.log(`  ${type} ${id} in ${component}: ${branch.evaluations} evaluations (true: ${branch.truthy}, false: ${branch.falsy})`);
        }
        console.log('\nSwitches:');
        for (const key in this.switches) {
            const [component, id] = key.split(':');
            const switchData = this.switches[key];
            console.log(`  Switch ${id} in ${component}: ${switchData.evaluations} evaluations`);
            for (const caseIndex in switchData.cases) {
                console.log(`    Case ${caseIndex}: ${switchData.cases[caseIndex]} executions`);
            }
        }
    }
};
module.exports = COVERAGE_TRACKER;
