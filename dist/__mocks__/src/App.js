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
const button_1 = require("./components/button");
const Form_1 = require("./components/Form");
const Dashboard_1 = require("./components/Dashboard");
const utils_1 = require("./utils/utils");
const stringUtils_1 = require("./utils/stringUtils");
const dataUtils_1 = require("./utils/dataUtils");
// Sample initial data
const sampleData = [
    { id: '1', value: 'First item', timestamp: new Date('2023-01-01') },
    { id: '2', value: 42, timestamp: new Date('2023-01-02') },
    { id: '3', value: { complex: true, nested: 'object' }, timestamp: new Date('2023-01-03') }
];
const App = () => {
    // State management
    const [title, setTitle] = (0, react_1.useState)((0, utils_1.getThis)('Interactive Dashboard'));
    const [showDashboard, setShowDashboard] = (0, react_1.useState)(true);
    const [showForm, setShowForm] = (0, react_1.useState)(false);
    const [darkMode, setDarkMode] = (0, react_1.useState)(false);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)('');
    const [currentData, setCurrentData] = (0, react_1.useState)([]);
    // Simulate loading data
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(() => {
            try {
                // Process the sample data
                const result = (0, dataUtils_1.processData)(sampleData, {
                    validate: true,
                    transform: true
                });
                if (result.success && result.data) {
                    setCurrentData(result.data);
                }
                else if (result.error) {
                    setError(result.error);
                }
                setLoading(false);
            }
            catch (error) {
                setError(error.message || 'Failed to load data');
                setLoading(false);
            }
        }, 1000); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);
    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };
    // Toggle dashboard visibility
    const toggleDashboard = () => {
        setShowDashboard(prev => !prev);
    };
    // Toggle form visibility
    const toggleForm = () => {
        setShowForm(prev => !prev);
    };
    // Handle button click with conditional error generation
    const handleButtonClick = () => {
        // Randomly decide whether to cause an error (1 in 3 chance)
        const shouldError = Math.random() < 0.3;
        if (shouldError) {
            setError('Random error occurred during button click');
        }
        else {
            // Create a new data item
            const newItem = {
                id: `gen-${Date.now()}`,
                value: `Generated at ${new Date().toLocaleTimeString()}`,
                timestamp: new Date()
            };
            setCurrentData(prev => [...prev, newItem]);
            setTitle((0, stringUtils_1.formatString)((0, utils_1.getThis)('Updated Dashboard')));
        }
    };
    // Clear error
    const clearError = () => {
        setError('');
    };
    return (react_1.default.createElement("div", { "data-testid": "root_app", className: `app-container ${darkMode ? 'dark-mode' : 'light-mode'}` },
        react_1.default.createElement("header", { className: "app-header" },
            react_1.default.createElement("h1", null, title),
            react_1.default.createElement("div", { className: "app-controls" },
                react_1.default.createElement("button", { "data-testid": "toggle_theme_button", onClick: toggleDarkMode, className: "theme-toggle" }, darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'),
                react_1.default.createElement("button", { "data-testid": "toggle_dashboard_button", onClick: toggleDashboard }, showDashboard ? 'Hide Dashboard' : 'Show Dashboard'),
                react_1.default.createElement("button", { "data-testid": "toggle_form_button", onClick: toggleForm }, showForm ? 'Hide Form' : 'Show Form'))),
        react_1.default.createElement("main", { className: "app-content" },
            error && (react_1.default.createElement("div", { className: "error-banner", "data-testid": "error_message" },
                react_1.default.createElement("p", null, error),
                react_1.default.createElement("button", { onClick: clearError }, "Dismiss"))),
            react_1.default.createElement("div", { className: "legacy-component" },
                react_1.default.createElement("h2", null, "Legacy Component"),
                react_1.default.createElement(button_1.Button, null),
                react_1.default.createElement("button", { "data-testid": "action_button", onClick: handleButtonClick, className: "action-button" }, "Generate Random Data")),
            showForm && !showDashboard && (react_1.default.createElement("div", { className: "standalone-form" },
                react_1.default.createElement("h2", null, "Contact Form"),
                react_1.default.createElement(Form_1.Form, { theme: darkMode ? 'dark' : 'light', initialValues: {
                        name: 'Guest User',
                        email: '',
                        message: 'Please enter your message here...'
                    } }))),
            showDashboard && (react_1.default.createElement(Dashboard_1.Dashboard, { title: title, initialData: currentData, showForm: showForm, darkMode: darkMode, loading: loading, error: error }))),
        react_1.default.createElement("footer", { className: "app-footer" },
            react_1.default.createElement("p", null, "Mock App for Coverage Testing"))));
};
exports.default = App;
