import React, { useState, useEffect } from 'react';
import { Button } from './components/button';
import { Form } from './components/Form';
import { Dashboard } from './components/Dashboard';
import { getThis } from './utils/utils';
import { formatString } from './utils/stringUtils';
import { DataItem, processData } from './utils/dataUtils';

// Sample initial data
const sampleData: DataItem[] = [
  { id: '1', value: 'First item', timestamp: new Date('2023-01-01') },
  { id: '2', value: 42, timestamp: new Date('2023-01-02') },
  { id: '3', value: { complex: true, nested: 'object' }, timestamp: new Date('2023-01-03') }
];

const App: React.FC = () => {
  // State management
  const [title, setTitle] = useState(getThis('Interactive Dashboard'));
  const [showDashboard, setShowDashboard] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentData, setCurrentData] = useState<DataItem[]>([]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Process the sample data
        const result = processData(sampleData, {
          validate: true,
          transform: true
        });
        
        if (result.success && result.data) {
          setCurrentData(result.data);
        } else if (result.error) {
          setError(result.error);
        }
        
        setLoading(false);
      } catch (error: any) {
        setError(error.message || 'Failed to load data');
        setLoading(false);
      }
    }, 1000); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  // Toggle dashboard visibility
  const toggleDashboard = () => {
    setShowDashboard(prev => !prev);
  };
  
  // Toggle form visibility
  const toggleForm = () => {
    setShowForm(prev => !prev);
  };
  
  // Handle button click with conditional error generation
  const handleButtonClick = () => {
    // Randomly decide whether to cause an error (1 in 3 chance)
    const shouldError = Math.random() < 0.3;
    
    if (shouldError) {
      setError('Random error occurred during button click');
    } else {
      // Create a new data item
      const newItem: DataItem = {
        id: `gen-${Date.now()}`,
        value: `Generated at ${new Date().toLocaleTimeString()}`,
        timestamp: new Date()
      };
      
      setCurrentData(prev => [...prev, newItem]);
      setTitle(formatString(getThis('Updated Dashboard')));
    }
  };
  
  // Clear error
  const clearError = () => {
    setError('');
  };
  
  return (
    <div 
      data-testid="root_app"
      className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}
    >
      <header className="app-header">
        <h1>{title}</h1>
        
        <div className="app-controls">
          <button 
            data-testid="toggle_theme_button"
            onClick={toggleDarkMode}
            className="theme-toggle"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          
          <button 
            data-testid="toggle_dashboard_button"
            onClick={toggleDashboard}
          >
            {showDashboard ? 'Hide Dashboard' : 'Show Dashboard'}
          </button>
          
          <button 
            data-testid="toggle_form_button"
            onClick={toggleForm}
          >
            {showForm ? 'Hide Form' : 'Show Form'}
          </button>
        </div>
      </header>
      
      <main className="app-content">
        {/* Display error message if present */}
        {error && (
          <div className="error-banner" data-testid="error_message">
            <p>{error}</p>
            <button onClick={clearError}>Dismiss</button>
          </div>
        )}
        
        {/* Original button component */}
        <div className="legacy-component">
          <h2>Legacy Component</h2>
          <Button />
          <button 
            data-testid="action_button"
            onClick={handleButtonClick}
            className="action-button"
          >
            Generate Random Data
          </button>
        </div>
        
        {/* Conditionally render standalone form */}
        {showForm && !showDashboard && (
          <div className="standalone-form">
            <h2>Contact Form</h2>
            <Form 
              theme={darkMode ? 'dark' : 'light'}
              initialValues={{
                name: 'Guest User',
                email: '',
                message: 'Please enter your message here...'
              }}
            />
          </div>
        )}
        
        {/* Conditionally render dashboard */}
        {showDashboard && (
          <Dashboard 
            title={title}
            initialData={currentData}
            showForm={showForm}
            darkMode={darkMode}
            loading={loading}
            error={error}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>Mock App for Coverage Testing</p>
      </footer>
    </div>
  );
};

export default App;
