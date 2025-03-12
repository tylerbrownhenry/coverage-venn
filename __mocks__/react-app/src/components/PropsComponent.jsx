import React from 'react';

/**
 * Component that demonstrates various prop patterns
 * Used to test instrumentation of JSX with props
 */
function PropsComponent({ 
  title = 'Default Title', 
  description, 
  items = [], 
  showHeader = true,
  onAction = () => {},
  theme = 'light'
}) {
  // Using props in conditional rendering
  const headerElement = showHeader ? (
    <header className={`header ${theme}`}>
      <h2>{title}</h2>
      {description && <p className="description">{description}</p>}
    </header>
  ) : null;
  
  // Using props to generate dynamic content
  const itemElements = items.map((item, index) => (
    <li key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
      <span>{item}</span>
      <button onClick={() => onAction(item)}>Action</button>
    </li>
  ));
  
  // Conditional class assignment based on props
  const containerClasses = [
    'props-component',
    `theme-${theme}`,
    items.length > 0 ? 'has-items' : 'no-items'
  ].join(' ');

  return (
    <div className={containerClasses} data-test-id="props-component">
      {headerElement}
      
      <div className="component-body">
        {items.length > 0 ? (
          <ul className="items-list">
            {itemElements}
          </ul>
        ) : (
          <p className="empty-message">No items available</p>
        )}
      </div>
      
      <footer>
        <p>Total items: {items.length}</p>
        <button 
          className="action-button"
          onClick={() => onAction('footer-action')}
          disabled={items.length === 0}
        >
          Perform Action
        </button>
      </footer>
    </div>
  );
}

export default PropsComponent; 