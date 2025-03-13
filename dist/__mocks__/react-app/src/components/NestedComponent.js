"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
/**
 * Card component used as a child in NestedComponent
 */
function Card({ title, children }) {
    return (react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("div", { className: "card-header" },
            react_1.default.createElement("h3", null, title)),
        react_1.default.createElement("div", { className: "card-body" }, children)));
}
/**
 * NavItem component used as a child in NestedComponent
 */
function NavItem({ label, active, onClick }) {
    return (react_1.default.createElement("li", { className: `nav-item ${active ? 'active' : ''}` },
        react_1.default.createElement("button", { onClick: onClick }, label)));
}
/**
 * Component that demonstrates nested component structure
 * Used to test instrumentation of nested JSX elements
 */
function NestedComponent() {
    return (react_1.default.createElement("div", { className: "nested-component" },
        react_1.default.createElement("h2", null, "Nested Component"),
        react_1.default.createElement("nav", { className: "nav-container" },
            react_1.default.createElement("ul", null,
                react_1.default.createElement(NavItem, { label: "Home", active: true, onClick: () => { } }),
                react_1.default.createElement(NavItem, { label: "About", active: false, onClick: () => { } }),
                react_1.default.createElement(NavItem, { label: "Contact", active: false, onClick: () => { } }))),
        react_1.default.createElement("div", { className: "cards-container" },
            react_1.default.createElement(Card, { title: "Feature One" },
                react_1.default.createElement("p", null, "This is the first feature card with nested content."),
                react_1.default.createElement("button", null, "Learn More")),
            react_1.default.createElement(Card, { title: "Feature Two" },
                react_1.default.createElement("p", null, "This is the second feature card with nested content."),
                react_1.default.createElement("div", { className: "nested-deeper" },
                    react_1.default.createElement("ul", null,
                        react_1.default.createElement("li", null, "Nested list item 1"),
                        react_1.default.createElement("li", null, "Nested list item 2")))),
            react_1.default.createElement(Card, { title: "Feature Three" },
                react_1.default.createElement("p", null, "This is the third feature card with nested content."),
                react_1.default.createElement(Card, { title: "Nested Card" },
                    react_1.default.createElement("p", null, "This is a card nested inside another card!"))))));
}
exports.default = NestedComponent;
