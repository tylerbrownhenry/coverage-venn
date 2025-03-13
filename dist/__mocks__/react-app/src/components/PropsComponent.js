"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Component that demonstrates various prop patterns
 * Used to test instrumentation of JSX with props
 */
function PropsComponent({ title = 'Default Title', description, items = [], showHeader = true, onAction = () => { }, theme = 'light' }) {
    // Using props in conditional rendering
    const headerElement = showHeader ? (react_1.default.createElement("header", { className: `header ${theme}` },
        react_1.default.createElement("h2", null, title),
        description && react_1.default.createElement("p", { className: "description" }, description))) : null;
    // Using props to generate dynamic content
    const itemElements = items.map((item, index) => (react_1.default.createElement("li", { key: index, className: index % 2 === 0 ? 'even' : 'odd' },
        react_1.default.createElement("span", null, item),
        react_1.default.createElement("button", { onClick: () => onAction(item) }, "Action"))));
    // Conditional class assignment based on props
    const containerClasses = [
        'props-component',
        `theme-${theme}`,
        items.length > 0 ? 'has-items' : 'no-items'
    ].join(' ');
    return (react_1.default.createElement("div", { className: containerClasses, "data-test-id": "props-component" },
        headerElement,
        react_1.default.createElement("div", { className: "component-body" }, items.length > 0 ? (react_1.default.createElement("ul", { className: "items-list" }, itemElements)) : (react_1.default.createElement("p", { className: "empty-message" }, "No items available"))),
        react_1.default.createElement("footer", null,
            react_1.default.createElement("p", null,
                "Total items: ",
                items.length),
            react_1.default.createElement("button", { className: "action-button", onClick: () => onAction('footer-action'), disabled: items.length === 0 }, "Perform Action"))));
}
exports.default = PropsComponent;
