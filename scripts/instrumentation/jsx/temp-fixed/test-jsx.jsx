
// Import React (normally required for JSX)
// This is just for testing babel transformation, we don't actually run this file directly
const React = { createElement: (...args) => args };

// Simple component with JSX
function Button({ text, onClick }) {
  return (
    <button className="btn" onClick={onClick}>
      {text}
    </button>
  );
}

// Component with conditional rendering
function ConditionalComponent({ condition, value }) {
  return (
    <div>
      {condition ? (
        <span className="true-case">{value}</span>
      ) : (
        <span className="false-case">No value</span>
      )}
    </div>
  );
}

// Component with function and JSX together
function ComplexComponent({ items, onItemClick }) {
  const handleItemClick = (item) => {
    console.log('Item clicked:', item);
    onItemClick(item);
  };

  return (
    <div className="list-container">
      <h2>Items List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} onClick={() => handleItemClick(item)}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Export for completeness
export { Button, ConditionalComponent, ComplexComponent };
