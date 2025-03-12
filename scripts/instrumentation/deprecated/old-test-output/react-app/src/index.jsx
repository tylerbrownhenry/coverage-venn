"use strict";

var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _App = _interopRequireDefault(require("./App"));
function _interopRequireDefault(e) { return COVERAGE_TRACKER.trackBranch("Index", 2, "ternary", e && e.__esModule ? 0 : 1), e && e.__esModule ? e : { default: e }; }
COVERAGE_TRACKER.trackJSXRender("Index", 0, "unknown");
COVERAGE_TRACKER.trackJSXRender("Index", 1, "App");
/**
 * Main entry point for the React application
 */
_reactDom["default"].render(/*#__PURE__*/_react["default"].createElement(_react["default"].StrictMode, null, /*#__PURE__*/_react["default"].createElement(_App["default"], null)), document.getElementById('root'));