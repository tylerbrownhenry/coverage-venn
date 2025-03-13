"use strict";
// Coverage tracker for fixed plugin
const COVERAGE_TRACKER = {
    functions: {},
    branches: {},
    loops: {},
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
    trackLoop(component, loopId, ...args) {
        const key = `${component}:${loopId}`;
        if (!this.loops[key]) {
            this.loops[key] = {
                executions: 0
            };
        }
        this.loops[key].executions++;
        console.log(`Loop (id: ${loopId}) in ${component} executed`);
        return args[0]; // Return first argument for chaining
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
        console.log('\nLoops:');
        for (const key in this.loops) {
            const [component, id] = key.split(':');
            console.log(`  Loop ${id} in ${component}: ${this.loops[key].executions} executions`);
        }
    }
};
// This makes the COVERAGE_TRACKER global to avoid reference issues
global.COVERAGE_TRACKER = COVERAGE_TRACKER;
module.exports = COVERAGE_TRACKER;
