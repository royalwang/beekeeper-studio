import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TableList from './core/TableList';
import HistoryList from './core/HistoryList';
import FavoriteList from './core/FavoriteList';
import DatabaseDropdown from './core/DatabaseDropdown';
import SurrealNamespaceDropdown from './core/SurrealNamespaceDropdown';

interface CoreSidebarProps {
  onDatabaseSelected: (database: any) => void;
}

const CoreSidebar: React.FC<CoreSidebarProps> = ({ onDatabaseSelected }) => {
  const activeItem = useSelector((state: RootState) => state.sidebar.globalSidebarActiveItem);
  const connectionType = useSelector((state: RootState) => state.global.connectionType);

  const tabClasses = (tabName: string) => {
    return activeItem === tabName ? 'active' : '';
  };

  const handleNamespaceSelected = (namespace: string) => {
    // Handle namespace selection
    console.log('Namespace selected:', namespace);
  };

  return (
    <div className="sidebar-wrap row">
      <div className="tab-content">
        {/* Tables */}
        <div
          className={`tab-pane ${tabClasses('tables')}`}
          id="tab-tables"
          style={{ display: activeItem === 'tables' ? 'block' : 'none' }}
        >
          {connectionType === 'surrealdb' && (
            <SurrealNamespaceDropdown onNamespaceSelected={handleNamespaceSelected} />
          )}
          <DatabaseDropdown onDatabaseSelected={onDatabaseSelected} />
          <TableList />
        </div>

        {/* History */}
        <div
          className={`tab-pane ${tabClasses('history')}`}
          id="tab-history"
          style={{ display: activeItem === 'history' ? 'block' : 'none' }}
        >
          <HistoryList />
        </div>

        {/* Favorites */}
        <div
          className={`tab-pane ${tabClasses('queries')}`}
          id="tab-saved"
          style={{ display: activeItem === 'queries' ? 'block' : 'none' }}
        >
          <FavoriteList />
        </div>
      </div>
    </div>
  );
};

export default CoreSidebar;
