"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return COVERAGE_TRACKER.trackBranch("NestedComponent", 184, "ternary", e && e.__esModule ? 0 : 1), e && e.__esModule ? e : { default: e }; }
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 155, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 156, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 157, "h3");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 158, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 159, "li");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 161, "button");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 163, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 164, "h2");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 165, "nav");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 166, "ul");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 167, "NavItem");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 168, "NavItem");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 169, "NavItem");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 170, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 171, "Card");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 172, "p");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 173, "button");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 174, "Card");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 175, "p");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 176, "div");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 177, "ul");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 178, "li");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 179, "li");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 180, "Card");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 181, "p");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 182, "Card");
COVERAGE_TRACKER.trackJSXRender("NestedComponent", 183, "p");
/**
 * Card component used as a child in NestedComponent
 */
function Card(_ref) {
    var title = _ref.title, children = _ref.children;
    return /*#__PURE__*/ _react["default"].createElement("div", {
        className: "card"
    }, /*#__PURE__*/ _react["default"].createElement("div", {
        className: "card-header"
    }, /*#__PURE__*/ _react["default"].createElement("h3", null, title)), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "card-body"
    }, children));
}
/**
 * NavItem component used as a child in NestedComponent
 */
function NavItem(_ref2) {
    var label = _ref2.label, active = _ref2.active, onClick = _ref2.onClick;
    return /*#__PURE__*/ _react["default"].createElement("li", {
        className: "nav-item ".concat((COVERAGE_TRACKER.trackBranch("NestedComponent", 160, "ternary", active ? 0 : 1), COVERAGE_TRACKER.trackBranch("NestedComponent", 162, "ternary", active ? 0 : 1), active ? 'active' : ''))
    }, /*#__PURE__*/ _react["default"].createElement("button", {
        onClick: onClick
    }, label));
}
/**
 * Component that demonstrates nested component structure
 * Used to test instrumentation of nested JSX elements
 */
function NestedComponent() {
    return /*#__PURE__*/ _react["default"].createElement("div", {
        className: "nested-component"
    }, /*#__PURE__*/ _react["default"].createElement("h2", null, "Nested Component"), /*#__PURE__*/ _react["default"].createElement("nav", {
        className: "nav-container"
    }, /*#__PURE__*/ _react["default"].createElement("ul", null, /*#__PURE__*/ _react["default"].createElement(NavItem, {
        label: "Home",
        active: true,
        onClick: function onClick() { }
    }), /*#__PURE__*/ _react["default"].createElement(NavItem, {
        label: "About",
        active: false,
        onClick: function onClick() { }
    }), /*#__PURE__*/ _react["default"].createElement(NavItem, {
        label: "Contact",
        active: false,
        onClick: function onClick() { }
    }))), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "cards-container"
    }, /*#__PURE__*/ _react["default"].createElement(Card, {
        title: "Feature One"
    }, /*#__PURE__*/ _react["default"].createElement("p", null, "This is the first feature card with nested content."), /*#__PURE__*/ _react["default"].createElement("button", null, "Learn More")), /*#__PURE__*/ _react["default"].createElement(Card, {
        title: "Feature Two"
    }, /*#__PURE__*/ _react["default"].createElement("p", null, "This is the second feature card with nested content."), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "nested-deeper"
    }, /*#__PURE__*/ _react["default"].createElement("ul", null, /*#__PURE__*/ _react["default"].createElement("li", null, "Nested list item 1"), /*#__PURE__*/ _react["default"].createElement("li", null, "Nested list item 2")))), /*#__PURE__*/ _react["default"].createElement(Card, {
        title: "Feature Three"
    }, /*#__PURE__*/ _react["default"].createElement("p", null, "This is the third feature card with nested content."), /*#__PURE__*/ _react["default"].createElement(Card, {
        title: "Nested Card"
    }, /*#__PURE__*/ _react["default"].createElement("p", null, "This is a card nested inside another card!")))));
}
var _default = exports["default"] = NestedComponent;
