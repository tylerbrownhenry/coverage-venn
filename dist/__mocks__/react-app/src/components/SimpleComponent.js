"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Simple component with basic JSX structure
 * Used to test basic JSX element tracking
 */
function SimpleComponent() {
    return (react_1.default.createElement("div", { className: "simple-component" },
        react_1.default.createElement("h2", null, "Simple Component"),
        react_1.default.createElement("p", null, "This is a basic component with simple JSX structure"),
        react_1.default.createElement("div", { className: "content" },
            react_1.default.createElement("ul", null,
                react_1.default.createElement("li", null, "Item 1"),
                react_1.default.createElement("li", null, "Item 2"),
                react_1.default.createElement("li", null, "Item 3")))));
}
exports.default = SimpleComponent;
