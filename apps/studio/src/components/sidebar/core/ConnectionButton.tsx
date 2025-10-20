import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface ConnectionButtonProps {
  config: any;
  connection: any;
  onDisconnect: (force?: boolean) => void;
  onEditConnection: () => void;
  onSaveConnection: () => void;
  onSyncDatabase?: () => void;
  onShowQuickSwitcher: () => void;
  onShowConnectionHistory: () => void;
  onShowConnectionInfo: () => void;
  onShowConnectionLogs: () => void;
  onShowConnectionSettings: () => void;
  onShowConnectionBackup: () => void;
  onShowConnectionRestore: () => void;
  onShowConnectionExport: () => void;
  onShowConnectionImport: () => void;
  onShowConnectionClone: () => void;
  onShowConnectionDelete: () => void;
  className?: string;
}

const ConnectionButton: React.FC<ConnectionButtonProps> = ({
  config,
  connection,
  onDisconnect,
  onEditConnection,
  onSaveConnection,
  onSyncDatabase,
  onShowQuickSwitcher,
  onShowConnectionHistory,
  onShowConnectionInfo,
  onShowConnectionLogs,
  onShowConnectionSettings,
  onShowConnectionBackup,
  onShowConnectionRestore,
  onShowConnectionExport,
  onShowConnectionImport,
  onShowConnectionClone,
  onShowConnectionDelete,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isQuickSwitcherVisible, setIsQuickSwitcherVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const privacyMode = useSelector((state: RootState) => state.settings.privacyMode || false);
  const isConnected = useSelector((state: RootState) => state.connection.isConnected || false);
  const isConnecting = useSelector((state: RootState) => state.connection.isConnecting || false);

  if (!config) {
    return null;
  }

  const connectionName = config.name || 'Unnamed Connection';
  const connectionType = config.connectionType || 'Unknown';
  const databaseVersion = connection?.version || 'Unknown Version';

  const classes = [
    'connection-button',
    isConnected ? 'connected' : 'disconnected',
    isConnecting ? 'connecting' : '',
    className,
  ].filter(Boolean).join(' ');

  const buildConnectionString = (config: any) => {
    if (privacyMode) return 'Connection details hidden by Privacy Mode';
    
    const parts = [];
    if (config.host) parts.push(`Host: ${config.host}`);
    if (config.port) parts.push(`Port: ${config.port}`);
    if (config.defaultDatabase) parts.push(`Database: ${config.defaultDatabase}`);
    if (config.username) parts.push(`User: ${config.username}`);
    
    return parts.join(', ');
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleDisconnect = () => {
    onDisconnect(false);
    setShowMenu(false);
  };

  const handleEditConnection = () => {
    if (config.id) {
      onEditConnection();
    } else {
      onSaveConnection();
    }
    setShowMenu(false);
  };

  const handleSyncDatabase = () => {
    onSyncDatabase?.();
    setShowMenu(false);
  };

  const handleShowQuickSwitcher = () => {
    onShowQuickSwitcher();
    setIsQuickSwitcherVisible(true);
    setShowMenu(false);
  };

  return (
    <div
      className={classes}
      title={privacyMode ? 'Connection details hidden by Privacy Mode' : buildConnectionString(config)}
    >
      <div className="connection-button-content">
        <button
          className="btn btn-link btn-icon"
          onClick={handleMenuToggle}
          type="button"
        >
          <i className="material-icons">link</i>
          <span className="connection-name truncate expand">
            {connectionName}
          </span>
          <span
            className="connection-type badge truncate"
            title={databaseVersion}
          >
            {connectionType}
          </span>
          <i className="material-icons dropdown-icon">arrow_drop_down</i>
        </button>

        {showMenu && (
          <div className="connection-menu" ref={menuRef}>
            <div className="menu-item" onClick={handleDisconnect}>
              <i className="material-icons">power_settings_new</i>
              <span>Disconnect</span>
            </div>

            <div className="menu-item" onClick={handleEditConnection}>
              <i className="material-icons">
                {config.id ? 'edit' : 'save'}
              </i>
              <span>
                {config.id ? 'Edit Connection' : 'Save Connection'}
              </span>
            </div>

            {connection?.connectionType === 'libsql' && connection?.server?.config?.libsqlOptions?.syncUrl && (
              <div className="menu-item" onClick={handleSyncDatabase}>
                <i className="material-icons">sync</i>
                <span>Sync Database</span>
              </div>
            )}

            <div className="menu-item" onClick={handleShowQuickSwitcher}>
              <i className="material-icons">swap_horiz</i>
              <span>Switch Connection</span>
            </div>

            <div className="menu-divider" />

            <div className="menu-item" onClick={onShowConnectionHistory}>
              <i className="material-icons">history</i>
              <span>Connection History</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionInfo}>
              <i className="material-icons">info</i>
              <span>Connection Info</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionLogs}>
              <i className="material-icons">description</i>
              <span>Connection Logs</span>
            </div>

            <div className="menu-divider" />

            <div className="menu-item" onClick={onShowConnectionSettings}>
              <i className="material-icons">settings</i>
              <span>Connection Settings</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionBackup}>
              <i className="material-icons">backup</i>
              <span>Backup Connection</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionRestore}>
              <i className="material-icons">restore</i>
              <span>Restore Connection</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionExport}>
              <i className="material-icons">export</i>
              <span>Export Connection</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionImport}>
              <i className="material-icons">import</i>
              <span>Import Connection</span>
            </div>

            <div className="menu-item" onClick={onShowConnectionClone}>
              <i className="material-icons">content_copy</i>
              <span>Clone Connection</span>
            </div>

            <div className="menu-divider" />

            <div className="menu-item danger" onClick={onShowConnectionDelete}>
              <i className="material-icons">delete</i>
              <span>Delete Connection</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionButton;
