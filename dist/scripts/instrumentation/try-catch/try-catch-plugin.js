"use strict";
/**
 * Babel plugin for advanced code coverage instrumentation
 *
 * This plugin adds instrumentation to track:
 * - Conditional branches (if/else, ternary)
 * - JSX conditional rendering
 * - Function execution and completion
 * - React component rendering
 * - TypeScript-specific syntax
 */
const { declare } = require('@babel/helper-plugin-utils');
const t = require('@babel/types');
const template = require('@babel/template').default;
// Counter to generate unique IDs for branches
let branchIDCounter = 0;
// Create template for tracking branch execution
const trackBranchTemplate = template(`
  COVERAGE_TRACKER.trackBranch(COMPONENT_NAME, BRANCH_ID, BRANCH_TYPE, CONDITION ? 0 : 1);
`);
// Create template for tracking JSX rendering
const trackJSXTemplate = template(`
  (COVERAGE_TRACKER.trackJSXRender(COMPONENT_NAME, JSX_ID, ELEMENT_TYPE), JSX_EXPRESSION)
`);
/**
 * Check if a node is part of our instrumentation code
 */
function isPartOfInstrumentation(path) {
    // Check if this is part of our instrumentation code
    const node = path.node;
    // Check if the node is already instrumented
    if (node._coverageInstrumented) {
        return true;
    }
    // Check if this is a call to one of our tracking functions
    if (path.isCallExpression() &&
        path.get('callee').isMemberExpression() &&
        path.get('callee').get('object').isIdentifier({ name: 'COVERAGE_TRACKER' })) {
        return true;
    }
    // Check if this is a reference to COVERAGE_TRACKER
    if (path.isIdentifier() && path.node.name === 'COVERAGE_TRACKER') {
        return true;
    }
    // Check if this is a member expression of COVERAGE_TRACKER
    if (path.isMemberExpression() &&
        path.get('object').isIdentifier({ name: 'COVERAGE_TRACKER' })) {
        return true;
    }
    return false;
}
/**
 * Get component name from file path and scope
 */
function getComponentName(filename, path) {
    // Try to get from function name or variable declaration
    const scope = path.scope;
    // Check if scope.block is a function declaration with an id
    if (t.isFunctionDeclaration(scope.block) && scope.block.id?.name) {
        return scope.block.id.name;
    }
    // Try to get from containing variable declaration
    const variableDeclarator = path.findParent((p) => p.isVariableDeclarator());
    // Safely check and access id property with type guards
    if (variableDeclarator && variableDeclarator.node &&
        'id' in variableDeclarator.node &&
        variableDeclarator.node.id &&
        t.isIdentifier(variableDeclarator.node.id)) {
        return variableDeclarator.node.id.name;
    }
    // Fallback to filename-based guess
    const parts = filename.split('/');
    const fileNameWithExt = parts[parts.length - 1];
    const fileName = fileNameWithExt.split('.')[0];
    // Convert kebab-case or snake_case to PascalCase
    if (fileName.includes('-') || fileName.includes('_')) {
        return fileName
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('');
    }
    // Default to PascalCase filename
    return fileName.charAt(0).toUpperCase() + fileName.slice(1);
}
/**
 * Create a function tracking wrapper
 */
function createFunctionTrackingWrapper(componentName, functionName, functionId, bodyStatements) {
    // Create tracking start call
    const startTrackingCall = t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackFunctionStart')), [
        t.stringLiteral(componentName),
        t.stringLiteral(functionName),
        t.numericLiteral(functionId)
    ]));
    // Create tracking end call
    const endTrackingCall = t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackFunctionEnd')), [
        t.stringLiteral(componentName),
        t.stringLiteral(functionName),
        t.numericLiteral(functionId)
    ]));
    // Create tracking error call
    const errorTrackingCall = t.expressionStatement(t.callExpression(t.memberExpression(t.identifier('COVERAGE_TRACKER'), t.identifier('trackFunctionError')), [
        t.stringLiteral(componentName),
        t.stringLiteral(functionName),
        t.numericLiteral(functionId)
    ]));
    // Create try-catch block
    return t.blockStatement([
        startTrackingCall,
        t.tryStatement(t.blockStatement([
            ...bodyStatements,
            endTrackingCall
        ]), t.catchClause(t.identifier('error'), t.blockStatement([
            errorTrackingCall,
            t.throwStatement(t.identifier('error'))
        ])))
    ]);
}
/**
 * The main Babel plugin
 */
module.exports = declare((api) => {
    api.assertVersion(7);
    return {
        name: 'coverage-instrumentation-plugin',
        visitor: {
            // Handle if statements and track condition branches
            IfStatement(path, state) {
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                const branchId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Create tracking expression for condition
                const trackerNode = trackBranchTemplate({
                    COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: t.stringLiteral(componentName),
                    BRANCH_ID: t.numericLiteral(branchId),
                    BRANCH_TYPE: t.stringLiteral('if'),
                    CONDITION: path.node.test
                });
                // Add tracking before the if statement
                path.insertBefore(trackerNode);
                // Mark as instrumented
                path.node._coverageInstrumented = true;
            },
            // Handle ternary operators
            ConditionalExpression(path, state) {
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                const branchId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get parent to determine context (JSX or regular code)
                const isInsideJSX = path.findParent((p) => p.isJSXElement() || p.isJSXFragment());
                const branchType = isInsideJSX ? 'jsx-conditional' : 'ternary';
                // Create tracking expression for condition
                const trackerNode = trackBranchTemplate({
                    COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: t.stringLiteral(componentName),
                    BRANCH_ID: t.numericLiteral(branchId),
                    BRANCH_TYPE: t.stringLiteral(branchType),
                    CONDITION: path.node.test
                });
                // For JSX we need to wrap the entire expression
                if (isInsideJSX) {
                    // Replace the expression with our instrumented version
                    const trackerResult = trackerNode;
                    const expr = trackerResult.expression || trackerNode;
                    const newNode = t.sequenceExpression([
                        expr,
                        path.node
                    ]);
                    // Mark as instrumented
                    newNode._coverageInstrumented = true;
                    path.replaceWith(newNode);
                    path.skip(); // Skip to prevent recursion
                }
                else {
                    // For regular code, insert before
                    path.insertBefore(trackerNode);
                    // Mark as instrumented
                    path.node._coverageInstrumented = true;
                }
            },
            // Handle logical expressions like condition && <Component />
            LogicalExpression(path, state) {
                // Only instrument && and || operators used for conditional rendering
                if (path.node.operator !== '&&' && path.node.operator !== '||') {
                    return;
                }
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                // Only instrument if inside JSX
                const isInsideJSX = path.findParent((p) => p.isJSXElement() || p.isJSXFragment());
                if (!isInsideJSX) {
                    return;
                }
                const branchId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Create tracking expression for condition
                const trackerNode = trackBranchTemplate({
                    COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: t.stringLiteral(componentName),
                    BRANCH_ID: t.numericLiteral(branchId),
                    BRANCH_TYPE: t.stringLiteral('jsx-logical'),
                    CONDITION: path.node.left // Track the left side of && or ||
                });
                // Replace the expression with our instrumented version
                const trackerResult = trackerNode;
                const expr = trackerResult.expression || trackerNode;
                const newNode = t.sequenceExpression([
                    expr,
                    path.node
                ]);
                // Mark as instrumented
                newNode._coverageInstrumented = true;
                path.replaceWith(newNode);
                path.skip(); // Skip to prevent recursion
            },
            // Handle JSX elements
            JSXElement(path, state) {
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                const jsxId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get element type (component name)
                let elementType = 'unknown';
                const openingElement = path.node.openingElement;
                if (t.isJSXIdentifier(openingElement.name)) {
                    elementType = openingElement.name.name;
                }
                // Create tracking for JSX rendering
                const trackerNode = trackJSXTemplate({
                    COVERAGE_TRACKER: t.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: t.stringLiteral(componentName),
                    JSX_ID: t.numericLiteral(jsxId),
                    ELEMENT_TYPE: t.stringLiteral(elementType),
                    JSX_EXPRESSION: path.node
                });
                // Replace with instrumented version
                const trackerResult = trackerNode;
                const expr = trackerResult.expression || trackerNode;
                // Mark as instrumented
                expr._coverageInstrumented = true;
                path.replaceWith(expr);
                path.skip(); // Skip to prevent recursion
            },
            // Track function declarations and component functions
            FunctionDeclaration(path, state) {
                // Skip if it's a test function
                const functionName = path.node.id?.name || 'anonymous';
                if (functionName.includes('test') || functionName.includes('Test') || functionName.includes('mock')) {
                    return;
                }
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                const functionId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get the original body statements
                const bodyStatements = path.node.body.body;
                // Create a new body with tracking
                const newBody = createFunctionTrackingWrapper(componentName, functionName, functionId, bodyStatements);
                // Mark as instrumented
                newBody._coverageInstrumented = true;
                // Replace the function body with instrumented version
                path.get('body').replaceWith(newBody);
            },
            // Track arrow functions (often used for components)
            ArrowFunctionExpression(path, state) {
                // Skip if inside test files
                if (state.filename.includes('test') || state.filename.includes('__tests__')) {
                    return;
                }
                // Skip if already instrumented or inside node_modules
                if (path.node._coverageInstrumented ||
                    (state.filename && state.filename.includes('node_modules'))) {
                    return;
                }
                // Skip if it's part of our instrumentation
                if (isPartOfInstrumentation(path)) {
                    return;
                }
                const functionId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get function name from parent if possible
                let functionName = 'anonymous';
                const variableDeclarator = path.findParent((p) => p.isVariableDeclarator());
                // Safely check and access id property with type guards
                if (variableDeclarator && variableDeclarator.node &&
                    'id' in variableDeclarator.node &&
                    variableDeclarator.node.id &&
                    t.isIdentifier(variableDeclarator.node.id)) {
                    functionName = variableDeclarator.node.id.name;
                }
                // Handle both block body and expression body arrow functions
                let bodyStatements;
                if (t.isBlockStatement(path.node.body)) {
                    // Arrow with block body: () => { return x; }
                    bodyStatements = path.node.body.body;
                }
                else {
                    // Arrow with expression body: () => x
                    // Convert to block body with return
                    bodyStatements = [
                        t.returnStatement(path.node.body)
                    ];
                }
                // Create a new body with tracking
                const newBody = createFunctionTrackingWrapper(componentName, functionName, functionId, bodyStatements);
                // Mark as instrumented
                newBody._coverageInstrumented = true;
                // Replace the function body with instrumented version
                path.get('body').replaceWith(newBody);
            },
            // Handle TypeScript interfaces, types, and enums (skip instrumentation)
            TSInterfaceDeclaration() {
                // Skip instrumentation for TypeScript interfaces
            },
            TSTypeAliasDeclaration() {
                // Skip instrumentation for TypeScript types
            },
            TSEnumDeclaration() {
                // Skip instrumentation for TypeScript enums
            },
            // Handle TypeScript-specific function declarations
            TSDeclareFunction() {
                // Skip instrumentation for TypeScript ambient function declarations
            },
            // Skip type assertions but process their expressions
            TSAsExpression(path, state) {
                // Skip if already instrumented
                if (path.node._coverageInstrumented) {
                    return;
                }
                // Mark as instrumented to prevent recursion
                path.node._coverageInstrumented = true;
                // Process the underlying expression but ignore the type assertion
                const expressionPath = path.get('expression');
                if (expressionPath.isConditionalExpression()) {
                    this.ConditionalExpression(expressionPath, state);
                }
                else if (expressionPath.isLogicalExpression()) {
                    this.LogicalExpression(expressionPath, state);
                }
            },
            // Handle type checked expressions in conditionals
            TSTypeParameter() {
                // Skip instrumentation for TypeScript type parameters
            }
        }
    };
});
