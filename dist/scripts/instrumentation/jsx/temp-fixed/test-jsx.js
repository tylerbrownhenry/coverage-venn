"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = Button;
exports.ConditionalComponent = ConditionalComponent;
exports.ComplexComponent = ComplexComponent;
// Import React (normally required for JSX)
// This is just for testing babel transformation, we don't actually run this file directly
const React = { createElement: (...args) => args };
// Simple component with JSX
function Button({ text, onClick }) {
    return (React.createElement("button", { className: "btn", onClick: onClick }, text));
}
// Component with conditional rendering
function ConditionalComponent({ condition, value }) {
    return (React.createElement("div", null, condition ? (React.createElement("span", { className: "true-case" }, value)) : (React.createElement("span", { className: "false-case" }, "No value"))));
}
// Component with function and JSX together
function ComplexComponent({ items, onItemClick }) {
    const handleItemClick = (item) => {
        console.log('Item clicked:', item);
        onItemClick(item);
    };
    return (React.createElement("div", { className: "list-container" },
        React.createElement("h2", null, "Items List"),
        React.createElement("ul", null, items.map((item) => (React.createElement("li", { key: item.id, onClick: () => handleItemClick(item) }, item.name))))));
}
