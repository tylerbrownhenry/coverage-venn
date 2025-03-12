import React, { useState } from 'react';
import SimpleComponent from './components/SimpleComponent';
import ConditionalComponent from './components/ConditionalComponent';
import NestedComponent from './components/NestedComponent';
import PropsComponent from './components/PropsComponent';
import DynamicComponent from './components/DynamicComponent';

/**
 * Main App component that demonstrates various JSX patterns
 * for testing our coverage instrumentation
 */
function App() {
  const [showComponents, setShowComponents] = useState(true);
  const [selectedTab, setSelectedTab] = useState('simple');
  
  // Conditional rendering using if statement
  const renderTabContent = () => {
    if (selectedTab === 'simple') {
      return <SimpleComponent />;
    } else if (selectedTab === 'conditional') {
      return <ConditionalComponent condition={true} />;
    } else if (selectedTab === 'nested') {
      return <NestedComponent />;
    } else if (selectedTab === 'props') {
      return <PropsComponent 
        title="Test Title" 
        description="Test Description" 
        items={['item1', 'item2', 'item3']} 
      />;
    } else {
      return <DynamicComponent count={3} />;
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Coverage Test App</h1>
        <button onClick={() => setShowComponents(!showComponents)}>
          {showComponents ? 'Hide' : 'Show'} Components
        </button>
      </header>
      
      {/* Conditional rendering using && operator */}
      {showComponents && (
        <main>
          <nav>
            <ul>
              <li>
                <button 
                  className={selectedTab === 'simple' ? 'active' : ''}
                  onClick={() => setSelectedTab('simple')}
                >
                  Simple
                </button>
              </li>
              <li>
                <button 
                  className={selectedTab === 'conditional' ? 'active' : ''}
                  onClick={() => setSelectedTab('conditional')}
                >
                  Conditional
                </button>
              </li>
              <li>
                <button 
                  className={selectedTab === 'nested' ? 'active' : ''}
                  onClick={() => setSelectedTab('nested')}
                >
                  Nested
                </button>
              </li>
              <li>
                <button 
                  className={selectedTab === 'props' ? 'active' : ''}
                  onClick={() => setSelectedTab('props')}
                >
                  Props
                </button>
              </li>
              <li>
                <button 
                  className={selectedTab === 'dynamic' ? 'active' : ''}
                  onClick={() => setSelectedTab('dynamic')}
                >
                  Dynamic
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="content">
            {/* Content rendered based on selected tab */}
            {renderTabContent()}
            
            {/* Ternary operator for conditional rendering */}
            <div className="status">
              {selectedTab === 'simple' 
                ? <p>Basic component with simple JSX</p> 
                : <p>Advanced component with {selectedTab} rendering</p>
              }
            </div>
          </div>
        </main>
      )}
      
      <footer>
        <p>Coverage Instrumentation Test</p>
      </footer>
    </div>
  );
}

export default App; 