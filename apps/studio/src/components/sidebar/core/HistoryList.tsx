import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const HistoryList: React.FC = () => {
  // Mock history data - in real implementation, this would come from the store
  const historyItems = [
    { id: 1, query: 'SELECT * FROM users', timestamp: '2024-01-20 10:30:00' },
    { id: 2, query: 'INSERT INTO products VALUES (...)', timestamp: '2024-01-20 09:15:00' },
    { id: 3, query: 'UPDATE orders SET status = "completed"', timestamp: '2024-01-19 16:45:00' },
  ];

  const handleQueryClick = (query: string) => {
    // Handle query selection - could open in a new tab or copy to clipboard
    console.log('Query selected:', query);
  };

  return (
    <div className="history-list">
      <div className="list-header">
        <h4>Query History</h4>
        <button className="clear-history-btn" title="Clear History">
          <i className="material-icons">clear</i>
        </button>
      </div>
      <div className="list-content">
        {historyItems.length > 0 ? (
          <ul className="history-items">
            {historyItems.map((item) => (
              <li key={item.id} className="history-item">
                <div 
                  className="query-text"
                  onClick={() => handleQueryClick(item.query)}
                  title={item.query}
                >
                  {item.query.length > 50 ? `${item.query.substring(0, 50)}...` : item.query}
                </div>
                <div className="query-timestamp">{item.timestamp}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No query history</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryList;
