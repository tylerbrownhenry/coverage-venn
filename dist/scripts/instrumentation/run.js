#!/usr/bin/env node
"use strict";
/**
 * Consolidated instrumentation runner script
 *
 * Usage:
 *   node run.js [options] [--type=<type>]
 *
 * Options:
 *   --watch                Run in watch mode
 *   --type=jsx             Run JSX instrumentation
 *   --type=function        Run function instrumentation
 *   --type=switch          Run switch instrumentation
 *   --type=try-catch       Run try-catch instrumentation
 *   --type=typescript      Run TypeScript instrumentation
 *   --type=async           Run async instrumentation
 *   --type=flow            Run flow instrumentation
 *   --type=flow-simple     Run simple flow instrumentation
 *   --type=all             Run all instrumentation tests (default)
 */
const { spawn } = require('child_process');
const path = require('path');
const args = process.argv.slice(2);
const isWatch = args.includes('--watch');
const typeArg = args.find(arg => arg.startsWith('--type='));
const type = typeArg ? typeArg.split('=')[1] : 'all';
// Remove the watch flag from args if present to pass remaining args
const remainingArgs = args.filter(arg => arg !== '--watch' && !arg.startsWith('--type='));
// Map of instrumentation types to their commands
const commands = {
    jsx: {
        cmd: 'ts-node',
        args: ['scripts/instrumentation/jsx/test-jsx.ts', ...remainingArgs]
    },
    function: {
        cmd: 'ts-node',
        args: ['scripts/instrumentation/function/test-function.ts', ...remainingArgs]
    },
    switch: {
        cmd: 'node',
        args: ['scripts/instrumentation/switch/run-switch.js', ...remainingArgs]
    },
    'try-catch': {
        cmd: 'ts-node',
        args: ['scripts/instrumentation/try-catch/test-try-catch.ts', ...remainingArgs]
    },
    typescript: {
        cmd: 'node',
        args: ['scripts/instrumentation/typescript/test-typescript.js', ...remainingArgs]
    },
    async: {
        cmd: 'node',
        args: ['scripts/instrumentation/async/test-async.js', ...remainingArgs]
    },
    flow: {
        cmd: 'node',
        args: ['scripts/instrumentation/flow/test-flow.js', ...remainingArgs]
    },
    'flow-simple': {
        cmd: 'node',
        args: ['scripts/instrumentation/flow/test-flow-simple.js', ...remainingArgs]
    },
    all: {
        cmd: 'node',
        args: ['scripts/instrumentation/run-all-tests.js', ...remainingArgs]
    },
    unit: {
        cmd: 'jest',
        args: ['-c', 'scripts/instrumentation/jest.config.js', ...remainingArgs]
    },
    default: {
        cmd: 'node',
        args: ['scripts/run/run-instrumented-jest.js', ...(isWatch ? ['--watch'] : []), ...remainingArgs]
    }
};
// Get the command config or use default if not found
const commandConfig = commands[type] || commands.default;
console.log(`Running instrumentation type: ${type}`);
console.log(`Command: ${commandConfig.cmd} ${commandConfig.args.join(' ')}`);
// Execute the command
const child = spawn(commandConfig.cmd, commandConfig.args, {
    stdio: 'inherit',
    shell: true
});
child.on('close', code => {
    process.exit(code);
});
