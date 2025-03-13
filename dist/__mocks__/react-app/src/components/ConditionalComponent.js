"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
/**
 * Component that demonstrates different conditional rendering patterns
 * Used to test instrumentation of conditional JSX rendering
 */
function ConditionalComponent({ condition }) {
    const [showDetails, setShowDetails] = (0, react_1.useState)(false);
    const [count, setCount] = (0, react_1.useState)(0);
    return (react_1.default.createElement("div", { className: "conditional-component" },
        react_1.default.createElement("h2", null, "Conditional Component"),
        condition && (react_1.default.createElement("div", { className: "condition-true" },
            react_1.default.createElement("p", null, "Condition is TRUE"))),
        !condition && (react_1.default.createElement("div", { className: "condition-false" },
            react_1.default.createElement("p", null, "Condition is FALSE"))),
        react_1.default.createElement("div", { className: "ternary-example" }, condition ? (react_1.default.createElement("button", { onClick: () => setShowDetails(!showDetails) },
            showDetails ? 'Hide' : 'Show',
            " Details")) : (react_1.default.createElement("p", null, "Conditional rendering disabled"))),
        showDetails && (react_1.default.createElement("div", { className: "details" },
            react_1.default.createElement("h3", null, "Additional Details"),
            react_1.default.createElement("p", null, "These details are conditionally shown based on user interaction."))),
        react_1.default.createElement("div", { className: "counter" },
            react_1.default.createElement("p", null,
                "Count: ",
                count),
            react_1.default.createElement("button", { onClick: () => setCount(count + 1) }, "Increment"),
            react_1.default.createElement("button", { onClick: () => setCount(count - 1) }, "Decrement"),
            count > 0 ? (react_1.default.createElement("p", { className: "positive" }, "Count is positive")) : count < 0 ? (react_1.default.createElement("p", { className: "negative" }, "Count is negative")) : (react_1.default.createElement("p", { className: "zero" }, "Count is zero")),
            (count > 5 || count < -5) && (react_1.default.createElement("p", { className: "extreme" }, "Count has reached an extreme value!")))));
}
exports.default = ConditionalComponent;
