"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
exports.ConditionalComponent = ConditionalComponent;
exports.ComplexComponent = ComplexComponent;
// Import React (normally required for JSX)
// This is just for testing babel transformation, we don't actually run this file directly
const React = {
    createElement: (...args) => args
};
// Simple component with JSX
function Button({ text, onClick }) {
    COVERAGE_TRACKER.trackFunctionStart("Button", "TestFile", 0);
    return /*#__PURE__*/ React.createElement("button", {
        className: "btn",
        onClick: onClick
    }, text);
}
// Component with conditional rendering
function ConditionalComponent({ condition, value }) {
    COVERAGE_TRACKER.trackFunctionStart("ConditionalComponent", "TestFile", 1);
    return /*#__PURE__*/ React.createElement("div", null, condition ? /*#__PURE__*/ React.createElement("span", {
        className: "true-case"
    }, value) : /*#__PURE__*/ React.createElement("span", {
        className: "false-case"
    }, "No value"));
}
// Component with function and JSX together
function ComplexComponent({ items, onItemClick }) {
    COVERAGE_TRACKER.trackFunctionStart("ComplexComponent", "TestFile", 2);
    const handleItemClick = item => {
        COVERAGE_TRACKER.trackFunctionStart("arrow", "TestFile", 3);
        console.log('Item clicked:', item);
        onItemClick(item);
    };
    return /*#__PURE__*/ React.createElement("div", {
        className: "list-container"
    }, /*#__PURE__*/ React.createElement("h2", null, "Items List"), /*#__PURE__*/ React.createElement("ul", null, items.map(item => /*#__PURE__*/ React.createElement("li", {
        key: item.id,
        onClick: () => handleItemClick(item)
    }, item.name))));
}
