import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';

interface DatabaseDropdownProps {
  onDatabaseSelected: (database: string) => void;
}

const DatabaseDropdown: React.FC<DatabaseDropdownProps> = ({ onDatabaseSelected }) => {
  const dispatch = useDispatch();
  const databaseList = useSelector((state: RootState) => state.global.databaseList);
  const currentDatabase = useSelector((state: RootState) => state.global.database);
  const [isOpen, setIsOpen] = useState(false);

  const handleDatabaseChange = (database: string) => {
    dispatch({ type: 'global/setDatabase', payload: database });
    onDatabaseSelected(database);
    setIsOpen(false);
  };

  return (
    <div className="database-dropdown">
      <div className="dropdown-header">
        <label>Database:</label>
        <div className="dropdown-container">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="selected-database">
              {currentDatabase || 'Select Database'}
            </span>
            <i className={`material-icons dropdown-icon ${isOpen ? 'open' : ''}`}>
              arrow_drop_down
            </i>
          </button>
          
          {isOpen && (
            <div className="dropdown-menu">
              {databaseList.length > 0 ? (
                <ul className="database-list">
                  {databaseList.map((database) => (
                    <li key={database}>
                      <button
                        className={`database-item ${currentDatabase === database ? 'active' : ''}`}
                        onClick={() => handleDatabaseChange(database)}
                      >
                        <i className="material-icons">storage</i>
                        <span>{database}</span>
                        {currentDatabase === database && (
                          <i className="material-icons check-icon">check</i>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>No databases available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabaseDropdown;
