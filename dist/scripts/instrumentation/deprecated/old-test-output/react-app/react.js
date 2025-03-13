"use strict";
// Simple React mock for Node.js environment
const React = {
    createElement: function () {
        // Just return the arguments as an object for inspection
        return {
            type: arguments[0],
            props: arguments[1] || {},
            children: Array.prototype.slice.call(arguments, 2)
        };
    },
    Fragment: Symbol('Fragment')
};
module.exports = React;
