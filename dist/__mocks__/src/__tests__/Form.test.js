"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_2 = require("@testing-library/react");
require("@testing-library/jest-dom");
const Form_1 = require("../components/Form");
describe('Form Component', () => {
    // Test basic rendering
    it('renders the form correctly', () => {
        (0, react_2.render)(react_1.default.createElement(Form_1.Form, null));
        // Check that all expected elements are rendered
        expect(react_2.screen.getByTestId('form_container')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_name_input')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_email_input')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_message_input')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_preview_button')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_submit_button')).toBeInTheDocument();
    });
    // Test input change handling
    it('updates input values when typing', () => {
        (0, react_2.render)(react_1.default.createElement(Form_1.Form, null));
        // Find input elements
        const nameInput = react_2.screen.getByTestId('form_name_input');
        const emailInput = react_2.screen.getByTestId('form_email_input');
        const messageInput = react_2.screen.getByTestId('form_message_input');
        // Simulate typing in the inputs
        react_2.fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        react_2.fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        react_2.fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
        // Check that the input values have been updated
        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john@example.com');
        expect(messageInput).toHaveValue('This is a test message');
    });
    // Test conditional rendering (name field can be hidden)
    it('hides the name field when showNameField is false', () => {
        (0, react_2.render)(react_1.default.createElement(Form_1.Form, { showNameField: false }));
        // Check that the name field is not rendered
        expect(react_2.screen.queryByTestId('form_name_input')).not.toBeInTheDocument();
        // But other fields are still rendered
        expect(react_2.screen.getByTestId('form_email_input')).toBeInTheDocument();
        expect(react_2.screen.getByTestId('form_message_input')).toBeInTheDocument();
    });
    // Test form submission (this deliberately skips validation for partial coverage)
    it('calls onSubmit when the form is submitted with valid data', () => {
        const handleSubmit = jest.fn();
        (0, react_2.render)(react_1.default.createElement(Form_1.Form, { onSubmit: handleSubmit, initialValues: {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'This is a test message with sufficient length'
            } }));
        // Submit the form
        const submitButton = react_2.screen.getByTestId('form_submit_button');
        react_2.fireEvent.click(submitButton);
        // Check that onSubmit was called
        expect(handleSubmit).toHaveBeenCalled();
    });
    // NOTE: We deliberately skip testing these features to demonstrate partial coverage:
    // - Form validation
    // - Preview mode
    // - Form submission with invalid data
    // - Theme variations
    // - Disabled state
});
