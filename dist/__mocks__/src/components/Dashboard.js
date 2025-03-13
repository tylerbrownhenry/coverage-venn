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
exports.Dashboard = void 0;
const react_1 = __importStar(require("react"));
const Form_1 = require("./Form");
const dataUtils_1 = require("../utils/dataUtils");
const stringUtils_1 = require("../utils/stringUtils");
const utils_1 = require("../utils/utils");
const Dashboard = ({ title = 'Data Dashboard', initialData = [], showForm = true, darkMode = false, loading = false, error = '' }) => {
    // State management
    const [data, setData] = (0, react_1.useState)(initialData);
    const [filteredData, setFilteredData] = (0, react_1.useState)(initialData);
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [sortOrder, setSortOrder] = (0, react_1.useState)(null);
    const [activeTab, setActiveTab] = (0, react_1.useState)('all');
    const [favorites, setFavorites] = (0, react_1.useState)([]);
    const [stats, setStats] = (0, react_1.useState)({
        total: initialData.length,
        validItems: 0,
        avgValue: 0
    });
    // Format title using the utility function
    const formattedTitle = (0, stringUtils_1.formatString)((0, utils_1.getThis)(title));
    // Process data whenever it changes
    (0, react_1.useEffect)(() => {
        if (data.length === 0)
            return;
        // Process the data with different options based on current state
        const processOptions = {
            validate: true,
            transform: true,
            sort: sortOrder,
            limit: activeTab === 'recent' ? 5 : 0,
            filterInvalid: activeTab !== 'all'
        };
        const result = (0, dataUtils_1.processData)(data, processOptions);
        if (result.success && result.data) {
            let processed = result.data;
            // Additional filtering for favorites tab
            if (activeTab === 'favorites') {
                processed = processed.filter(item => favorites.includes(String(item.id)));
            }
            // Apply search filter if specified
            if (searchTerm) {
                processed = processed.filter(item => String(item.value).toLowerCase().includes(searchTerm.toLowerCase()));
            }
            setFilteredData(processed);
            // Update stats
            if (result.stats) {
                setStats({
                    total: result.stats.total,
                    validItems: result.stats.valid,
                    avgValue: calculateAverage(processed)
                });
            }
        }
    }, [data, searchTerm, sortOrder, activeTab, favorites]);
    // Calculate average value (only for numeric values)
    const calculateAverage = (items) => {
        const numericItems = items.filter(item => typeof item.value === 'number');
        if (numericItems.length === 0)
            return 0;
        const sum = numericItems.reduce((acc, item) => acc + item.value, 0);
        return sum / numericItems.length;
    };
    // Handle form submission to add new data
    const handleFormSubmit = (values) => {
        // Convert form values to data items
        const newItem = {
            id: `item-${Date.now()}`,
            value: values.message,
            timestamp: new Date(),
            metadata: {
                author: values.name || 'Anonymous',
                email: values.email
            }
        };
        setData(prevData => [...prevData, newItem]);
    };
    // Toggle favorite status for an item
    const toggleFavorite = (id) => {
        const idStr = String(id);
        setFavorites(prev => {
            if (prev.includes(idStr)) {
                return prev.filter(item => item !== idStr);
            }
            else {
                return [...prev, idStr];
            }
        });
    };
    // Handle sort toggle
    const toggleSort = () => {
        if (sortOrder === null) {
            setSortOrder('asc');
        }
        else if (sortOrder === 'asc') {
            setSortOrder('desc');
        }
        else {
            setSortOrder(null);
        }
    };
    // Render loading state
    if (loading) {
        return (react_1.default.createElement("div", { "data-testid": "dashboard_loading", className: "dashboard loading" },
            react_1.default.createElement("h2", null, formattedTitle),
            react_1.default.createElement("div", { className: "loading-spinner" }, "Loading...")));
    }
    // Render error state
    if (error) {
        return (react_1.default.createElement("div", { "data-testid": "dashboard_error", className: "dashboard error" },
            react_1.default.createElement("h2", null, "Error"),
            react_1.default.createElement("div", { className: "error-message" }, error),
            react_1.default.createElement("button", { onClick: () => setData([]) }, "Clear Data")));
    }
    // Get the theme based on darkMode prop
    const theme = darkMode ? 'dark' : 'light';
    return (react_1.default.createElement("div", { "data-testid": "dashboard_container", className: `dashboard ${theme}` },
        react_1.default.createElement("h2", null, formattedTitle),
        react_1.default.createElement("div", { className: "dashboard-stats" },
            react_1.default.createElement("div", { className: "stat-item" },
                react_1.default.createElement("span", { className: "stat-label" }, "Total Items:"),
                react_1.default.createElement("span", { className: "stat-value" }, stats.total)),
            react_1.default.createElement("div", { className: "stat-item" },
                react_1.default.createElement("span", { className: "stat-label" }, "Valid Items:"),
                react_1.default.createElement("span", { className: "stat-value" }, stats.validItems)),
            stats.avgValue > 0 && (react_1.default.createElement("div", { className: "stat-item" },
                react_1.default.createElement("span", { className: "stat-label" }, "Average Value:"),
                react_1.default.createElement("span", { className: "stat-value" }, stats.avgValue.toFixed(2))))),
        react_1.default.createElement("div", { className: "dashboard-tabs" },
            react_1.default.createElement("button", { className: activeTab === 'all' ? 'active' : '', onClick: () => setActiveTab('all'), "data-testid": "dashboard_tab_all" }, "All Items"),
            react_1.default.createElement("button", { className: activeTab === 'recent' ? 'active' : '', onClick: () => setActiveTab('recent'), "data-testid": "dashboard_tab_recent" }, "Recent"),
            react_1.default.createElement("button", { className: activeTab === 'favorites' ? 'active' : '', onClick: () => setActiveTab('favorites'), "data-testid": "dashboard_tab_favorites" },
                "Favorites (",
                favorites.length,
                ")")),
        react_1.default.createElement("div", { className: "dashboard-controls" },
            react_1.default.createElement("input", { type: "text", placeholder: "Search items...", value: searchTerm, onChange: e => setSearchTerm(e.target.value), "data-testid": "dashboard_search" }),
            react_1.default.createElement("button", { onClick: toggleSort, "data-testid": "dashboard_sort" },
                "Sort ",
                sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '⇅')),
        react_1.default.createElement("div", { className: "dashboard-data" }, filteredData.length === 0 ? (react_1.default.createElement("div", { className: "empty-state", "data-testid": "dashboard_empty" }, activeTab === 'favorites'
            ? 'No favorite items yet.'
            : searchTerm
                ? 'No matching items found.'
                : 'No data available.')) : (react_1.default.createElement("ul", { className: "data-list", "data-testid": "dashboard_list" }, filteredData.map(item => (react_1.default.createElement("li", { key: String(item.id), className: favorites.includes(String(item.id)) ? 'favorite' : '', "data-testid": `dashboard_item_${item.id}` },
            react_1.default.createElement("div", { className: "item-content" },
                react_1.default.createElement("div", { className: "item-value" }, typeof item.value === 'string'
                    ? item.value
                    : JSON.stringify(item.value)),
                item.timestamp && (react_1.default.createElement("div", { className: "item-timestamp" }, new Date(item.timestamp).toLocaleString()))),
            react_1.default.createElement("div", { className: "item-actions" },
                react_1.default.createElement("button", { onClick: () => toggleFavorite(item.id), "data-testid": `dashboard_fav_${item.id}` }, favorites.includes(String(item.id)) ? '★' : '☆')))))))),
        showForm && (react_1.default.createElement("div", { className: "dashboard-form" },
            react_1.default.createElement("h3", null, "Add New Item"),
            react_1.default.createElement(Form_1.Form, { theme: theme, onSubmit: handleFormSubmit })))));
};
exports.Dashboard = Dashboard;
