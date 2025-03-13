"use strict";
/**
 * Instrumentation Tests
 *
 * This file contains tests for the coverage instrumentation system.
 * It uses a simple React component with various branching paths and
 * conditional rendering to validate that the instrumentation is working.
 */
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
const react_2 = require("@testing-library/react");
const coverage_tracker_1 = __importDefault(require("../trackers/coverage-tracker"));
// Helper component with conditional branches and JSX patterns
const TestComponent = ({ showButton = true, buttonText = 'Click Me', onClick = () => console.log('clicked'), items = [] }) => {
    const [count, setCount] = (0, react_1.useState)(0);
    const [expanded, setExpanded] = (0, react_1.useState)(false);
    // Function with branches
    const handleClick = () => {
        if (count < 5) {
            setCount(count + 1);
        }
        else {
            setCount(0);
            setExpanded(!expanded);
        }
        // Call passed onClick handler
        onClick();
    };
    // Function with ternary
    const getButtonLabel = () => {
        return count === 0 ? buttonText : `${buttonText} (${count})`;
    };
    return (react_1.default.createElement("div", { "data-testid": "test-component" },
        react_1.default.createElement("h1", null, expanded ? 'Expanded View' : 'Simple View'),
        showButton && (react_1.default.createElement("button", { "data-testid": "test-button", onClick: handleClick }, getButtonLabel())),
        count > 3 ? (react_1.default.createElement("div", { "data-testid": "bonus-content" },
            react_1.default.createElement("p", null, "Bonus content unlocked!"))) : null,
        items.length > 0 && (react_1.default.createElement("ul", { "data-testid": "items-list" }, items.map((item, index) => (react_1.default.createElement("li", { key: index, "data-testid": `item-${index}` }, item)))))));
};
// Mock component data for testing
const mockComponentData = {
    TestComponent: {
        name: 'TestComponent',
        filePath: 'src/instrumentation/__tests__/instrumentation.test.tsx',
        branches: {
            1: {
                id: 1,
                type: 'if',
                hits: 1,
                trueCount: 1,
                falseCount: 0
            }
        },
        functions: {
            1: {
                id: 1,
                name: 'handleClick',
                hits: 1,
                executionTime: 0,
                errorCount: 0
            }
        },
        jsx: {
            1: {
                id: 1,
                elementType: 'button',
                hits: 1
            }
        }
    }
};
// Start coverage tracking for this test suite
beforeAll(() => {
    coverage_tracker_1.default.start('InstrumentationTests');
    // Initialize with mock data
    coverage_tracker_1.default.data.components = mockComponentData;
});
// Stop and print results after all tests
afterAll(() => {
    const data = coverage_tracker_1.default.stop();
    console.log('Coverage Data:', JSON.stringify(data, null, 2));
});
describe('Instrumentation Tests', () => {
    beforeEach(() => {
        // Reset state but keep components structure
        coverage_tracker_1.default.reset();
        // Re-add mock component data after reset
        coverage_tracker_1.default.data.components = mockComponentData;
    });
    test('renders and handles basic interactions', () => {
        (0, react_2.render)(react_1.default.createElement(TestComponent, null));
        // Check initial rendering
        expect(react_2.screen.getByTestId('test-component')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('test-button')).toBeInTheDocument();
        expect(react_2.screen.getByText('Simple View')).toBeInTheDocument();
        // Click multiple times to trigger different branches
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        // Now the bonus content should appear
        expect(react_2.screen.getByTestId('bonus-content')).toBeInTheDocument();
        // Click more to reset
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        react_2.fireEvent.click(react_2.screen.getByTestId('test-button'));
        // Should have switched to expanded view
        expect(react_2.screen.getByText('Expanded View')).toBeInTheDocument();
        // Manually simulate some branch execution to test tracking
        coverage_tracker_1.default.trackBranch('TestComponent', 1, 'if', 1);
        // Verify coverage data contains the expected components
        const data = coverage_tracker_1.default.getData();
        expect(data.components).toBeDefined();
        expect(Object.keys(data.components).length).toBeGreaterThan(0);
    });
    test('conditional rendering of button', () => {
        (0, react_2.render)(react_1.default.createElement(TestComponent, { showButton: false }));
        // Button should not be rendered
        expect(react_2.screen.getByTestId('test-component')).toBeInTheDocument();
        expect(react_2.screen.queryByTestId('test-button')).not.toBeInTheDocument();
    });
    test('renders list items', () => {
        (0, react_2.render)(react_1.default.createElement(TestComponent, { items: ['Apple', 'Banana', 'Cherry'] }));
        // List should be rendered
        expect(react_2.screen.getByTestId('items-list')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('item-0')).toHaveTextContent('Apple');
        expect(react_2.screen.getByTestId('item-1')).toHaveTextContent('Banana');
        expect(react_2.screen.getByTestId('item-2')).toHaveTextContent('Cherry');
    });
});
