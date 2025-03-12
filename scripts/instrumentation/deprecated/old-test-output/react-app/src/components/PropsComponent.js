"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(e) { return COVERAGE_TRACKER.trackBranch("PropsComponent", 154, "ternary", e && e.__esModule ? 0 : 1), e && e.__esModule ? e : { default: e }; }
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 130, "li");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 132, "span");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 133, "button");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 136, "div");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 137, "div");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 140, "footer");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 141, "p");
COVERAGE_TRACKER.trackJSXRender("PropsComponent", 142, "button");
/**
 * Component that demonstrates various prop patterns
 * Used to test instrumentation of JSX with props
 */
function PropsComponent(_ref) {
  var _ref$title = _ref.title,
    title = (COVERAGE_TRACKER.trackBranch("PropsComponent", 124, "ternary", _ref$title === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 144, "ternary", _ref$title === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 149, "ternary", _ref$title === void 0 ? 0 : 1), _ref$title === void 0 ? 'Default Title' : _ref$title),
    description = _ref.description,
    _ref$items = _ref.items,
    items = (COVERAGE_TRACKER.trackBranch("PropsComponent", 125, "ternary", _ref$items === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 145, "ternary", _ref$items === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 150, "ternary", _ref$items === void 0 ? 0 : 1), _ref$items === void 0 ? [] : _ref$items),
    _ref$showHeader = _ref.showHeader,
    showHeader = (COVERAGE_TRACKER.trackBranch("PropsComponent", 126, "ternary", _ref$showHeader === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 146, "ternary", _ref$showHeader === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 151, "ternary", _ref$showHeader === void 0 ? 0 : 1), _ref$showHeader === void 0 ? true : _ref$showHeader),
    _ref$onAction = _ref.onAction,
    onAction = (COVERAGE_TRACKER.trackBranch("PropsComponent", 127, "ternary", _ref$onAction === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 147, "ternary", _ref$onAction === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 152, "ternary", _ref$onAction === void 0 ? 0 : 1), _ref$onAction === void 0 ? () => {} : _ref$onAction),
    _ref$theme = _ref.theme,
    theme = (COVERAGE_TRACKER.trackBranch("PropsComponent", 128, "ternary", _ref$theme === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 148, "ternary", _ref$theme === void 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 153, "ternary", _ref$theme === void 0 ? 0 : 1), _ref$theme === void 0 ? 'light' : _ref$theme);
  // Using props in conditional rendering
  var headerElement = (COVERAGE_TRACKER.trackBranch("PropsComponent", 129, "ternary", showHeader ? 0 : 1), showHeader ? <header className={`header ${theme}`}>
      <h2>{title}</h2>
      {description && <p className="description">{description}</p>}
    </header> : null);

  // Using props to generate dynamic content
  var itemElements = items.map(function (item, index) {
    return /*#__PURE__*/_react["default"].createElement("li", {
      key: index,
      className: (COVERAGE_TRACKER.trackBranch("PropsComponent", 131, "ternary", index % 2 === 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 134, "ternary", index % 2 === 0 ? 0 : 1), index % 2 === 0 ? 'even' : 'odd')
    }, /*#__PURE__*/_react["default"].createElement("span", null, item), /*#__PURE__*/_react["default"].createElement("button", {
      onClick: function onClick() {
        return onAction(item);
      }
    }, "Action"));
  });

  // Conditional class assignment based on props
  var containerClasses = ['props-component', "theme-".concat(theme), (COVERAGE_TRACKER.trackBranch("PropsComponent", 135, "ternary", items.length > 0 ? 0 : 1), items.length > 0 ? 'has-items' : 'no-items')].join(' ');
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: containerClasses,
    "data-test-id": "props-component"
  }, headerElement, /*#__PURE__*/_react["default"].createElement("div", {
    className: "component-body"
  }, (COVERAGE_TRACKER.trackBranch("PropsComponent", 138, "ternary", items.length > 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 139, "ternary", items.length > 0 ? 0 : 1), COVERAGE_TRACKER.trackBranch("PropsComponent", 143, "ternary", items.length > 0 ? 0 : 1), items.length > 0 ? <ul className="items-list">
            {itemElements}
          </ul> : <p className="empty-message">No items available</p>)), /*#__PURE__*/_react["default"].createElement("footer", null, /*#__PURE__*/_react["default"].createElement("p", null, "Total items: ", items.length), /*#__PURE__*/_react["default"].createElement("button", {
    className: "action-button",
    onClick: function onClick() {
      return onAction('footer-action');
    },
    disabled: items.length === 0
  }, "Perform Action")));
}
var _default = exports["default"] = PropsComponent;