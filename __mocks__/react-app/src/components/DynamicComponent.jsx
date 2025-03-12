import React, { useState, useEffect } from 'react';

/**
 * Component that demonstrates dynamically generated JSX elements
 * Used to test instrumentation of dynamic content
 */
function DynamicComponent({ count = 0 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Simulate data loading
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Generate items based on count
        const newItems = Array.from({ length: count }, (_, index) => ({
          id: `item-${index}`,
          name: `Dynamic Item ${index + 1}`,
          value: Math.floor(Math.random() * 100)
        }));
        
        setItems(newItems);
        setLoading(false);
      } catch (err) {
        setError('Failed to load items');
        setLoading(false);
      }
    }, 1000);
  }, [count]);
  
  // Determine which type of item to render based on value
  const renderItem = (item) => {
    if (item.value > 75) {
      return (
        <div key={item.id} className="item high-value">
          <h3>{item.name}</h3>
          <span className="badge">High Value: {item.value}</span>
        </div>
      );
    } else if (item.value > 25) {
      return (
        <div key={item.id} className="item medium-value">
          <h3>{item.name}</h3>
          <span className="badge">Medium Value: {item.value}</span>
        </div>
      );
    } else {
      return (
        <div key={item.id} className="item low-value">
          <h3>{item.name}</h3>
          <span className="badge">Low Value: {item.value}</span>
        </div>
      );
    }
  };
  
  // Handle different states with different JSX structures
  let content;
  if (loading) {
    content = (
      <div className="loading-state">
        <p>Loading items...</p>
        <div className="spinner"></div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="error-state">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  } else if (items.length === 0) {
    content = (
      <div className="empty-state">
        <p>No items to display</p>
        <button onClick={() => setItems([{ id: 'default', name: 'Default Item', value: 50 }])}>
          Add Default Item
        </button>
      </div>
    );
  } else {
    content = (
      <div className="items-container">
        {items.map(item => renderItem(item))}
      </div>
    );
  }

  return (
    <div className="dynamic-component">
      <h2>Dynamic Component</h2>
      <p>Displaying {count} dynamically generated items</p>
      
      {content}
      
      <div className="controls">
        <button 
          onClick={() => setLoading(true)}
          disabled={loading}
        >
          Reload
        </button>
      </div>
    </div>
  );
}

export default DynamicComponent; 