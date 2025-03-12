import React from 'react';

/**
 * Simple component with basic JSX structure
 * Used to test basic JSX element tracking
 */
function SimpleComponent() {
  return (
    <div className="simple-component">
      <h2>Simple Component</h2>
      <p>This is a basic component with simple JSX structure</p>
      <div className="content">
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </div>
  );
}

export default SimpleComponent; 