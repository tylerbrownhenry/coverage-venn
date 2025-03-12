import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from '../components/Form';

describe('Form Component', () => {
  // Test basic rendering
  it('renders the form correctly', () => {
    render(<Form />);
    
    // Check that all expected elements are rendered
    expect(screen.getByTestId('form_container')).toBeInTheDocument();
    expect(screen.getByTestId('form_name_input')).toBeInTheDocument();
    expect(screen.getByTestId('form_email_input')).toBeInTheDocument();
    expect(screen.getByTestId('form_message_input')).toBeInTheDocument();
    expect(screen.getByTestId('form_preview_button')).toBeInTheDocument();
    expect(screen.getByTestId('form_submit_button')).toBeInTheDocument();
  });
  
  // Test input change handling
  it('updates input values when typing', () => {
    render(<Form />);
    
    // Find input elements
    const nameInput = screen.getByTestId('form_name_input');
    const emailInput = screen.getByTestId('form_email_input');
    const messageInput = screen.getByTestId('form_message_input');
    
    // Simulate typing in the inputs
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'This is a test message' } });
    
    // Check that the input values have been updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(messageInput).toHaveValue('This is a test message');
  });
  
  // Test conditional rendering (name field can be hidden)
  it('hides the name field when showNameField is false', () => {
    render(<Form showNameField={false} />);
    
    // Check that the name field is not rendered
    expect(screen.queryByTestId('form_name_input')).not.toBeInTheDocument();
    
    // But other fields are still rendered
    expect(screen.getByTestId('form_email_input')).toBeInTheDocument();
    expect(screen.getByTestId('form_message_input')).toBeInTheDocument();
  });
  
  // Test form submission (this deliberately skips validation for partial coverage)
  it('calls onSubmit when the form is submitted with valid data', () => {
    const handleSubmit = jest.fn();
    render(
      <Form 
        onSubmit={handleSubmit}
        initialValues={{
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with sufficient length'
        }}
      />
    );
    
    // Submit the form
    const submitButton = screen.getByTestId('form_submit_button');
    fireEvent.click(submitButton);
    
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