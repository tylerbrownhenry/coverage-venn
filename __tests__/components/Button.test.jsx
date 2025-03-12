/**
 * Test file for Button component with JSX
 * to test instrumentation.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// A simple Button component with conditional rendering
const Button = ({ 
  text, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  icon = null,
  isLoading = false 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-700';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-700';
      case 'success':
        return 'bg-green-500 hover:bg-green-700';
      case 'danger':
        return 'bg-red-500 hover:bg-red-700';
      default:
        return 'bg-blue-500 hover:bg-blue-700';
    }
  };

  const handleClick = (e) => {
    try {
      if (typeof onClick === 'function' && !disabled && !isLoading) {
        onClick(e);
      }
    } catch (error) {
      console.error('Error in button click handler:', error);
    }
  };

  const buttonClass = `
    px-4 py-2 rounded
    ${getVariantClass()}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${isLoading ? 'opacity-75' : ''}
  `;

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || isLoading}
      data-testid="button"
    >
      {isLoading ? (
        <span data-testid="loading-spinner">Loading...</span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

describe('Button Component', () => {
  test('renders with default props', () => {
    render(<Button text="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows loading state', () => {
    render(<Button text="Click me" isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
  });

  test('respects disabled state', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} disabled={true} />);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByTestId('button')).toBeDisabled();
  });

  test('renders with icon', () => {
    render(<Button text="Click me" icon="📧" />);
    expect(screen.getByText('📧')).toBeInTheDocument();
  });

  test('renders with different variants', () => {
    const { rerender } = render(<Button text="Primary" variant="primary" />);
    expect(screen.getByTestId('button')).toHaveClass('bg-blue-500');
    
    rerender(<Button text="Secondary" variant="secondary" />);
    expect(screen.getByTestId('button')).toHaveClass('bg-gray-500');
    
    rerender(<Button text="Success" variant="success" />);
    expect(screen.getByTestId('button')).toHaveClass('bg-green-500');
    
    rerender(<Button text="Danger" variant="danger" />);
    expect(screen.getByTestId('button')).toHaveClass('bg-red-500');
    
    rerender(<Button text="Unknown" variant="unknown" />);
    expect(screen.getByTestId('button')).toHaveClass('bg-blue-500');
  });
}); 