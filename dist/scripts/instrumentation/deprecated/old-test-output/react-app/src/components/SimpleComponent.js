"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return COVERAGE_TRACKER.trackBranch("SimpleComponent", 123, "ternary", e && e.__esModule ? 0 : 1), e && e.__esModule ? e : { default: e }; }
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 115, "div");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 116, "h2");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 117, "p");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 118, "div");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 119, "ul");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 120, "li");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 121, "li");
COVERAGE_TRACKER.trackJSXRender("SimpleComponent", 122, "li");
/**
 * Simple component with basic JSX structure
 * Used to test basic JSX element tracking
 */
function SimpleComponent() {
    return /*#__PURE__*/ _react["default"].createElement("div", {
        className: "simple-component"
    }, /*#__PURE__*/ _react["default"].createElement("h2", null, "Simple Component"), /*#__PURE__*/ _react["default"].createElement("p", null, "This is a basic component with simple JSX structure"), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "content"
    }, /*#__PURE__*/ _react["default"].createElement("ul", null, /*#__PURE__*/ _react["default"].createElement("li", null, "Item 1"), /*#__PURE__*/ _react["default"].createElement("li", null, "Item 2"), /*#__PURE__*/ _react["default"].createElement("li", null, "Item 3"))));
}
var _default = exports["default"] = SimpleComponent;
