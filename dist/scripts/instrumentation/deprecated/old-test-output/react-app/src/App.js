"use strict";
function _typeof(o) {
    "@babel/helpers - typeof";
    return _typeof = (COVERAGE_TRACKER.trackBranch("App", 114, "ternary", "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? 0 : 1), "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }), _typeof(o);
}
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = void 0;
var _react = _interopRequireWildcard(require("react"));
var _SimpleComponent = _interopRequireDefault(require("./components/SimpleComponent"));
var _ConditionalComponent = _interopRequireDefault(require("./components/ConditionalComponent"));
var _NestedComponent = _interopRequireDefault(require("./components/NestedComponent"));
var _PropsComponent = _interopRequireDefault(require("./components/PropsComponent"));
var _DynamicComponent = _interopRequireDefault(require("./components/DynamicComponent"));
function _interopRequireDefault(e) { return COVERAGE_TRACKER.trackBranch("App", 113, "ternary", e && e.__esModule ? 0 : 1), e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { COVERAGE_TRACKER.trackBranch("App", 97, "if", "function" != typeof WeakMap ? 0 : 1); if ("function" != typeof WeakMap)
    return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return COVERAGE_TRACKER.trackBranch("App", 98, "ternary", e ? 0 : 1), e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { COVERAGE_TRACKER.trackBranch("App", 99, "if", !r && e && e.__esModule ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("App", 100, "logical", !r && e ? 0 : 1), !r && e && e.__esModule)
    return e; COVERAGE_TRACKER.trackBranch("App", 101, "if", null === e || "object" != _typeof(e) && "function" != typeof e ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("App", 102, "logical", null === e ? 1 : 0), null === e || "object" != typeof e && "function" != typeof e)
    return { "default": e }; var t = _getRequireWildcardCache(r); COVERAGE_TRACKER.trackBranch("App", 103, "if", t && t.has(e) ? 0 : 1); if (COVERAGE_TRACKER.trackBranch("App", 104, "logical", t ? 0 : 1), t && t.has(e))
    return t.get(e); var n = { __proto__: null }, a = (COVERAGE_TRACKER.trackBranch("App", 105, "logical", Object.defineProperty ? 0 : 1), Object.defineProperty && Object.getOwnPropertyDescriptor); for (var u in e) {
    COVERAGE_TRACKER.trackBranch("App", 106, "if", "default" !== u && {}.hasOwnProperty.call(e, u) ? 0 : 1);
    COVERAGE_TRACKER.trackBranch("App", 107, "if", "default" !== u && {}.hasOwnProperty.call(e, u) ? 0 : 1);
    if (COVERAGE_TRACKER.trackBranch("App", 108, "logical", "default" !== u ? 0 : 1), "default" !== u && {}.hasOwnProperty.call(e, u)) {
        var i = (COVERAGE_TRACKER.trackBranch("App", 109, "ternary", a ? 0 : 1), a ? Object.getOwnPropertyDescriptor(e, u) : null);
        COVERAGE_TRACKER.trackBranch("App", 110, "ternary", i && (i.get || i.set) ? 0 : 1);
        (COVERAGE_TRACKER.trackBranch("App", 111, "logical", i ? 0 : 1), i && (i.get || i.set)) ? Object.defineProperty(n, u, i) : n[u] = e[u];
    }
} return n["default"] = e, COVERAGE_TRACKER.trackBranch("App", 112, "logical", t ? 0 : 1), t && t.set(e, n), n; }
COVERAGE_TRACKER.trackJSXRender("App", 4, "SimpleComponent");
COVERAGE_TRACKER.trackJSXRender("App", 7, "ConditionalComponent");
COVERAGE_TRACKER.trackJSXRender("App", 10, "NestedComponent");
COVERAGE_TRACKER.trackJSXRender("App", 13, "PropsComponent");
COVERAGE_TRACKER.trackJSXRender("App", 14, "DynamicComponent");
COVERAGE_TRACKER.trackJSXRender("App", 15, "div");
COVERAGE_TRACKER.trackJSXRender("App", 16, "header");
COVERAGE_TRACKER.trackJSXRender("App", 17, "h1");
COVERAGE_TRACKER.trackJSXRender("App", 18, "button");
COVERAGE_TRACKER.trackBranch("App", 22, "logical", showComponents ? 0 : 1);
COVERAGE_TRACKER.trackJSXRender("App", 23, "main");
COVERAGE_TRACKER.trackJSXRender("App", 24, "nav");
COVERAGE_TRACKER.trackJSXRender("App", 25, "ul");
COVERAGE_TRACKER.trackJSXRender("App", 26, "li");
COVERAGE_TRACKER.trackJSXRender("App", 27, "button");
COVERAGE_TRACKER.trackJSXRender("App", 31, "li");
COVERAGE_TRACKER.trackJSXRender("App", 32, "button");
COVERAGE_TRACKER.trackJSXRender("App", 36, "li");
COVERAGE_TRACKER.trackJSXRender("App", 37, "button");
COVERAGE_TRACKER.trackJSXRender("App", 41, "li");
COVERAGE_TRACKER.trackJSXRender("App", 42, "button");
COVERAGE_TRACKER.trackJSXRender("App", 46, "li");
COVERAGE_TRACKER.trackJSXRender("App", 47, "button");
COVERAGE_TRACKER.trackJSXRender("App", 61, "div");
COVERAGE_TRACKER.trackJSXRender("App", 62, "div");
COVERAGE_TRACKER.trackJSXRender("App", 72, "footer");
COVERAGE_TRACKER.trackJSXRender("App", 73, "p");
function _slicedToArray(r, e) { return COVERAGE_TRACKER.trackBranch("App", 96, "logical", _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) ? 1 : 0), _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { COVERAGE_TRACKER.trackBranch("App", 92, "if", r ? 0 : 1); if (r) {
    COVERAGE_TRACKER.trackBranch("App", 93, "if", "string" == typeof r ? 0 : 1);
    if ("string" == typeof r)
        return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return COVERAGE_TRACKER.trackBranch("App", 94, "logical", "Object" === t && r.constructor ? 0 : 1), "Object" === t && r.constructor && (t = r.constructor.name), COVERAGE_TRACKER.trackBranch("App", 95, "ternary", "Map" === t || "Set" === t ? 0 : 1), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
} }
function _arrayLikeToArray(r, a) { COVERAGE_TRACKER.trackBranch("App", 90, "logical", null == a || a > r.length ? 0 : 1); (COVERAGE_TRACKER.trackBranch("App", 91, "logical", null == a ? 1 : 0), null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++)
    n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = (COVERAGE_TRACKER.trackBranch("App", 82, "ternary", null == r ? 0 : 1), null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]); COVERAGE_TRACKER.trackBranch("App", 83, "if", null != t ? 0 : 1); if (null != t) {
    var e, n, i, u, a = [], f = !0, o = !1;
    try {
        COVERAGE_TRACKER.trackBranch("App", 84, "if", (i = (t = t.call(r)).next, 0 === l) ? 0 : 1);
        if (i = (t = t.call(r)).next, 0 === l) {
            COVERAGE_TRACKER.trackBranch("App", 85, "if", Object(t) !== t ? 0 : 1);
            if (Object(t) !== t)
                return;
            f = !1;
        }
        else
            for (; COVERAGE_TRACKER.trackBranch("App", 86, "logical", !(f = (e = i.call(t)).done) ? 0 : 1), !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0)
                ;
    }
    catch (r) {
        o = !0, n = r;
    }
    finally {
        try {
            COVERAGE_TRACKER.trackBranch("App", 87, "if", !f && null != t["return"] && (u = t["return"](), Object(u) !== u) ? 0 : 1);
            if (COVERAGE_TRACKER.trackBranch("App", 88, "logical", !f && null != t.return ? 0 : 1), !f && null != t.return && (u = t.return(), Object(u) !== u))
                return;
        }
        finally {
            COVERAGE_TRACKER.trackBranch("App", 89, "if", o ? 0 : 1);
            if (o)
                throw n;
        }
    }
    return a;
} }
function _arrayWithHoles(r) { COVERAGE_TRACKER.trackBranch("App", 81, "if", Array.isArray(r) ? 0 : 1); if (Array.isArray(r))
    return r; }
/**
 * Main App component that demonstrates various JSX patterns
 * for testing our coverage instrumentation
 */
function App() {
    var _useState = (0, _react.useState)(true), _useState2 = _slicedToArray(_useState, 2), showComponents = _useState2[0], setShowComponents = _useState2[1];
    var _useState3 = (0, _react.useState)('simple'), _useState4 = _slicedToArray(_useState3, 2), selectedTab = _useState4[0], setSelectedTab = _useState4[1];
    // Conditional rendering using if statement
    var renderTabContent = function renderTabContent() {
        COVERAGE_TRACKER.trackBranch("App", 3, "if", selectedTab === 'simple' ? 0 : 1);
        if (selectedTab === 'simple') {
            return /*#__PURE__*/ _react["default"].createElement(_SimpleComponent["default"], null);
        }
        else {
            COVERAGE_TRACKER.trackBranch("App", 5, "if", selectedTab === 'conditional' ? 0 : 1);
            COVERAGE_TRACKER.trackBranch("App", 6, "if", selectedTab === 'conditional' ? 0 : 1);
            if (selectedTab === 'conditional') {
                return /*#__PURE__*/ _react["default"].createElement(_ConditionalComponent["default"], {
                    condition: true
                });
            }
            else {
                COVERAGE_TRACKER.trackBranch("App", 8, "if", selectedTab === 'nested' ? 0 : 1);
                COVERAGE_TRACKER.trackBranch("App", 9, "if", selectedTab === 'nested' ? 0 : 1);
                if (selectedTab === 'nested') {
                    return /*#__PURE__*/ _react["default"].createElement(_NestedComponent["default"], null);
                }
                else {
                    COVERAGE_TRACKER.trackBranch("App", 11, "if", selectedTab === 'props' ? 0 : 1);
                    COVERAGE_TRACKER.trackBranch("App", 12, "if", selectedTab === 'props' ? 0 : 1);
                    if (selectedTab === 'props') {
                        return /*#__PURE__*/ _react["default"].createElement(_PropsComponent["default"], {
                            title: "Test Title",
                            description: "Test Description",
                            items: ['item1', 'item2', 'item3']
                        });
                    }
                    else {
                        return /*#__PURE__*/ _react["default"].createElement(_DynamicComponent["default"], {
                            count: 3
                        });
                    }
                }
            }
        }
    };
    return /*#__PURE__*/ _react["default"].createElement("div", {
        className: "app"
    }, /*#__PURE__*/ _react["default"].createElement("header", null, /*#__PURE__*/ _react["default"].createElement("h1", null, "Coverage Test App"), /*#__PURE__*/ _react["default"].createElement("button", {
        onClick: function onClick() {
            return setShowComponents(!showComponents);
        }
    }, (COVERAGE_TRACKER.trackBranch("App", 19, "ternary", showComponents ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 20, "ternary", showComponents ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 21, "ternary", showComponents ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 74, "ternary", showComponents ? 0 : 1), showComponents ? 'Hide' : 'Show'), " Components")), showComponents && /*#__PURE__*/ _react["default"].createElement("main", null, /*#__PURE__*/ _react["default"].createElement("nav", null, /*#__PURE__*/ _react["default"].createElement("ul", null, /*#__PURE__*/ _react["default"].createElement("li", null, /*#__PURE__*/ _react["default"].createElement("button", {
        className: (COVERAGE_TRACKER.trackBranch("App", 28, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 29, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 30, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 51, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 56, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 66, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 75, "ternary", selectedTab === 'simple' ? 0 : 1), selectedTab === 'simple' ? 'active' : ''),
        onClick: function onClick() {
            return setSelectedTab('simple');
        }
    }, "Simple")), /*#__PURE__*/ _react["default"].createElement("li", null, /*#__PURE__*/ _react["default"].createElement("button", {
        className: (COVERAGE_TRACKER.trackBranch("App", 33, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 34, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 35, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 52, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 57, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 67, "ternary", selectedTab === 'conditional' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 76, "ternary", selectedTab === 'conditional' ? 0 : 1), selectedTab === 'conditional' ? 'active' : ''),
        onClick: function onClick() {
            return setSelectedTab('conditional');
        }
    }, "Conditional")), /*#__PURE__*/ _react["default"].createElement("li", null, /*#__PURE__*/ _react["default"].createElement("button", {
        className: (COVERAGE_TRACKER.trackBranch("App", 38, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 39, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 40, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 53, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 58, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 68, "ternary", selectedTab === 'nested' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 77, "ternary", selectedTab === 'nested' ? 0 : 1), selectedTab === 'nested' ? 'active' : ''),
        onClick: function onClick() {
            return setSelectedTab('nested');
        }
    }, "Nested")), /*#__PURE__*/ _react["default"].createElement("li", null, /*#__PURE__*/ _react["default"].createElement("button", {
        className: (COVERAGE_TRACKER.trackBranch("App", 43, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 44, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 45, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 54, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 59, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 69, "ternary", selectedTab === 'props' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 78, "ternary", selectedTab === 'props' ? 0 : 1), selectedTab === 'props' ? 'active' : ''),
        onClick: function onClick() {
            return setSelectedTab('props');
        }
    }, "Props")), /*#__PURE__*/ _react["default"].createElement("li", null, /*#__PURE__*/ _react["default"].createElement("button", {
        className: (COVERAGE_TRACKER.trackBranch("App", 48, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 49, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 50, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 55, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 60, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 70, "ternary", selectedTab === 'dynamic' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 79, "ternary", selectedTab === 'dynamic' ? 0 : 1), selectedTab === 'dynamic' ? 'active' : ''),
        onClick: function onClick() {
            return setSelectedTab('dynamic');
        }
    }, "Dynamic")))), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "content"
    }, renderTabContent(), /*#__PURE__*/ _react["default"].createElement("div", {
        className: "status"
    }, (COVERAGE_TRACKER.trackBranch("App", 63, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 64, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 65, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 71, "ternary", selectedTab === 'simple' ? 0 : 1), COVERAGE_TRACKER.trackBranch("App", 80, "ternary", selectedTab === 'simple' ? 0 : 1), selectedTab === 'simple' ? React.createElement("p", null, "Basic component with simple JSX") : React.createElement("p", null,
        "Advanced component with ",
        selectedTab,
        " rendering"))))), /*#__PURE__*/ _react["default"].createElement("footer", null, /*#__PURE__*/ _react["default"].createElement("p", null, "Coverage Instrumentation Test")));
}
var _default = exports["default"] = App;
