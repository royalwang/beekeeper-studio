import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const FavoriteList: React.FC = () => {
  // Mock favorite queries data - in real implementation, this would come from the store
  const favoriteQueries = [
    { id: 1, name: 'User Statistics', query: 'SELECT COUNT(*) FROM users WHERE created_at > ?', description: 'Get user count by date' },
    { id: 2, name: 'Top Products', query: 'SELECT name, sales FROM products ORDER BY sales DESC LIMIT 10', description: 'Best selling products' },
    { id: 3, name: 'Monthly Revenue', query: 'SELECT SUM(amount) FROM orders WHERE MONTH(created_at) = ?', description: 'Revenue by month' },
  ];

  const handleQueryClick = (query: any) => {
    // Handle favorite query selection - could open in a new tab
    console.log('Favorite query selected:', query);
  };

  const handleRemoveFavorite = (id: number) => {
    // Handle removing from favorites
    console.log('Remove favorite:', id);
  };

  return (
    <div className="favorite-list">
      <div className="list-header">
        <h4>Saved Queries</h4>
        <button className="add-favorite-btn" title="Add New Query">
          <i className="material-icons">add</i>
        </button>
      </div>
      <div className="list-content">
        {favoriteQueries.length > 0 ? (
          <ul className="favorite-items">
            {favoriteQueries.map((query) => (
              <li key={query.id} className="favorite-item">
                <div 
                  className="query-info"
                  onClick={() => handleQueryClick(query)}
                >
                  <div className="query-name">{query.name}</div>
                  <div className="query-description">{query.description}</div>
                  <div className="query-preview">
                    {query.query.length > 60 ? `${query.query.substring(0, 60)}...` : query.query}
                  </div>
                </div>
                <button 
                  className="remove-favorite-btn"
                  onClick={() => handleRemoveFavorite(query.id)}
                  title="Remove from favorites"
                >
                  <i className="material-icons">close</i>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No saved queries</p>
            <button className="add-first-query-btn">
              <i className="material-icons">add</i>
              Add your first query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteList;
