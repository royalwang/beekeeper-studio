import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import WorkspaceSidebar from './WorkspaceSidebar';
import ConnectionListItem from './connection/ConnectionListItem';
import StatusBadge from './connection/StatusBadge';
import NewWorkspaceButton from './connection/NewWorkspaceButton';
import AccountStatusButton from './connection/AccountStatusButton';

interface ConnectionSidebarProps {
  onCreateConnection: () => void;
  onSelectConnection: (connection: any) => void;
  onEditConnection: (connection: any) => void;
  onDeleteConnection: (connection: any) => void;
  onDuplicateConnection: (connection: any) => void;
  onTestConnection: (connection: any) => void;
  onConnectToDatabase: (connection: any) => void;
  onDisconnectFromDatabase: (connection: any) => void;
  onShowConnectionDetails: (connection: any) => void;
  onShowConnectionLogs: (connection: any) => void;
  onShowConnectionSettings: (connection: any) => void;
  onShowConnectionBackup: (connection: any) => void;
  onShowConnectionRestore: (connection: any) => void;
  onShowConnectionExport: (connection: any) => void;
  onShowConnectionImport: (connection: any) => void;
  onShowConnectionClone: (connection: any) => void;
  onShowConnectionDelete: (connection: any) => void;
  onPinConnection: (connection: any) => void;
  onUnpinConnection: (connection: any) => void;
  onShowWorkspaceSettings: () => void;
  onShowAccountSettings: () => void;
  className?: string;
}

const ConnectionSidebar: React.FC<ConnectionSidebarProps> = ({
  onCreateConnection,
  onSelectConnection,
  onEditConnection,
  onDeleteConnection,
  onDuplicateConnection,
  onTestConnection,
  onConnectToDatabase,
  onDisconnectFromDatabase,
  onShowConnectionDetails,
  onShowConnectionLogs,
  onShowConnectionSettings,
  onShowConnectionBackup,
  onShowConnectionRestore,
  onShowConnectionExport,
  onShowConnectionImport,
  onShowConnectionClone,
  onShowConnectionDelete,
  onPinConnection,
  onUnpinConnection,
  onShowWorkspaceSettings,
  onShowAccountSettings,
  className = '',
}) => {
  const [connFilter, setConnFilter] = useState('');
  const [showPinnedConnections, setShowPinnedConnections] = useState(true);
  const [showRecentConnections, setShowRecentConnections] = useState(true);
  const [showAllConnections, setShowAllConnections] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'lastUsed' | 'createdAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [groupBy, setGroupBy] = useState<'none' | 'database' | 'workspace'>('none');

  const pinnedConnectionListRef = useRef<HTMLDivElement>(null);
  const recentConnectionListRef = useRef<HTMLDivElement>(null);
  const allConnectionListRef = useRef<HTMLDivElement>(null);

  const connections = useSelector((state: RootState) => state.connections.connections || []);
  const pinnedConnections = useSelector((state: RootState) => state.connections.pinnedConnections || []);
  const recentConnections = useSelector((state: RootState) => state.connections.recentConnections || []);
  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const workspaces = useSelector((state: RootState) => state.workspaces.workspaces || []);

  const noPins = pinnedConnections.length === 0;
  const noRecent = recentConnections.length === 0;
  const noConnections = connections.length === 0;

  const filteredConnections = connections.filter(connection => {
    if (!connFilter) return true;
    return connection.name.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.database.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.host.toLowerCase().includes(connFilter.toLowerCase());
  });

  const filteredPinnedConnections = pinnedConnections.filter(connection => {
    if (!connFilter) return true;
    return connection.name.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.database.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.host.toLowerCase().includes(connFilter.toLowerCase());
  });

  const filteredRecentConnections = recentConnections.filter(connection => {
    if (!connFilter) return true;
    return connection.name.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.database.toLowerCase().includes(connFilter.toLowerCase()) ||
           connection.host.toLowerCase().includes(connFilter.toLowerCase());
  });

  const sortedConnections = [...filteredConnections].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedPinnedConnections = [...filteredPinnedConnections].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const sortedRecentConnections = [...filteredRecentConnections].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const groupedConnections = groupBy === 'none' ? sortedConnections : 
    sortedConnections.reduce((groups, connection) => {
      const key = groupBy === 'database' ? connection.database : connection.workspace;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(connection);
      return groups;
    }, {} as Record<string, any[]>);

  const clearFilter = () => {
    setConnFilter('');
  };

  const handleSort = (field: 'name' | 'lastUsed' | 'createdAt') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const handleGroupBy = (field: 'none' | 'database' | 'workspace') => {
    setGroupBy(field);
  };

  const getConnectionStatus = (connection: any) => {
    if (activeConnection && activeConnection.id === connection.id) {
      return 'connected';
    }
    return connection.status || 'disconnected';
  };

  const getConnectionIcon = (connection: any) => {
    const status = getConnectionStatus(connection);
    switch (status) {
      case 'connected': return 'link';
      case 'connecting': return 'sync';
      case 'disconnected': return 'link_off';
      case 'error': return 'error';
      default: return 'link_off';
    }
  };

  const getConnectionColor = (connection: any) => {
    const status = getConnectionStatus(connection);
    switch (status) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': return 'default';
      case 'error': return 'danger';
      default: return 'default';
    }
  };

  return (
    <div className={`sidebar-wrap row ${className}`}>
      <WorkspaceSidebar />

      <div className="tab-content flex-col expand">
        <div className="btn-wrap quick-connect">
          <button
            className="btn btn-flat btn-icon btn-block"
            onClick={onCreateConnection}
          >
            <i className="material-icons">add</i>
            <span>New Connection</span>
          </button>
        </div>

        <div className="fixed">
          <div className="filter">
            <div className="filter-wrap">
              <input
                className="filter-input"
                type="text"
                placeholder="Filter"
                value={connFilter}
                onChange={(e) => setConnFilter(e.target.value)}
              />
              <div className="filter-actions">
                {connFilter && (
                  <button
                    className="btn btn-flat btn-icon"
                    onClick={clearFilter}
                    title="Clear Filter"
                  >
                    <i className="material-icons">cancel</i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="connection-wrap expand flex-col">
          {/* Pinned Connections */}
          {!noPins && !connFilter && (
            <div className="list saved-connection-list expand" ref={pinnedConnectionListRef}>
              <div className="list-group">
                <div className="list-heading">
                  <div className="flex">
                    <div className="sub row flex-middle noselect">
                      <i className="material-icons">push_pin</i>
                      <span>Pinned</span>
                    </div>
                    <div className="expand" />
                    <div className="list-actions">
                      <button
                        className="btn btn-flat btn-icon"
                        onClick={() => setShowPinnedConnections(!showPinnedConnections)}
                        title={showPinnedConnections ? 'Hide Pinned' : 'Show Pinned'}
                      >
                        <i className="material-icons">
                          {showPinnedConnections ? 'expand_less' : 'expand_more'}
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
                {showPinnedConnections && (
                  <div className="list-items">
                    {sortedPinnedConnections.map((connection) => (
                      <ConnectionListItem
                        key={connection.id}
                        connection={connection}
                        isActive={activeConnection?.id === connection.id}
                        isPinned={true}
                        onSelect={() => onSelectConnection(connection)}
                        onEdit={() => onEditConnection(connection)}
                        onDelete={() => onDeleteConnection(connection)}
                        onDuplicate={() => onDuplicateConnection(connection)}
                        onTest={() => onTestConnection(connection)}
                        onConnect={() => onConnectToDatabase(connection)}
                        onDisconnect={() => onDisconnectFromDatabase(connection)}
                        onShowDetails={() => onShowConnectionDetails(connection)}
                        onShowLogs={() => onShowConnectionLogs(connection)}
                        onShowSettings={() => onShowConnectionSettings(connection)}
                        onShowBackup={() => onShowConnectionBackup(connection)}
                        onShowRestore={() => onShowConnectionRestore(connection)}
                        onShowExport={() => onShowConnectionExport(connection)}
                        onShowImport={() => onShowConnectionImport(connection)}
                        onShowClone={() => onShowConnectionClone(connection)}
                        onShowDelete={() => onShowConnectionDelete(connection)}
                        onPin={() => onPinConnection(connection)}
                        onUnpin={() => onUnpinConnection(connection)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Connections */}
          {!noRecent && !connFilter && (
            <div className="list recent-connection-list expand" ref={recentConnectionListRef}>
              <div className="list-group">
                <div className="list-heading">
                  <div className="flex">
                    <div className="sub row flex-middle noselect">
                      <i className="material-icons">history</i>
                      <span>Recent</span>
                    </div>
                    <div className="expand" />
                    <div className="list-actions">
                      <button
                        className="btn btn-flat btn-icon"
                        onClick={() => setShowRecentConnections(!showRecentConnections)}
                        title={showRecentConnections ? 'Hide Recent' : 'Show Recent'}
                      >
                        <i className="material-icons">
                          {showRecentConnections ? 'expand_less' : 'expand_more'}
                        </i>
                      </button>
                    </div>
                  </div>
                </div>
                {showRecentConnections && (
                  <div className="list-items">
                    {sortedRecentConnections.map((connection) => (
                      <ConnectionListItem
                        key={connection.id}
                        connection={connection}
                        isActive={activeConnection?.id === connection.id}
                        isPinned={false}
                        onSelect={() => onSelectConnection(connection)}
                        onEdit={() => onEditConnection(connection)}
                        onDelete={() => onDeleteConnection(connection)}
                        onDuplicate={() => onDuplicateConnection(connection)}
                        onTest={() => onTestConnection(connection)}
                        onConnect={() => onConnectToDatabase(connection)}
                        onDisconnect={() => onDisconnectFromDatabase(connection)}
                        onShowDetails={() => onShowConnectionDetails(connection)}
                        onShowLogs={() => onShowConnectionLogs(connection)}
                        onShowSettings={() => onShowConnectionSettings(connection)}
                        onShowBackup={() => onShowConnectionBackup(connection)}
                        onShowRestore={() => onShowConnectionRestore(connection)}
                        onShowExport={() => onShowConnectionExport(connection)}
                        onShowImport={() => onShowConnectionImport(connection)}
                        onShowClone={() => onShowConnectionClone(connection)}
                        onShowDelete={() => onShowConnectionDelete(connection)}
                        onPin={() => onPinConnection(connection)}
                        onUnpin={() => onUnpinConnection(connection)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* All Connections */}
          <div className="list all-connection-list expand" ref={allConnectionListRef}>
            <div className="list-group">
              <div className="list-heading">
                <div className="flex">
                  <div className="sub row flex-middle noselect">
                    <i className="material-icons">storage</i>
                    <span>All Connections</span>
                  </div>
                  <div className="expand" />
                  <div className="list-actions">
                    <div className="sort-options">
                      <select
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value as any)}
                        className="form-control"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="lastUsed">Sort by Last Used</option>
                        <option value="createdAt">Sort by Created</option>
                      </select>
                    </div>
                    <div className="group-options">
                      <select
                        value={groupBy}
                        onChange={(e) => handleGroupBy(e.target.value as any)}
                        className="form-control"
                      >
                        <option value="none">No Grouping</option>
                        <option value="database">Group by Database</option>
                        <option value="workspace">Group by Workspace</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-flat btn-icon"
                      onClick={() => setShowAllConnections(!showAllConnections)}
                      title={showAllConnections ? 'Hide All' : 'Show All'}
                    >
                      <i className="material-icons">
                        {showAllConnections ? 'expand_less' : 'expand_more'}
                      </i>
                    </button>
                  </div>
                </div>
              </div>
              {showAllConnections && (
                <div className="list-items">
                  {groupBy === 'none' ? (
                    sortedConnections.map((connection) => (
                      <ConnectionListItem
                        key={connection.id}
                        connection={connection}
                        isActive={activeConnection?.id === connection.id}
                        isPinned={pinnedConnections.some(p => p.id === connection.id)}
                        onSelect={() => onSelectConnection(connection)}
                        onEdit={() => onEditConnection(connection)}
                        onDelete={() => onDeleteConnection(connection)}
                        onDuplicate={() => onDuplicateConnection(connection)}
                        onTest={() => onTestConnection(connection)}
                        onConnect={() => onConnectToDatabase(connection)}
                        onDisconnect={() => onDisconnectFromDatabase(connection)}
                        onShowDetails={() => onShowConnectionDetails(connection)}
                        onShowLogs={() => onShowConnectionLogs(connection)}
                        onShowSettings={() => onShowConnectionSettings(connection)}
                        onShowBackup={() => onShowConnectionBackup(connection)}
                        onShowRestore={() => onShowConnectionRestore(connection)}
                        onShowExport={() => onShowConnectionExport(connection)}
                        onShowImport={() => onShowConnectionImport(connection)}
                        onShowClone={() => onShowConnectionClone(connection)}
                        onShowDelete={() => onShowConnectionDelete(connection)}
                        onPin={() => onPinConnection(connection)}
                        onUnpin={() => onUnpinConnection(connection)}
                      />
                    ))
                  ) : (
                    Object.entries(groupedConnections).map(([groupName, groupConnections]) => (
                      <div key={groupName} className="connection-group">
                        <div className="group-header">
                          <i className="material-icons">folder</i>
                          <span>{groupName}</span>
                          <span className="group-count">({groupConnections.length})</span>
                        </div>
                        <div className="group-items">
                          {groupConnections.map((connection) => (
                            <ConnectionListItem
                              key={connection.id}
                              connection={connection}
                              isActive={activeConnection?.id === connection.id}
                              isPinned={pinnedConnections.some(p => p.id === connection.id)}
                              onSelect={() => onSelectConnection(connection)}
                              onEdit={() => onEditConnection(connection)}
                              onDelete={() => onDeleteConnection(connection)}
                              onDuplicate={() => onDuplicateConnection(connection)}
                              onTest={() => onTestConnection(connection)}
                              onConnect={() => onConnectToDatabase(connection)}
                              onDisconnect={() => onDisconnectFromDatabase(connection)}
                              onShowDetails={() => onShowConnectionDetails(connection)}
                              onShowLogs={() => onShowConnectionLogs(connection)}
                              onShowSettings={() => onShowConnectionSettings(connection)}
                              onShowBackup={() => onShowConnectionBackup(connection)}
                              onShowRestore={() => onShowConnectionRestore(connection)}
                              onShowExport={() => onShowConnectionExport(connection)}
                              onShowImport={() => onShowConnectionImport(connection)}
                              onShowClone={() => onShowConnectionClone(connection)}
                              onShowDelete={() => onShowConnectionDelete(connection)}
                              onPin={() => onPinConnection(connection)}
                              onUnpin={() => onUnpinConnection(connection)}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {noConnections && (
            <div className="no-connections">
              <div className="alert alert-info">
                <i className="material-icons">info</i>
                <div>
                  <strong>No connections</strong>
                  <p>Create your first database connection to get started.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sidebar-footer">
          <div className="footer-actions">
            <NewWorkspaceButton onShowWorkspaceSettings={onShowWorkspaceSettings} />
            <AccountStatusButton onShowAccountSettings={onShowAccountSettings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSidebar;
