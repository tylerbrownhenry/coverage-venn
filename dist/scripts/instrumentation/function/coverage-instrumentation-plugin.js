"use strict";
/**
 * Function Instrumentation Plugin
 *
 * This Babel plugin adds instrumentation code to functions for coverage tracking
 */
const { declare } = require('@babel/helper-plugin-utils');
// Global variable to store coverage data
global.__FUNCTION_COVERAGE_DATA = {
    functions: {},
    branches: {}
};
module.exports = declare((api, options = {}) => {
    api.assertVersion(7);
    // Reference the global coverage data
    const coverageData = global.__FUNCTION_COVERAGE_DATA;
    // Generate a unique ID for each function
    function generateFunctionId(path) {
        const loc = path.node.loc;
        if (!loc)
            return Math.random().toString(36).substr(2, 9);
        const name = path.node.id?.name || 'anonymous';
        return `func_${name}_${loc.start.line}_${loc.start.column}`;
    }
    return {
        name: 'function-coverage-instrumentation',
        visitor: {
            // Track function declarations and expressions
            "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression": function (path) {
                // Skip arrow functions without a block body
                if (path.isArrowFunctionExpression() && !path.get('body').isBlockStatement()) {
                    return;
                }
                // Generate a unique ID for this function
                const functionId = generateFunctionId(path);
                // Track this function
                coverageData.functions[functionId] = {
                    count: 0,
                    location: path.node.loc,
                    name: path.node.id?.name || 'anonymous'
                };
                // Get the function body
                const body = path.get('body');
                // Insert instrumentation at the beginning of the function body
                if (body.isBlockStatement()) {
                    body.unshiftContainer('body', api.template.statement(`
            console.log("Function Called:", "${functionId}");
          `)());
                }
            },
            // Track if statements for branch coverage
            IfStatement(path) {
                const loc = path.node.loc;
                if (!loc)
                    return;
                const branchId = `branch_${loc.start.line}_${loc.start.column}`;
                // Track this branch
                coverageData.branches[branchId] = {
                    truthy: 0,
                    falsy: 0,
                    location: loc
                };
                // Wrap test expression with a logging function
                const test = path.get('test');
                // Create a tracking expression that evaluates the condition
                // and logs the result before returning it
                const trackingExpression = api.types.callExpression(api.types.functionExpression(null, [], api.types.blockStatement([
                    api.types.variableDeclaration('const', [
                        api.types.variableDeclarator(api.types.identifier('result'), test.node)
                    ]),
                    api.template.statement(`
                console.log("Branch:", "${branchId}", result ? "truthy" : "falsy");
              `)(),
                    api.types.returnStatement(api.types.identifier('result'))
                ])), []);
                // Replace the test with our tracking expression
                test.replaceWith(trackingExpression);
            }
        }
    };
});
