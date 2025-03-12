"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 311, "ternary", "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? 0 : 1), "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }), _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 295, "if", "function" != typeof WeakMap ? 0 : 1); if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return COVERAGE_TRACKER.trackBranch("ConditionalComponent", 296, "ternary", e ? 0 : 1), e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 297, "if", !r && e && e.__esModule ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 298, "logical", !r && e ? 0 : 1), !r && e && e.__esModule) return e; COVERAGE_TRACKER.trackBranch("ConditionalComponent", 299, "if", null === e || "object" != _typeof(e) && "function" != typeof e ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 300, "logical", null === e ? 1 : 0), null === e || "object" != typeof e && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); COVERAGE_TRACKER.trackBranch("ConditionalComponent", 301, "if", t && t.has(e) ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 302, "logical", t ? 0 : 1), t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 303, "logical", Object.defineProperty ? 0 : 1), Object.defineProperty && Object.getOwnPropertyDescriptor); for (var u in e) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 304, "if", "default" !== u && {}.hasOwnProperty.call(e, u) ? 0 : 1); COVERAGE_TRACKER.trackBranch("ConditionalComponent", 305, "if", "default" !== u && {}.hasOwnProperty.call(e, u) ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 306, "logical", "default" !== u ? 0 : 1), "default" !== u && {}.hasOwnProperty.call(e, u)) { var i = (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 307, "ternary", a ? 0 : 1), a ? Object.getOwnPropertyDescriptor(e, u) : null); COVERAGE_TRACKER.trackBranch("ConditionalComponent", 308, "ternary", i && (i.get || i.set) ? 0 : 1); (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 309, "logical", i ? 0 : 1), i && (i.get || i.set)) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } } return n["default"] = e, COVERAGE_TRACKER.trackBranch("ConditionalComponent", 310, "logical", t ? 0 : 1), t && t.set(e, n), n; }
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 253, "div");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 254, "h2");
COVERAGE_TRACKER.trackBranch("ConditionalComponent", 255, "logical", condition ? 0 : 1);
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 256, "div");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 257, "p");
COVERAGE_TRACKER.trackBranch("ConditionalComponent", 258, "logical", !condition ? 0 : 1);
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 259, "div");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 260, "p");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 261, "div");
COVERAGE_TRACKER.trackBranch("ConditionalComponent", 264, "logical", showDetails ? 0 : 1);
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 265, "div");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 266, "h3");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 267, "p");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 268, "div");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 269, "p");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 270, "button");
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 271, "button");
COVERAGE_TRACKER.trackBranch("ConditionalComponent", 273, "logical", count > 5 || count < -5 ? 0 : 1);
COVERAGE_TRACKER.trackBranch("ConditionalComponent", 274, "logical", count > 5 ? 1 : 0);
COVERAGE_TRACKER.trackJSXRender("ConditionalComponent", 275, "p");
function _slicedToArray(r, e) { return COVERAGE_TRACKER.trackBranch("ConditionalComponent", 294, "logical", _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) ? 1 : 0), _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 290, "if", r ? 0 : 1); if (r) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 291, "if", "string" == typeof r ? 0 : 1); if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return COVERAGE_TRACKER.trackBranch("ConditionalComponent", 292, "logical", "Object" === t && r.constructor ? 0 : 1), "Object" === t && r.constructor && (t = r.constructor.name), COVERAGE_TRACKER.trackBranch("ConditionalComponent", 293, "ternary", "Map" === t || "Set" === t ? 0 : 1), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 288, "logical", null == a || a > r.length ? 0 : 1); (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 289, "logical", null == a ? 1 : 0), null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 280, "ternary", null == r ? 0 : 1), null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]); COVERAGE_TRACKER.trackBranch("ConditionalComponent", 281, "if", null != t ? 0 : 1); if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 282, "if", (i = (t = t.call(r)).next, 0 === l) ? 0 : 1); if (i = (t = t.call(r)).next, 0 === l) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 283, "if", Object(t) !== t ? 0 : 1); if (Object(t) !== t) return; f = !1; } else for (; COVERAGE_TRACKER.trackBranch("ConditionalComponent", 284, "logical", !(f = (e = i.call(t)).done) ? 0 : 1), !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 285, "if", !f && null != t["return"] && (u = t["return"](), Object(u) !== u) ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 286, "logical", !f && null != t.return ? 0 : 1), !f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 287, "if", o ? 0 : 1); if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { COVERAGE_TRACKER.trackBranch("ConditionalComponent", 279, "if", Array.isArray(r) ? 0 : 1); if (Array.isArray(r)) return r; }
/**
 * Component that demonstrates different conditional rendering patterns
 * Used to test instrumentation of conditional JSX rendering
 */
function ConditionalComponent(_ref) {
  var condition = _ref.condition;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    showDetails = _useState2[0],
    setShowDetails = _useState2[1];
  var _useState3 = (0, _react.useState)(0),
    _useState4 = _slicedToArray(_useState3, 2),
    count = _useState4[0],
    setCount = _useState4[1];
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "conditional-component"
  }, /*#__PURE__*/_react["default"].createElement("h2", null, "Conditional Component"), condition && /*#__PURE__*/_react["default"].createElement("div", {
    className: "condition-true"
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Condition is TRUE")), !condition && /*#__PURE__*/_react["default"].createElement("div", {
    className: "condition-false"
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Condition is FALSE")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "ternary-example"
  }, (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 262, "ternary", condition ? 0 : 1), COVERAGE_TRACKER.trackBranch("ConditionalComponent", 263, "ternary", condition ? 0 : 1), COVERAGE_TRACKER.trackBranch("ConditionalComponent", 277, "ternary", condition ? 0 : 1), condition ? <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </button> : <p>Conditional rendering disabled</p>)), showDetails && /*#__PURE__*/_react["default"].createElement("div", {
    className: "details"
  }, /*#__PURE__*/_react["default"].createElement("h3", null, "Additional Details"), /*#__PURE__*/_react["default"].createElement("p", null, "These details are conditionally shown based on user interaction.")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "counter"
  }, /*#__PURE__*/_react["default"].createElement("p", null, "Count: ", count), /*#__PURE__*/_react["default"].createElement("button", {
    onClick: function onClick() {
      return setCount(count + 1);
    }
  }, "Increment"), /*#__PURE__*/_react["default"].createElement("button", {
    onClick: function onClick() {
      return setCount(count - 1);
    }
  }, "Decrement"), (COVERAGE_TRACKER.trackBranch("ConditionalComponent", 272, "ternary", count > 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("ConditionalComponent", 276, "ternary", count > 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("ConditionalComponent", 278, "ternary", count > 0 ? 0 : 1), count > 0 ? <p className="positive">Count is positive</p> : count < 0 ? <p className="negative">Count is negative</p> : <p className="zero">Count is zero</p>), (count > 5 || count < -5) && /*#__PURE__*/_react["default"].createElement("p", {
    className: "extreme"
  }, "Count has reached an extreme value!")));
}
var _default = exports["default"] = ConditionalComponent;