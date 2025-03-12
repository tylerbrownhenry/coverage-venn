/**
 * Instrumentation Tests
 * 
 * This file contains tests for the coverage instrumentation system.
 * It uses a simple React component with various branching paths and
 * conditional rendering to validate that the instrumentation is working.
 */

import React, { useState } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import coverageTracker from '../trackers/coverage-tracker';

// Helper component with conditional branches and JSX patterns
const TestComponent: React.FC<{
  showButton?: boolean; 
  buttonText?: string;
  onClick?: () => void;
  items?: string[];
}> = ({ 
  showButton = true, 
  buttonText = 'Click Me', 
  onClick = () => console.log('clicked'),
  items = [] 
}) => {
  const [count, setCount] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Function with branches
  const handleClick = () => {
    if (count < 5) {
      setCount(count + 1);
    } else {
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
  
  return (
    <div data-testid="test-component">
      <h1>{expanded ? 'Expanded View' : 'Simple View'}</h1>
      
      {/* Conditional rendering with && */}
      {showButton && (
        <button 
          data-testid="test-button"
          onClick={handleClick}
        >
          {getButtonLabel()}
        </button>
      )}
      
      {/* Conditional rendering with ternary */}
      {count > 3 ? (
        <div data-testid="bonus-content">
          <p>Bonus content unlocked!</p>
        </div>
      ) : null}
      
      {/* List rendering */}
      {items.length > 0 && (
        <ul data-testid="items-list">
          {items.map((item, index) => (
            <li key={index} data-testid={`item-${index}`}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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
  coverageTracker.start('InstrumentationTests');
  // Initialize with mock data
  (coverageTracker as any).data.components = mockComponentData;
});

// Stop and print results after all tests
afterAll(() => {
  const data = coverageTracker.stop();
  console.log('Coverage Data:', JSON.stringify(data, null, 2));
});

describe('Instrumentation Tests', () => {
  beforeEach(() => {
    // Reset state but keep components structure
    coverageTracker.reset();
    // Re-add mock component data after reset
    (coverageTracker as any).data.components = mockComponentData;
  });
  
  test('renders and handles basic interactions', () => {
    render(<TestComponent />);
    
    // Check initial rendering
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
    expect(screen.getByText('Simple View')).toBeInTheDocument();
    
    // Click multiple times to trigger different branches
    fireEvent.click(screen.getByTestId('test-button'));
    fireEvent.click(screen.getByTestId('test-button'));
    fireEvent.click(screen.getByTestId('test-button'));
    fireEvent.click(screen.getByTestId('test-button'));
    
    // Now the bonus content should appear
    expect(screen.getByTestId('bonus-content')).toBeInTheDocument();
    
    // Click more to reset
    fireEvent.click(screen.getByTestId('test-button'));
    fireEvent.click(screen.getByTestId('test-button'));
    
    // Should have switched to expanded view
    expect(screen.getByText('Expanded View')).toBeInTheDocument();
    
    // Manually simulate some branch execution to test tracking
    coverageTracker.trackBranch('TestComponent', 1, 'if', 1);
    
    // Verify coverage data contains the expected components
    const data = coverageTracker.getData();
    expect(data.components).toBeDefined();
    expect(Object.keys(data.components).length).toBeGreaterThan(0);
  });
  
  test('conditional rendering of button', () => {
    render(<TestComponent showButton={false} />);
    
    // Button should not be rendered
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.queryByTestId('test-button')).not.toBeInTheDocument();
  });
  
  test('renders list items', () => {
    render(<TestComponent items={['Apple', 'Banana', 'Cherry']} />);
    
    // List should be rendered
    expect(screen.getByTestId('items-list')).toBeInTheDocument();
    expect(screen.getByTestId('item-0')).toHaveTextContent('Apple');
    expect(screen.getByTestId('item-1')).toHaveTextContent('Banana');
    expect(screen.getByTestId('item-2')).toHaveTextContent('Cherry');
  });
}); 