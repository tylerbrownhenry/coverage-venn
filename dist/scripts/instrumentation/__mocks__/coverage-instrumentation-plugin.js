"use strict";
// Common mock for coverage-instrumentation-plugin.js
module.exports = function () {
    return {
        name: 'coverage-instrumentation-plugin',
        visitor: {
            // Mock visitor methods
            IfStatement() { },
            FunctionDeclaration() { },
            ArrowFunctionExpression() { },
            JSXElement() { },
            TryStatement() { },
            SwitchStatement() { }
        }
    };
};
