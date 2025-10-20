import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';

interface SurrealNamespaceDropdownProps {
  onNamespaceSelected: (namespace: string) => void;
}

const SurrealNamespaceDropdown: React.FC<SurrealNamespaceDropdownProps> = ({ onNamespaceSelected }) => {
  const dispatch = useDispatch();
  const namespaceList = useSelector((state: RootState) => state.global.namespaceList);
  const currentNamespace = useSelector((state: RootState) => state.global.namespace);
  const [isOpen, setIsOpen] = useState(false);

  const handleNamespaceChange = (namespace: string) => {
    dispatch({ type: 'global/setNamespace', payload: namespace });
    onNamespaceSelected(namespace);
    setIsOpen(false);
  };

  return (
    <div className="namespace-dropdown">
      <div className="dropdown-header">
        <label>Namespace:</label>
        <div className="dropdown-container">
          <button
            className="dropdown-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span className="selected-namespace">
              {currentNamespace || 'Select Namespace'}
            </span>
            <i className={`material-icons dropdown-icon ${isOpen ? 'open' : ''}`}>
              arrow_drop_down
            </i>
          </button>
          
          {isOpen && (
            <div className="dropdown-menu">
              {namespaceList.length > 0 ? (
                <ul className="namespace-list">
                  {namespaceList.map((namespace) => (
                    <li key={namespace}>
                      <button
                        className={`namespace-item ${currentNamespace === namespace ? 'active' : ''}`}
                        onClick={() => handleNamespaceChange(namespace)}
                      >
                        <i className="material-icons">folder</i>
                        <span>{namespace}</span>
                        {currentNamespace === namespace && (
                          <i className="material-icons check-icon">check</i>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty-state">
                  <p>No namespaces available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurrealNamespaceDropdown;
