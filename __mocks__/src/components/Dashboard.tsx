import React, { useState, useEffect } from 'react';
import { Form } from './Form';
import { processData, DataItem } from '../utils/dataUtils';
import { formatString } from '../utils/stringUtils';
import { getThis } from '../utils/utils';

interface DashboardProps {
  title?: string;
  initialData?: DataItem[];
  showForm?: boolean;
  darkMode?: boolean;
  loading?: boolean;
  error?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  title = 'Data Dashboard',
  initialData = [],
  showForm = true,
  darkMode = false,
  loading = false,
  error = ''
}) => {
  // State management
  const [data, setData] = useState<DataItem[]>(initialData);
  const [filteredData, setFilteredData] = useState<DataItem[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'recent' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: initialData.length,
    validItems: 0,
    avgValue: 0
  });
  
  // Format title using the utility function
  const formattedTitle = formatString(getThis(title));
  
  // Process data whenever it changes
  useEffect(() => {
    if (data.length === 0) return;
    
    // Process the data with different options based on current state
    const processOptions = {
      validate: true,
      transform: true,
      sort: sortOrder,
      limit: activeTab === 'recent' ? 5 : 0,
      filterInvalid: activeTab !== 'all'
    };
    
    const result = processData(data, processOptions);
    
    if (result.success && result.data) {
      let processed = result.data;
      
      // Additional filtering for favorites tab
      if (activeTab === 'favorites') {
        processed = processed.filter(item => 
          favorites.includes(String(item.id))
        );
      }
      
      // Apply search filter if specified
      if (searchTerm) {
        processed = processed.filter(item => 
          String(item.value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredData(processed);
      
      // Update stats
      if (result.stats) {
        setStats({
          total: result.stats.total,
          validItems: result.stats.valid,
          avgValue: calculateAverage(processed)
        });
      }
    }
  }, [data, searchTerm, sortOrder, activeTab, favorites]);
  
  // Calculate average value (only for numeric values)
  const calculateAverage = (items: DataItem[]): number => {
    const numericItems = items.filter(
      item => typeof item.value === 'number'
    );
    
    if (numericItems.length === 0) return 0;
    
    const sum = numericItems.reduce(
      (acc, item) => acc + (item.value as number), 
      0
    );
    
    return sum / numericItems.length;
  };
  
  // Handle form submission to add new data
  const handleFormSubmit = (values: any) => {
    // Convert form values to data items
    const newItem: DataItem = {
      id: `item-${Date.now()}`,
      value: values.message,
      timestamp: new Date(),
      metadata: {
        author: values.name || 'Anonymous',
        email: values.email
      }
    };
    
    setData(prevData => [...prevData, newItem]);
  };
  
  // Toggle favorite status for an item
  const toggleFavorite = (id: string | number) => {
    const idStr = String(id);
    
    setFavorites(prev => {
      if (prev.includes(idStr)) {
        return prev.filter(item => item !== idStr);
      } else {
        return [...prev, idStr];
      }
    });
  };
  
  // Handle sort toggle
  const toggleSort = () => {
    if (sortOrder === null) {
      setSortOrder('asc');
    } else if (sortOrder === 'asc') {
      setSortOrder('desc');
    } else {
      setSortOrder(null);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div data-testid="dashboard_loading" className="dashboard loading">
        <h2>{formattedTitle}</h2>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div data-testid="dashboard_error" className="dashboard error">
        <h2>Error</h2>
        <div className="error-message">{error}</div>
        <button onClick={() => setData([])}>Clear Data</button>
      </div>
    );
  }
  
  // Get the theme based on darkMode prop
  const theme = darkMode ? 'dark' : 'light';
  
  return (
    <div 
      data-testid="dashboard_container" 
      className={`dashboard ${theme}`}
    >
      <h2>{formattedTitle}</h2>
      
      {/* Stats display */}
      <div className="dashboard-stats">
        <div className="stat-item">
          <span className="stat-label">Total Items:</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Valid Items:</span>
          <span className="stat-value">{stats.validItems}</span>
        </div>
        {stats.avgValue > 0 && (
          <div className="stat-item">
            <span className="stat-label">Average Value:</span>
            <span className="stat-value">{stats.avgValue.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      {/* Tab navigation */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'all' ? 'active' : ''}
          onClick={() => setActiveTab('all')}
          data-testid="dashboard_tab_all"
        >
          All Items
        </button>
        <button 
          className={activeTab === 'recent' ? 'active' : ''}
          onClick={() => setActiveTab('recent')}
          data-testid="dashboard_tab_recent"
        >
          Recent
        </button>
        <button 
          className={activeTab === 'favorites' ? 'active' : ''}
          onClick={() => setActiveTab('favorites')}
          data-testid="dashboard_tab_favorites"
        >
          Favorites ({favorites.length})
        </button>
      </div>
      
      {/* Search and sort */}
      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          data-testid="dashboard_search"
        />
        <button 
          onClick={toggleSort}
          data-testid="dashboard_sort"
        >
          Sort {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '⇅'}
        </button>
      </div>
      
      {/* Data display section */}
      <div className="dashboard-data">
        {filteredData.length === 0 ? (
          <div className="empty-state" data-testid="dashboard_empty">
            {activeTab === 'favorites' 
              ? 'No favorite items yet.'
              : searchTerm 
                ? 'No matching items found.' 
                : 'No data available.'}
          </div>
        ) : (
          <ul className="data-list" data-testid="dashboard_list">
            {filteredData.map(item => (
              <li 
                key={String(item.id)} 
                className={favorites.includes(String(item.id)) ? 'favorite' : ''}
                data-testid={`dashboard_item_${item.id}`}
              >
                <div className="item-content">
                  <div className="item-value">
                    {typeof item.value === 'string' 
                      ? item.value 
                      : JSON.stringify(item.value)}
                  </div>
                  {item.timestamp && (
                    <div className="item-timestamp">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="item-actions">
                  <button 
                    onClick={() => toggleFavorite(item.id)}
                    data-testid={`dashboard_fav_${item.id}`}
                  >
                    {favorites.includes(String(item.id)) ? '★' : '☆'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Conditional form rendering */}
      {showForm && (
        <div className="dashboard-form">
          <h3>Add New Item</h3>
          <Form
            theme={theme}
            onSubmit={handleFormSubmit}
          />
        </div>
      )}
    </div>
  );
}; 