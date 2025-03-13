"use strict";
/**
 * JSX Instrumentation Plugin
 *
 * This Babel plugin adds instrumentation code to JSX elements for coverage tracking
 */
const { declare } = require('@babel/helper-plugin-utils');
// Global variable to store coverage data
global.__JSX_COVERAGE_DATA = {
    jsxElements: {},
    conditions: {}
};
module.exports = declare((api, options = {}) => {
    api.assertVersion(7);
    // Reference the global coverage data
    const coverageData = global.__JSX_COVERAGE_DATA;
    // Generate a unique ID for each JSX element
    function generateElementId(path) {
        const loc = path.node.loc;
        if (!loc)
            return Math.random().toString(36).substr(2, 9);
        return `jsx_${loc.start.line}_${loc.start.column}`;
    }
    return {
        name: 'jsx-coverage-instrumentation',
        visitor: {
            // Track JSX elements
            JSXElement(path) {
                // Generate a unique ID for this element
                const elementId = generateElementId(path);
                // Track this element
                coverageData.jsxElements[elementId] = {
                    count: 0,
                    location: path.node.loc
                };
                // Wrap the JSX element in a tracking function
                const jsxTrackerCall = api.template.expression(`
          (function() {
            // This would be replaced with actual tracking code in a real implementation
            console.log("JSX Element Rendered:", "${elementId}");
            return ELEMENT;
          })()
        `)({
                    ELEMENT: path.node
                });
                path.replaceWith(jsxTrackerCall);
            },
            // Track conditional expressions in JSX
            ConditionalExpression(path) {
                if (!path.findParent(p => p.isJSXElement()))
                    return;
                const loc = path.node.loc;
                if (!loc)
                    return;
                const conditionId = `cond_${loc.start.line}_${loc.start.column}`;
                // Track this condition
                coverageData.conditions[conditionId] = {
                    truthy: 0,
                    falsy: 0,
                    location: loc
                };
                // Wrap the condition to track which branch was taken
                const trackedCondition = api.template.expression(`
          (function() {
            const result = TEST;
            console.log("Condition Evaluated:", "${conditionId}", result ? "truthy" : "falsy");
            return result ? CONSEQUENT : ALTERNATE;
          })()
        `)({
                    TEST: path.node.test,
                    CONSEQUENT: path.node.consequent,
                    ALTERNATE: path.node.alternate
                });
                path.replaceWith(trackedCondition);
            }
        }
    };
});
