import React, { useState } from 'react';

/**
 * Component that demonstrates different conditional rendering patterns
 * Used to test instrumentation of conditional JSX rendering
 */
function ConditionalComponent({ condition }) {
  const [showDetails, setShowDetails] = useState(false);
  const [count, setCount] = useState(0);
  
  return (
    <div className="conditional-component">
      <h2>Conditional Component</h2>
      
      {/* Logical AND condition */}
      {condition && (
        <div className="condition-true">
          <p>Condition is TRUE</p>
        </div>
      )}
      
      {/* Logical AND with negation */}
      {!condition && (
        <div className="condition-false">
          <p>Condition is FALSE</p>
        </div>
      )}
      
      {/* Ternary operator condition */}
      <div className="ternary-example">
        {condition ? (
          <button onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        ) : (
          <p>Conditional rendering disabled</p>
        )}
      </div>
      
      {/* Conditional content revealed by button */}
      {showDetails && (
        <div className="details">
          <h3>Additional Details</h3>
          <p>These details are conditionally shown based on user interaction.</p>
        </div>
      )}
      
      {/* Multiple nested conditions */}
      <div className="counter">
        <p>Count: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
        <button onClick={() => setCount(count - 1)}>Decrement</button>
        
        {/* Multiple conditions with different operators */}
        {count > 0 ? (
          <p className="positive">Count is positive</p>
        ) : count < 0 ? (
          <p className="negative">Count is negative</p>
        ) : (
          <p className="zero">Count is zero</p>
        )}
        
        {/* Logical OR operator */}
        {(count > 5 || count < -5) && (
          <p className="extreme">Count has reached an extreme value!</p>
        )}
      </div>
    </div>
  );
}

export default ConditionalComponent; 