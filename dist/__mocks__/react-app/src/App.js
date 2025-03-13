"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const SimpleComponent_1 = __importDefault(require("./components/SimpleComponent"));
const ConditionalComponent_1 = __importDefault(require("./components/ConditionalComponent"));
const NestedComponent_1 = __importDefault(require("./components/NestedComponent"));
const PropsComponent_1 = __importDefault(require("./components/PropsComponent"));
const DynamicComponent_1 = __importDefault(require("./components/DynamicComponent"));
/**
 * Main App component that demonstrates various JSX patterns
 * for testing our coverage instrumentation
 */
function App() {
    const [showComponents, setShowComponents] = (0, react_1.useState)(true);
    const [selectedTab, setSelectedTab] = (0, react_1.useState)('simple');
    // Conditional rendering using if statement
    const renderTabContent = () => {
        if (selectedTab === 'simple') {
            return react_1.default.createElement(SimpleComponent_1.default, null);
        }
        else if (selectedTab === 'conditional') {
            return react_1.default.createElement(ConditionalComponent_1.default, { condition: true });
        }
        else if (selectedTab === 'nested') {
            return react_1.default.createElement(NestedComponent_1.default, null);
        }
        else if (selectedTab === 'props') {
            return react_1.default.createElement(PropsComponent_1.default, { title: "Test Title", description: "Test Description", items: ['item1', 'item2', 'item3'] });
        }
        else {
            return react_1.default.createElement(DynamicComponent_1.default, { count: 3 });
        }
    };
    return (react_1.default.createElement("div", { className: "app" },
        react_1.default.createElement("header", null,
            react_1.default.createElement("h1", null, "Coverage Test App"),
            react_1.default.createElement("button", { onClick: () => setShowComponents(!showComponents) },
                showComponents ? 'Hide' : 'Show',
                " Components")),
        showComponents && (react_1.default.createElement("main", null,
            react_1.default.createElement("nav", null,
                react_1.default.createElement("ul", null,
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { className: selectedTab === 'simple' ? 'active' : '', onClick: () => setSelectedTab('simple') }, "Simple")),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { className: selectedTab === 'conditional' ? 'active' : '', onClick: () => setSelectedTab('conditional') }, "Conditional")),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { className: selectedTab === 'nested' ? 'active' : '', onClick: () => setSelectedTab('nested') }, "Nested")),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { className: selectedTab === 'props' ? 'active' : '', onClick: () => setSelectedTab('props') }, "Props")),
                    react_1.default.createElement("li", null,
                        react_1.default.createElement("button", { className: selectedTab === 'dynamic' ? 'active' : '', onClick: () => setSelectedTab('dynamic') }, "Dynamic")))),
            react_1.default.createElement("div", { className: "content" },
                renderTabContent(),
                react_1.default.createElement("div", { className: "status" }, selectedTab === 'simple'
                    ? react_1.default.createElement("p", null, "Basic component with simple JSX")
                    : react_1.default.createElement("p", null,
                        "Advanced component with ",
                        selectedTab,
                        " rendering"))))),
        react_1.default.createElement("footer", null,
            react_1.default.createElement("p", null, "Coverage Instrumentation Test"))));
}
exports.default = App;
