"use strict";
/**
 * Fixed Coverage Instrumentation Plugin for Babel
 *
 * This plugin adds instrumentation to JavaScript code for code coverage tracking.
 * It includes special protections against infinite recursion and stack overflow errors
 * when instrumenting complex code.
 */
const { declare } = require('@babel/helper-plugin-utils');
const { types: t } = require('@babel/core');
const path = require('path');
// Counter for unique branch IDs
let branchIDCounter = 0;
// Counter for unique function IDs
let functionIDCounter = 0;
// Counter for unique try-catch IDs
let tryCatchIDCounter = 0;
// Counter for unique switch IDs
let switchIDCounter = 0;
module.exports = declare((api) => {
    api.assertVersion(7);
    // Use WeakSet to track visited nodes and prevent infinite recursion
    const visitedNodes = new WeakSet();
    // Track recursion depth
    let recursionDepth = 0;
    const MAX_RECURSION_DEPTH = 50; // Limit recursion depth to prevent stack overflow
    // Template for tracking branch execution
    const createBranchTrackingCall = (component, branchId, branchType, condition) => {
        return t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackBranch')), [
            t.stringLiteral(component),
            t.numericLiteral(branchId),
            t.stringLiteral(branchType),
            condition
        ]);
    };
    // Template for tracking function execution
    const createFunctionTrackingCall = (functionName, component, functionId, type) => {
        return t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier(`trackFunction${type}`)), [
            t.stringLiteral(functionName),
            t.stringLiteral(component),
            t.numericLiteral(functionId)
        ]);
    };
    // Template for tracking switch execution
    const createSwitchTrackingCall = (component, switchId, discriminant, caseIndex) => {
        const args = [
            t.stringLiteral(component),
            t.numericLiteral(switchId),
            discriminant
        ];
        // Add case index if provided
        if (caseIndex !== undefined) {
            args.push(t.numericLiteral(caseIndex));
        }
        return t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackSwitch')), args);
    };
    // Template for tracking try-catch execution
    const createTryCatchTrackingCall = (component, blockId, blockType, errorParam = null) => {
        const args = [
            t.stringLiteral(component),
            t.numericLiteral(blockId),
            t.stringLiteral(blockType)
        ];
        // Add error parameter for catch blocks if provided
        if (errorParam) {
            args.push(errorParam);
        }
        return t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackTryCatch')), args);
    };
    // Check if a node is part of the instrumentation code
    const isInstrumentationCode = (path) => {
        // Check if node contains instrumentation code
        if (!path.node)
            return false;
        let isInstrumentation = false;
        path.traverse({
            MemberExpression(memberPath) {
                if (memberPath.node.object &&
                    memberPath.node.object.name === 'COVERAGE_TRACKER') {
                    isInstrumentation = true;
                    memberPath.stop();
                }
            }
        });
        return isInstrumentation;
    };
    // Extract component name from filename
    const getComponentName = (filename) => {
        if (!filename)
            return 'unknown';
        // If running in a test file, use a generic name
        if (filename.includes('test-') || filename.includes('.test.')) {
            return 'TestFile';
        }
        return path.basename(filename, path.extname(filename));
    };
    // Create function tracking wrapper
    const createFunctionTrackingWrapper = (component, functionId, functionName, body) => {
        return t.blockStatement([
            // Add function start tracking
            t.expressionStatement(createFunctionTrackingCall(functionName, component, functionId, 'Start')),
            // Add original function body
            ...body.body
        ]);
    };
    // Create try-catch tracking wrapper
    const createTryCatchTrackingWrapper = (component, blockId, tryBlock, catchBlock, finallyBlock) => {
        const newTry = tryBlock ?
            t.blockStatement([
                t.expressionStatement(createTryCatchTrackingCall(component, blockId, 'try')),
                ...tryBlock.body
            ]) : null;
        let newCatch = null;
        if (catchBlock) {
            const errorParam = catchBlock.param || t.identifier('e');
            newCatch = t.catchClause(errorParam, t.blockStatement([
                t.expressionStatement(createTryCatchTrackingCall(component, blockId, 'catch', errorParam)),
                ...catchBlock.body.body
            ]));
        }
        let newFinally = null;
        if (finallyBlock) {
            newFinally = t.blockStatement([
                t.expressionStatement(createTryCatchTrackingCall(component, blockId, 'finally')),
                ...finallyBlock.body
            ]);
        }
        return t.tryStatement(newTry, newCatch, newFinally);
    };
    return {
        name: "fixed-coverage-instrumentation-plugin",
        visitor: {
            // Handle function declarations and expressions
            FunctionDeclaration(path) {
                // Skip if node already visited or recursion too deep
                if (visitedNodes.has(path.node) || recursionDepth > MAX_RECURSION_DEPTH) {
                    return;
                }
                // Mark node as visited
                visitedNodes.add(path.node);
                recursionDepth++;
                try {
                    const filename = this.file.opts.filename;
                    const component = getComponentName(filename);
                    // Skip test functions
                    if (path.node.id &&
                        (path.node.id.name.startsWith('test') ||
                            path.node.id.name.includes('Test'))) {
                        return;
                    }
                    // Skip node_modules
                    if (filename && filename.includes('node_modules')) {
                        return;
                    }
                    // Skip if function already has instrumentation
                    if (isInstrumentationCode(path)) {
                        return;
                    }
                    // Generate unique function ID
                    const functionId = functionIDCounter++;
                    const functionName = path.node.id ? path.node.id.name : 'anonymous';
                    // Add instrumentation
                    path.node.body = createFunctionTrackingWrapper(component, functionId, functionName, path.node.body);
                }
                finally {
                    recursionDepth--;
                }
            },
            // Handle arrow functions
            ArrowFunctionExpression(path) {
                // Skip if node already visited or recursion too deep
                if (visitedNodes.has(path.node) || recursionDepth > MAX_RECURSION_DEPTH) {
                    return;
                }
                // Mark node as visited
                visitedNodes.add(path.node);
                recursionDepth++;
                try {
                    const filename = this.file.opts.filename;
                    const component = getComponentName(filename);
                    // Skip node_modules
                    if (filename && filename.includes('node_modules')) {
                        return;
                    }
                    // Skip if function already has instrumentation
                    if (isInstrumentationCode(path)) {
                        return;
                    }
                    // Skip if not a block body
                    if (!t.isBlockStatement(path.node.body)) {
                        return;
                    }
                    // Generate unique function ID
                    const functionId = functionIDCounter++;
                    // Add instrumentation
                    path.node.body = createFunctionTrackingWrapper(component, functionId, 'arrow', path.node.body);
                }
                finally {
                    recursionDepth--;
                }
            },
            // Handle if statements for branch coverage
            IfStatement(path) {
                // Skip if node already visited or recursion too deep
                if (visitedNodes.has(path.node) || recursionDepth > MAX_RECURSION_DEPTH) {
                    return;
                }
                // Mark node as visited
                visitedNodes.add(path.node);
                recursionDepth++;
                try {
                    const filename = this.file.opts.filename;
                    const component = getComponentName(filename);
                    // Skip node_modules
                    if (filename && filename.includes('node_modules')) {
                        return;
                    }
                    // Skip if already has instrumentation
                    if (isInstrumentationCode(path)) {
                        return;
                    }
                    // Generate unique branch ID
                    const branchId = branchIDCounter++;
                    // Replace the condition with tracked condition
                    path.node.test = createBranchTrackingCall(component, branchId, 'if', path.node.test);
                }
                finally {
                    recursionDepth--;
                }
            },
            // Handle switch statements
            SwitchStatement(path) {
                // Skip if node already visited or recursion too deep
                if (visitedNodes.has(path.node) || recursionDepth > MAX_RECURSION_DEPTH) {
                    return;
                }
                // Mark node as visited
                visitedNodes.add(path.node);
                recursionDepth++;
                try {
                    const filename = this.file.opts.filename;
                    const component = getComponentName(filename);
                    // Skip node_modules
                    if (filename && filename.includes('node_modules')) {
                        return;
                    }
                    // Skip if already has instrumentation
                    if (isInstrumentationCode(path)) {
                        return;
                    }
                    // Generate unique switch ID
                    const switchId = switchIDCounter++;
                    // Instrument the discriminant
                    path.node.discriminant = createSwitchTrackingCall(component, switchId, path.node.discriminant);
                    // Instrument each case
                    path.node.cases.forEach((caseNode, index) => {
                        // Add the index to the beginning of the case's consequent block
                        if (caseNode.consequent && caseNode.consequent.length > 0) {
                            const trackingCall = t.expressionStatement(createSwitchTrackingCall(component, switchId, t.identifier('undefined'), index));
                            caseNode.consequent.unshift(trackingCall);
                        }
                    });
                }
                finally {
                    recursionDepth--;
                }
            },
            // Handle try-catch statements
            TryStatement(path) {
                // Skip if node already visited or recursion too deep
                if (visitedNodes.has(path.node) || recursionDepth > MAX_RECURSION_DEPTH) {
                    return;
                }
                // Mark node as visited
                visitedNodes.add(path.node);
                recursionDepth++;
                try {
                    const filename = this.file.opts.filename;
                    const component = getComponentName(filename);
                    // Skip node_modules
                    if (filename && filename.includes('node_modules')) {
                        return;
                    }
                    // Skip if already has instrumentation
                    if (isInstrumentationCode(path)) {
                        return;
                    }
                    // Generate unique try-catch ID
                    const blockId = tryCatchIDCounter++;
                    // Create instrumented try-catch statement
                    const newTryStatement = createTryCatchTrackingWrapper(component, blockId, path.node.block, path.node.handler, path.node.finalizer);
                    // Replace the original try-catch with the instrumented version
                    path.replaceWith(newTryStatement);
                }
                finally {
                    recursionDepth--;
                }
            }
        }
    };
});
