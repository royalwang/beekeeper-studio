import React, { useMemo } from 'react';

interface ConnectionConfig {
  id: string;
  name?: string;
  connectionType: string;
  host?: string;
  port?: number | string;
  database?: string;
  filename?: string; // for sqlite/libsql
  sshBastionHost?: string;
  sshHost?: string;
  labelColor?: string;
  lastUsedAt?: string;
}

interface ConnectionListItemProps {
  connection: ConnectionConfig; // "config" in Vue
  isRecentList?: boolean;
  selectedConfig?: ConnectionConfig | null;
  showDuplicate?: boolean;
  pinned?: boolean;
  privacyMode?: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
  onPin: () => void;
  onUnpin: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

const ConnectionListItem: React.FC<ConnectionListItemProps> = ({
  connection,
  isRecentList = false,
  selectedConfig,
  showDuplicate = false,
  pinned = false,
  privacyMode = false,
  onSelect,
  onDoubleClick,
  onPin,
  onUnpin,
  onContextMenu,
}) => {
  const title = useMemo(() => {
    const parts: string[] = [];
    if (!privacyMode) {
      if (connection.sshBastionHost) parts.push(connection.sshBastionHost + ' >');
      if (connection.sshHost) parts.push(connection.sshHost + ' >');
    }
    if (connection.connectionType === 'sqlite' || connection.connectionType === 'libsql') {
      parts.push(privacyMode ? '******' : (connection.filename || ''));
    } else {
      const host = privacyMode ? '******' : (connection.host || '');
      const port = connection.port ? `:${connection.port}` : '';
      const db = connection.database ? `/${connection.database}` : '';
      parts.push(`${host}${port}${db}`);
    }
    return parts.join(' ');
  }, [connection, privacyMode]);

  const label = connection.name || (connection.connectionType === 'sqlite' || connection.connectionType === 'libsql' ? (connection.filename || 'SQLite') : (connection.host || 'Connection'));

  const classList = useMemo(() => {
    const isActive = selectedConfig ? selectedConfig.id === connection.id : false;
    return `list-item-btn ${isActive ? 'active' : ''}`;
  }, [selectedConfig, connection.id]);

  const labelColor = connection.labelColor || 'default';

  return (
    <div className="list-item" title={title} onContextMenu={(e) => { e.preventDefault(); onContextMenu?.(e); }}>
      <a href="#" className={classList} onClick={(e) => { e.preventDefault(); onSelect(); }} onDoubleClick={(e) => { e.preventDefault(); onDoubleClick(); }}>
        <span className={`connection-label connection-label-color-${labelColor}`} />
        <div className="connection-title flex-col expand">
          <div className="title">{label}</div>
          <div className="subtitle">
            {!privacyMode && connection.sshBastionHost && (
              <span className="bastion"><span className="truncate">{connection.sshBastionHost}</span>&nbsp;&gt;&nbsp;</span>
            )}
            {!privacyMode && connection.sshHost && (
              <span className="ssh"><span className="truncate">{connection.sshHost}</span>&nbsp;&gt;&nbsp;</span>
            )}
            <span className="connection">
              <span>{privacyMode ? '******' : title}</span>
            </span>
          </div>
        </div>
        <span className="badge"><span>{connection.connectionType}</span></span>
        {!isRecentList && (
          <span className={`actions ${pinned ? 'pinned' : ''}`}>
            {!pinned && (
              <span className="btn-fab pin" title="Pin" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onPin(); }}>
                <i className="bk-pin" />
              </span>
            )}
            {pinned && (
              <>
                <span className="btn-fab unpin" title="Unpin" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onUnpin(); }}>
                  <i className="material-icons">clear</i>
                </span>
                <span className="btn-fab pinned" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onUnpin(); }}>
                  <i className="bk-pin" title="Unpin" />
                  <i className="material-icons">clear</i>
                </span>
              </>
            )}
          </span>
        )}
      </a>
    </div>
  );
};

export default ConnectionListItem;
