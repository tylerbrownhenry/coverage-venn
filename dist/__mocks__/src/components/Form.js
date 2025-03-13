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
exports.Form = void 0;
const react_1 = __importStar(require("react"));
const stringUtils_1 = require("../utils/stringUtils");
const Form = ({ initialValues = {}, onSubmit, theme = 'light', showNameField = true, disabled = false }) => {
    // State management
    const [values, setValues] = (0, react_1.useState)({
        name: initialValues.name || '',
        email: initialValues.email || '',
        message: initialValues.message || ''
    });
    const [errors, setErrors] = (0, react_1.useState)({});
    const [submitted, setSubmitted] = (0, react_1.useState)(false);
    const [formMode, setFormMode] = (0, react_1.useState)('edit');
    // Effect to validate form when values change
    (0, react_1.useEffect)(() => {
        if (submitted) {
            validateForm();
        }
    }, [values, submitted]);
    // Form validation
    const validateForm = () => {
        const newErrors = {};
        let isValid = true;
        // Conditional validation based on showNameField
        if (showNameField) {
            const nameValidation = (0, stringUtils_1.validateString)(values.name);
            if (!nameValidation.isValid) {
                newErrors.name = 'Name is required and must be at least 3 characters';
                isValid = false;
            }
        }
        // Email validation
        if (!values.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(values.email)) {
            newErrors.email = 'Email format is invalid';
            isValid = false;
        }
        // Message validation
        if (!values.message) {
            newErrors.message = 'Message is required';
            isValid = false;
        }
        else if (values.message.length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
            isValid = false;
        }
        else if (values.message.length > 500) {
            newErrors.message = 'Message cannot exceed 500 characters';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Apply different formatting based on field type
        if (name === 'name') {
            // Format name field with title case
            setValues(prev => ({
                ...prev,
                [name]: (0, stringUtils_1.formatString)(value, false)
            }));
        }
        else {
            setValues(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (validateForm()) {
            // Format values before submission
            const formattedValues = {
                name: showNameField ? (0, stringUtils_1.formatString)(values.name) : 'Anonymous',
                email: values.email.trim().toLowerCase(),
                message: values.message.trim()
            };
            // Call onSubmit prop if provided
            if (onSubmit) {
                onSubmit(formattedValues);
            }
            // Reset form after successful submission
            if (formMode === 'edit') {
                setValues({
                    name: '',
                    email: '',
                    message: ''
                });
                setSubmitted(false);
            }
        }
    };
    // Toggle form mode
    const toggleFormMode = () => {
        setFormMode(prevMode => prevMode === 'edit' ? 'preview' : 'edit');
    };
    // Return different UI based on theme
    const getFormClass = () => {
        let baseClass = 'form-container';
        // Add theme-specific class
        if (theme === 'dark') {
            baseClass += ' dark-theme';
        }
        else {
            baseClass += ' light-theme';
        }
        // Add mode-specific class
        if (formMode === 'preview') {
            baseClass += ' preview-mode';
        }
        // Add disabled class if form is disabled
        if (disabled) {
            baseClass += ' disabled';
        }
        return baseClass;
    };
    // Special case for preview mode
    if (formMode === 'preview') {
        return (react_1.default.createElement("div", { "data-testid": "form_preview", className: getFormClass() },
            react_1.default.createElement("h2", null, "Form Preview"),
            react_1.default.createElement("div", { className: "preview-content" },
                showNameField && (react_1.default.createElement("div", { className: "preview-field" },
                    react_1.default.createElement("strong", null, "Name:"),
                    " ",
                    values.name || 'Not provided')),
                react_1.default.createElement("div", { className: "preview-field" },
                    react_1.default.createElement("strong", null, "Email:"),
                    " ",
                    values.email || 'Not provided'),
                react_1.default.createElement("div", { className: "preview-field" },
                    react_1.default.createElement("strong", null, "Message:"),
                    " ",
                    values.message || 'Not provided')),
            react_1.default.createElement("div", { className: "form-actions" },
                react_1.default.createElement("button", { "data-testid": "form_edit_button", onClick: toggleFormMode, disabled: disabled }, "Edit Form"),
                react_1.default.createElement("button", { "data-testid": "form_submit_button", onClick: handleSubmit, disabled: disabled || !validateForm() }, "Submit"))));
    }
    // Default edit mode UI
    return (react_1.default.createElement("form", { "data-testid": "form_container", className: getFormClass(), onSubmit: handleSubmit },
        react_1.default.createElement("h2", null, "Contact Form"),
        showNameField && (react_1.default.createElement("div", { className: "form-group" },
            react_1.default.createElement("label", { htmlFor: "name" }, "Name:"),
            react_1.default.createElement("input", { type: "text", id: "name", name: "name", "data-testid": "form_name_input", value: values.name, onChange: handleChange, disabled: disabled }),
            errors.name && react_1.default.createElement("div", { className: "error" }, errors.name))),
        react_1.default.createElement("div", { className: "form-group" },
            react_1.default.createElement("label", { htmlFor: "email" }, "Email:"),
            react_1.default.createElement("input", { type: "email", id: "email", name: "email", "data-testid": "form_email_input", value: values.email, onChange: handleChange, disabled: disabled }),
            errors.email && react_1.default.createElement("div", { className: "error" }, errors.email)),
        react_1.default.createElement("div", { className: "form-group" },
            react_1.default.createElement("label", { htmlFor: "message" }, "Message:"),
            react_1.default.createElement("textarea", { id: "message", name: "message", "data-testid": "form_message_input", value: values.message, onChange: handleChange, rows: 5, disabled: disabled }),
            errors.message && react_1.default.createElement("div", { className: "error" }, errors.message),
            values.message && (react_1.default.createElement("div", { className: "character-count" },
                values.message.length,
                "/500 characters"))),
        react_1.default.createElement("div", { className: "form-actions" },
            react_1.default.createElement("button", { type: "button", "data-testid": "form_preview_button", onClick: toggleFormMode, disabled: disabled }, "Preview"),
            react_1.default.createElement("button", { type: "submit", "data-testid": "form_submit_button", disabled: disabled }, "Submit"))));
};
exports.Form = Form;
