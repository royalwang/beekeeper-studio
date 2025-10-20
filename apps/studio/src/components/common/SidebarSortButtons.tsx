import React, { useState } from 'react';

interface SidebarSortButtonsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  sortOptions: Record<string, string>;
  noOrder?: string;
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

const SidebarSortButtons: React.FC<SidebarSortButtonsProps> = ({
  sortBy,
  sortOrder,
  sortOptions,
  noOrder = 'none',
  onSortChange,
  className = '',
}) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder);
    setShowSortMenu(false);
  };

  const sortOrderTooltip = sortOrder === 'desc' ? 'Descending' : 'Ascending';
  const currentSortOption = sortOptions[sortBy] || 'None';

  return (
    <div className={`sort-buttons ${className}`}>
      {sortBy !== noOrder && (
        <button
          className="actions-btn btn btn-link btn-sm"
          onClick={toggleSortOrder}
          title={sortOrderTooltip}
        >
          <i className="material-icons">
            {sortOrder === 'desc' ? 'expand_more' : 'expand_less'}
          </i>
        </button>
      )}
      
      <div className="sort-menu-container">
        <button
          className="actions-btn btn btn-link btn-sm"
          onClick={() => setShowSortMenu(!showSortMenu)}
          title={`Sorted by ${currentSortOption} (${sortOrderTooltip})`}
        >
          <i className="material-icons-outlined">sort</i>
        </button>
        
        {showSortMenu && (
          <div className="sort-menu">
            <div className="sort-menu-header">
              <span>Sort by:</span>
              <button
                className="close-menu"
                onClick={() => setShowSortMenu(false)}
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            
            <div className="sort-options">
              {Object.entries(sortOptions).map(([key, label]) => (
                <button
                  key={key}
                  className={`sort-option ${key === sortBy ? 'active' : ''}`}
                  onClick={() => handleSortByChange(key)}
                >
                  <span className="sort-label">{label}</span>
                  {key === sortBy && (
                    <i className="material-icons check-icon">check</i>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {showSortMenu && (
        <div
          className="sort-menu-overlay"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
};

export default SidebarSortButtons;
