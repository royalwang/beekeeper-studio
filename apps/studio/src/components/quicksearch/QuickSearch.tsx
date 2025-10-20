import React from 'react';

interface QuickSearchProps {
  onClose: () => void;
}

const QuickSearch: React.FC<QuickSearchProps> = ({ onClose }) => {
  return (
    <div className="quick-search">
      {/* Quick search content will be implemented here */}
      <div className="search-overlay">
        <div className="search-content">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            autoFocus
          />
          <button onClick={onClose} className="close-search">
            <i className="material-icons">close</i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;
