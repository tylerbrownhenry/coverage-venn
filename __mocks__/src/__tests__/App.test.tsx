import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import directly here instead of from setup
import App from '../App';
import { getThis } from '../utils/utils';

// Add TypeScript declaration for the jest-dom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
    }
  }
}

// Mock dependencies
jest.mock('../components/button', () => ({
  Button: () => <div data-testid="mocked-button">Mocked Button</div>
}));

jest.mock('../utils/utils', () => ({
  getThis: jest.fn()
}));

// Mock additional components
jest.mock('../components/Form', () => ({
  Form: () => <div data-testid="mocked-form">Mocked Form</div>
}));

jest.mock('../components/Dashboard', () => ({
  Dashboard: () => <div data-testid="mocked-dashboard">Mocked Dashboard</div>
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
    (getThis as jest.Mock).mockReturnValue('Mocked Title');
    
    render(<App />);
    
    // Check the title is rendered
    expect(screen.getByText('Mocked Title')).toBeInTheDocument();
    
    // Verify getThis was called with the right argument
    expect(getThis).toHaveBeenCalledWith('Interactive Dashboard');
  });

  it('should render the button component', () => {
    (getThis as jest.Mock).mockReturnValue('Any Title');
    
    render(<App />);
    
    // Check the button is rendered (mocked version)
    expect(screen.getByTestId('mocked-button')).toBeInTheDocument();
  });

  it('should have the correct test ID', () => {
    (getThis as jest.Mock).mockReturnValue('Any Title');
    
    render(<App />);
    
    // Check the root element has the correct test ID
    expect(screen.getByTestId('root_app')).toBeInTheDocument();
  });
}); 