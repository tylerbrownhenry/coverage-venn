import React, { useState, useEffect } from 'react';
import { formatString, validateString } from '../utils/stringUtils';

interface FormProps {
  initialValues?: {
    name?: string;
    email?: string;
    message?: string;
  };
  onSubmit?: (values: FormValues) => void;
  theme?: 'light' | 'dark';
  showNameField?: boolean;
  disabled?: boolean;
}

interface FormValues {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const Form: React.FC<FormProps> = ({
  initialValues = {},
  onSubmit,
  theme = 'light',
  showNameField = true,
  disabled = false
}) => {
  // State management
  const [values, setValues] = useState<FormValues>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    message: initialValues.message || ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [formMode, setFormMode] = useState<'edit' | 'preview'>('edit');
  
  // Effect to validate form when values change
  useEffect(() => {
    if (submitted) {
      validateForm();
    }
  }, [values, submitted]);
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Conditional validation based on showNameField
    if (showNameField) {
      const nameValidation = validateString(values.name);
      if (!nameValidation.isValid) {
        newErrors.name = 'Name is required and must be at least 3 characters';
        isValid = false;
      }
    }
    
    // Email validation
    if (!values.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = 'Email format is invalid';
      isValid = false;
    }
    
    // Message validation
    if (!values.message) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (values.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    } else if (values.message.length > 500) {
      newErrors.message = 'Message cannot exceed 500 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply different formatting based on field type
    if (name === 'name') {
      // Format name field with title case
      setValues(prev => ({
        ...prev,
        [name]: formatString(value, false)
      }));
    } else {
      setValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (validateForm()) {
      // Format values before submission
      const formattedValues = {
        name: showNameField ? formatString(values.name) : 'Anonymous',
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
    } else {
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
    return (
      <div data-testid="form_preview" className={getFormClass()}>
        <h2>Form Preview</h2>
        <div className="preview-content">
          {showNameField && (
            <div className="preview-field">
              <strong>Name:</strong> {values.name || 'Not provided'}
            </div>
          )}
          <div className="preview-field">
            <strong>Email:</strong> {values.email || 'Not provided'}
          </div>
          <div className="preview-field">
            <strong>Message:</strong> {values.message || 'Not provided'}
          </div>
        </div>
        <div className="form-actions">
          <button 
            data-testid="form_edit_button"
            onClick={toggleFormMode}
            disabled={disabled}
          >
            Edit Form
          </button>
          <button 
            data-testid="form_submit_button"
            onClick={handleSubmit}
            disabled={disabled || !validateForm()}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
  
  // Default edit mode UI
  return (
    <form 
      data-testid="form_container" 
      className={getFormClass()} 
      onSubmit={handleSubmit}
    >
      <h2>Contact Form</h2>
      
      {/* Conditional rendering of name field */}
      {showNameField && (
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            data-testid="form_name_input"
            value={values.name}
            onChange={handleChange}
            disabled={disabled}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
      )}
      
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          data-testid="form_email_input"
          value={values.email}
          onChange={handleChange}
          disabled={disabled}
        />
        {errors.email && <div className="error">{errors.email}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          data-testid="form_message_input"
          value={values.message}
          onChange={handleChange}
          rows={5}
          disabled={disabled}
        />
        {errors.message && <div className="error">{errors.message}</div>}
        {values.message && (
          <div className="character-count">
            {values.message.length}/500 characters
          </div>
        )}
      </div>
      
      <div className="form-actions">
        <button 
          type="button"
          data-testid="form_preview_button"
          onClick={toggleFormMode}
          disabled={disabled}
        >
          Preview
        </button>
        <button 
          type="submit"
          data-testid="form_submit_button"
          disabled={disabled}
        >
          Submit
        </button>
      </div>
    </form>
  );
}; 