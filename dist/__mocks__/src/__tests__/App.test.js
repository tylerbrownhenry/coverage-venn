"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
require("@testing-library/jest-dom"); // Import directly here instead of from setup
const App_1 = __importDefault(require("../App"));
const utils_1 = require("../utils/utils");
// Mock dependencies
jest.mock('../components/button', () => ({
    Button: () => react_1.default.createElement("div", { "data-testid": "mocked-button" }, "Mocked Button")
}));
jest.mock('../utils/utils', () => ({
    getThis: jest.fn()
}));
// Mock additional components
jest.mock('../components/Form', () => ({
    Form: () => react_1.default.createElement("div", { "data-testid": "mocked-form" }, "Mocked Form")
}));
jest.mock('../components/Dashboard', () => ({
    Dashboard: () => react_1.default.createElement("div", { "data-testid": "mocked-dashboard" }, "Mocked Dashboard")
}));
// Mock string utils
jest.mock('../utils/stringUtils', () => ({
    formatString: jest.fn(text => text)
}));
// Mock data utils
jest.mock('../utils/dataUtils', () => ({
    processData: jest.fn(() => ({ success: true, data: [] }))
}));
describe('root_app', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should render with the correct title', () => {
        // Setup mock to return a specific value
        utils_1.getThis.mockReturnValue('Mocked Title');
        (0, react_2.render)(react_1.default.createElement(App_1.default, null));
        // Check the title is rendered
        expect(react_2.screen.getByText('Mocked Title')).toBeInTheDocument();
        // Verify getThis was called with the right argument
        expect(utils_1.getThis).toHaveBeenCalledWith('Interactive Dashboard');
    });
    it('should render the button component', () => {
        utils_1.getThis.mockReturnValue('Any Title');
        (0, react_2.render)(react_1.default.createElement(App_1.default, null));
        // Check the button is rendered (mocked version)
        expect(react_2.screen.getByTestId('mocked-button')).toBeInTheDocument();
    });
    it('should have the correct test ID', () => {
        utils_1.getThis.mockReturnValue('Any Title');
        (0, react_2.render)(react_1.default.createElement(App_1.default, null));
        // Check the root element has the correct test ID
        expect(react_2.screen.getByTestId('root_app')).toBeInTheDocument();
    });
});
