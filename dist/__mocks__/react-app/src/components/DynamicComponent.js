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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
/**
 * Component that demonstrates dynamically generated JSX elements
 * Used to test instrumentation of dynamic content
 */
function DynamicComponent({ count = 0 }) {
    const [items, setItems] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Simulate data loading
    (0, react_1.useEffect)(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            try {
                // Generate items based on count
                const newItems = Array.from({ length: count }, (_, index) => ({
                    id: `item-${index}`,
                    name: `Dynamic Item ${index + 1}`,
                    value: Math.floor(Math.random() * 100)
                }));
                setItems(newItems);
                setLoading(false);
            }
            catch (err) {
                setError('Failed to load items');
                setLoading(false);
            }
        }, 1000);
    }, [count]);
    // Determine which type of item to render based on value
    const renderItem = (item) => {
        if (item.value > 75) {
            return (react_1.default.createElement("div", { key: item.id, className: "item high-value" },
                react_1.default.createElement("h3", null, item.name),
                react_1.default.createElement("span", { className: "badge" },
                    "High Value: ",
                    item.value)));
        }
        else if (item.value > 25) {
            return (react_1.default.createElement("div", { key: item.id, className: "item medium-value" },
                react_1.default.createElement("h3", null, item.name),
                react_1.default.createElement("span", { className: "badge" },
                    "Medium Value: ",
                    item.value)));
        }
        else {
            return (react_1.default.createElement("div", { key: item.id, className: "item low-value" },
                react_1.default.createElement("h3", null, item.name),
                react_1.default.createElement("span", { className: "badge" },
                    "Low Value: ",
                    item.value)));
        }
    };
    // Handle different states with different JSX structures
    let content;
    if (loading) {
        content = (react_1.default.createElement("div", { className: "loading-state" },
            react_1.default.createElement("p", null, "Loading items..."),
            react_1.default.createElement("div", { className: "spinner" })));
    }
    else if (error) {
        content = (react_1.default.createElement("div", { className: "error-state" },
            react_1.default.createElement("p", { className: "error-message" }, error),
            react_1.default.createElement("button", { onClick: () => window.location.reload() }, "Retry")));
    }
    else if (items.length === 0) {
        content = (react_1.default.createElement("div", { className: "empty-state" },
            react_1.default.createElement("p", null, "No items to display"),
            react_1.default.createElement("button", { onClick: () => setItems([{ id: 'default', name: 'Default Item', value: 50 }]) }, "Add Default Item")));
    }
    else {
        content = (react_1.default.createElement("div", { className: "items-container" }, items.map(item => renderItem(item))));
    }
    return (react_1.default.createElement("div", { className: "dynamic-component" },
        react_1.default.createElement("h2", null, "Dynamic Component"),
        react_1.default.createElement("p", null,
            "Displaying ",
            count,
            " dynamically generated items"),
        content,
        react_1.default.createElement("div", { className: "controls" },
            react_1.default.createElement("button", { onClick: () => setLoading(true), disabled: loading }, "Reload"))));
}
exports.default = DynamicComponent;
