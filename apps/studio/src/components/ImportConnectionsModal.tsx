import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ErrorAlert from './common/ErrorAlert';

interface Connection {
  id: string;
  name: string;
  checked: boolean;
}

interface ImportConnectionsModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const ImportConnectionsModal: React.FC<ImportConnectionsModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadConnections = async () => {
    try {
      // Mock implementation - in a real app, this would fetch connections from the database
      const mockConnections = [
        { id: '1', name: 'Local MySQL', checked: false },
        { id: '2', name: 'Local PostgreSQL', checked: false },
        { id: '3', name: 'Local SQLite', checked: false },
      ];
      setConnections(mockConnections);
    } catch (err) {
      setError('Failed to load connections');
    }
  };

  const handleConnectionToggle = (connectionId: string) => {
    setConnections(prev => 
      prev.map(conn => 
        conn.id === connectionId 
          ? { ...conn, checked: !conn.checked }
          : conn
      )
    );
  };

  const handleImport = async () => {
    setLoading(true);
    const selectedConnections = connections.filter(conn => conn.checked);
    
    try {
      // Mock import process
      await Promise.all(selectedConnections.map(connection => {
        console.log('Importing connection:', connection.name);
        return Promise.resolve();
      }));
      onClose?.();
    } catch (err) {
      setError('Failed to import connections');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose?.();
  };

  useEffect(() => {
    if (isVisible) {
      loadConnections();
    }
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">
          Import Connections
        </div>
        <div className="dialog-c-subtitle">
          Importing a connection will copy it from your local workspace into your cloud workspace. Imported connections are private to you by default.
        </div>
        {error && <ErrorAlert error={error} />}
        <div>
          <div className="list-group">
            <div className="list-body">
              {connections.map(connection => (
                <div key={connection.id} className="list-item">
                  <label htmlFor={`c-${connection.id}`} className="checkbox-group">
                    <input
                      type="checkbox"
                      id={`c-${connection.id}`}
                      name={`c-${connection.id}`}
                      checked={connection.checked}
                      onChange={() => handleConnectionToggle(connection.id)}
                    />
                    <span>{connection.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="vue-dialog-buttons">
        <button
          className="btn btn-flat"
          onClick={handleClose}
        >
          Close
        </button>
        <button
          disabled={loading}
          className="btn btn-primary"
          onClick={handleImport}
        >
          {loading ? 'Importing...' : 'Import'}
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default ImportConnectionsModal;
