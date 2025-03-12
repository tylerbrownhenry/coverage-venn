import React from 'react';

/**
 * Card component used as a child in NestedComponent
 */
function Card({ title, children }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

/**
 * NavItem component used as a child in NestedComponent
 */
function NavItem({ label, active, onClick }) {
  return (
    <li className={`nav-item ${active ? 'active' : ''}`}>
      <button onClick={onClick}>{label}</button>
    </li>
  );
}

/**
 * Component that demonstrates nested component structure
 * Used to test instrumentation of nested JSX elements
 */
function NestedComponent() {
  return (
    <div className="nested-component">
      <h2>Nested Component</h2>
      
      <nav className="nav-container">
        <ul>
          <NavItem label="Home" active={true} onClick={() => {}} />
          <NavItem label="About" active={false} onClick={() => {}} />
          <NavItem label="Contact" active={false} onClick={() => {}} />
        </ul>
      </nav>
      
      <div className="cards-container">
        <Card title="Feature One">
          <p>This is the first feature card with nested content.</p>
          <button>Learn More</button>
        </Card>
        
        <Card title="Feature Two">
          <p>This is the second feature card with nested content.</p>
          <div className="nested-deeper">
            <ul>
              <li>Nested list item 1</li>
              <li>Nested list item 2</li>
            </ul>
          </div>
        </Card>
        
        <Card title="Feature Three">
          <p>This is the third feature card with nested content.</p>
          <Card title="Nested Card">
            <p>This is a card nested inside another card!</p>
          </Card>
        </Card>
      </div>
    </div>
  );
}

export default NestedComponent; 