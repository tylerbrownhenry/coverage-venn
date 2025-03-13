"use strict";
/**
 * Babel plugin for advanced code coverage instrumentation
 *
 * This plugin adds instrumentation to track:
 * - Conditional branches (if/else, ternary)
 * - JSX conditional rendering
 * - Function execution and completion
 * - React component rendering
 */
Object.defineProperty(exports, "__esModule", { value: true });
const helper_plugin_utils_1 = require("@babel/helper-plugin-utils");
const core_1 = require("@babel/core");
// Counter to generate unique IDs for branches
let branchIDCounter = 0;
// Create template for tracking branch execution
const trackBranchTemplate = (0, core_1.template)(`
  COVERAGE_TRACKER.trackBranch(COMPONENT_NAME, BRANCH_ID, BRANCH_TYPE, CONDITION ? 0 : 1);
`);
// Create template for tracking function execution
const trackFunctionTemplate = (0, core_1.template)(`
  try {
    COVERAGE_TRACKER.trackFunctionStart(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    const RESULT = FUNCTION_BODY;
    COVERAGE_TRACKER.trackFunctionEnd(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    return RESULT;
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError(COMPONENT_NAME, FUNCTION_NAME, FUNCTION_ID);
    throw error;
  }
`);
// Create template for tracking JSX rendering
const trackJSXTemplate = (0, core_1.template)(`
  (COVERAGE_TRACKER.trackJSXRender(COMPONENT_NAME, JSX_ID, ELEMENT_TYPE), JSX_EXPRESSION)
`);
/**
 * Get component name from file path and scope
 */
function getComponentName(filename, path) {
    // Try to get from function name or variable declaration
    const scope = path.scope;
    // Check if scope.block is a function declaration with an id
    if (core_1.types.isFunctionDeclaration(scope.block) && scope.block.id?.name) {
        return scope.block.id.name;
    }
    // Try to get from containing variable declaration
    const variableDeclarator = path.findParent((p) => p.isVariableDeclarator());
    // Safely check and access id property with type guards
    if (variableDeclarator && variableDeclarator.node &&
        'id' in variableDeclarator.node &&
        variableDeclarator.node.id &&
        core_1.types.isIdentifier(variableDeclarator.node.id)) {
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
 * The main Babel plugin
 */
exports.default = (0, helper_plugin_utils_1.declare)((api) => {
    api.assertVersion(7);
    return {
        name: 'coverage-instrumentation-plugin',
        visitor: {
            // Handle if statements and track condition branches
            IfStatement(path, state) {
                const branchId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Create tracking expression for condition
                const trackerNode = trackBranchTemplate({
                    COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                    BRANCH_ID: core_1.types.numericLiteral(branchId),
                    BRANCH_TYPE: core_1.types.stringLiteral('if'),
                    CONDITION: path.node.test
                });
                // Add tracking before the if statement
                path.insertBefore(trackerNode);
            },
            // Handle ternary operators
            ConditionalExpression(path, state) {
                const branchId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get parent to determine context (JSX or regular code)
                const isInsideJSX = path.findParent((p) => p.isJSXElement() || p.isJSXFragment());
                const branchType = isInsideJSX ? 'jsx-conditional' : 'ternary';
                // Create tracking expression for condition
                const trackerNode = trackBranchTemplate({
                    COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                    BRANCH_ID: core_1.types.numericLiteral(branchId),
                    BRANCH_TYPE: core_1.types.stringLiteral(branchType),
                    CONDITION: path.node.test
                });
                // For JSX we need to wrap the entire expression
                if (isInsideJSX) {
                    // Replace the expression with our instrumented version
                    const trackerResult = trackerNode;
                    const expr = trackerResult.expression || trackerNode;
                    path.replaceWith(core_1.types.sequenceExpression([
                        expr,
                        path.node
                    ]));
                }
                else {
                    // For regular code, insert before
                    path.insertBefore(trackerNode);
                }
            },
            // Handle logical expressions like condition && <Component />
            LogicalExpression(path, state) {
                // Only instrument && and || operators used for conditional rendering
                if (path.node.operator !== '&&' && path.node.operator !== '||') {
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
                    COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                    BRANCH_ID: core_1.types.numericLiteral(branchId),
                    BRANCH_TYPE: core_1.types.stringLiteral('jsx-logical'),
                    CONDITION: path.node.left // Track the left side of && or ||
                });
                // Replace the expression with our instrumented version
                const trackerResult = trackerNode;
                const expr = trackerResult.expression || trackerNode;
                path.replaceWith(core_1.types.sequenceExpression([
                    expr,
                    path.node
                ]));
            },
            // Handle JSX elements
            JSXElement(path, state) {
                const jsxId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Get element type (component name)
                let elementType = 'unknown';
                const openingElement = path.node.openingElement;
                if (core_1.types.isJSXIdentifier(openingElement.name)) {
                    elementType = openingElement.name.name;
                }
                // Create tracking for JSX rendering
                const trackerNode = trackJSXTemplate({
                    COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                    JSX_ID: core_1.types.numericLiteral(jsxId),
                    ELEMENT_TYPE: core_1.types.stringLiteral(elementType),
                    JSX_EXPRESSION: path.node
                });
                // Replace with instrumented version
                const trackerResult = trackerNode;
                const expr = trackerResult.expression || trackerNode;
                path.replaceWith(expr);
            },
            // Track function declarations and component functions
            FunctionDeclaration(path, state) {
                // Skip if it's a test function
                const functionName = path.node.id?.name || 'anonymous';
                if (functionName.includes('test') || functionName.includes('Test') || functionName.includes('mock')) {
                    return;
                }
                const functionId = branchIDCounter++;
                const componentName = getComponentName(state.filename, path);
                // Instrument function body to track execution
                const bodyBlockStatement = path.node.body;
                const newBody = trackFunctionTemplate({
                    COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                    COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                    FUNCTION_NAME: core_1.types.stringLiteral(functionName),
                    FUNCTION_ID: core_1.types.numericLiteral(functionId),
                    FUNCTION_BODY: bodyBlockStatement,
                    RESULT: core_1.types.identifier('__coverage_result')
                });
                // Replace the function body with instrumented version
                path.get('body').replaceWith(newBody);
            },
            // Track arrow functions (often used for components)
            ArrowFunctionExpression(path, state) {
                // Skip if inside test files
                if (state.filename.includes('test') || state.filename.includes('__tests__')) {
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
                    core_1.types.isIdentifier(variableDeclarator.node.id)) {
                    functionName = variableDeclarator.node.id.name;
                }
                // Need to handle both block body and expression body arrow functions
                let newBody;
                if (core_1.types.isBlockStatement(path.node.body)) {
                    // Arrow with block body: () => { return x; }
                    newBody = trackFunctionTemplate({
                        COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                        COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                        FUNCTION_NAME: core_1.types.stringLiteral(functionName),
                        FUNCTION_ID: core_1.types.numericLiteral(functionId),
                        FUNCTION_BODY: path.node.body,
                        RESULT: core_1.types.identifier('__coverage_result')
                    });
                }
                else {
                    // Arrow with expression body: () => x
                    // First convert to block body with return
                    const blockBody = core_1.types.blockStatement([
                        core_1.types.returnStatement(path.node.body)
                    ]);
                    newBody = trackFunctionTemplate({
                        COVERAGE_TRACKER: core_1.types.identifier('COVERAGE_TRACKER'),
                        COMPONENT_NAME: core_1.types.stringLiteral(componentName),
                        FUNCTION_NAME: core_1.types.stringLiteral(functionName),
                        FUNCTION_ID: core_1.types.numericLiteral(functionId),
                        FUNCTION_BODY: blockBody,
                        RESULT: core_1.types.identifier('__coverage_result')
                    });
                }
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
            },
        }
    };
});
