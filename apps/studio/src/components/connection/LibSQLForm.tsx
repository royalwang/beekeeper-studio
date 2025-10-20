import React, { useState } from 'react';
import FilePicker from '../common/form/FilePicker';

interface LibSQLFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const LibSQLForm: React.FC<LibSQLFormProps> = ({ config, onConfigChange }) => {
  const [connectionMode, setConnectionMode] = useState(config.libsqlOptions?.mode || 'url');

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleLibSQLOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      libsqlOptions: {
        ...config.libsqlOptions,
        [field]: value
      }
    };
    onConfigChange(newConfig);
  };

  const handleOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      options: {
        ...config.options,
        [field]: value
      }
    };
    onConfigChange(newConfig);
  };

  return (
    <div className="libsql-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          LibSQL support is still in beta. Please report any problems on{' '}
          <a href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose">
            our issue tracker
          </a>
          .
        </span>
      </div>

      <div className="form-group col">
        <label htmlFor="connection-mode">Connection Mode</label>
        <select
          id="connection-mode"
          value={connectionMode}
          onChange={(e) => {
            setConnectionMode(e.target.value);
            handleLibSQLOptionsChange('mode', e.target.value);
          }}
        >
          <option value="url">URL</option>
          <option value="file">File</option>
        </select>
      </div>

      {connectionMode === 'url' && (
        <>
          <div className="form-group col">
            <label htmlFor="url" className="required">
              Database URL
              <i
                className="material-icons"
                title="Supports libsql:, http:, https:, ws:, wss: and file: URL. Pass :memory: or leave it empty to open an in-memory database."
              >
                help_outlined
              </i>
            </label>
            <input
              id="url"
              className="form-control"
              type="text"
              name="url"
              value={config.defaultDatabase || ''}
              onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
              placeholder="libsql://your-database.turso.io"
            />
            <small className="form-text text-muted">
              Supports libsql:, http:, https:, ws:, wss: and file: URL. 
              Pass :memory: or leave it empty to open an in-memory database.
            </small>
          </div>

          <div className="form-group col">
            <label htmlFor="auth-token" className="required">
              Authentication Token
            </label>
            <textarea
              id="auth-token"
              className="form-control"
              rows={3}
              value={config.libsqlOptions?.authToken || ''}
              onChange={(e) => handleLibSQLOptionsChange('authToken', e.target.value)}
              placeholder="Paste your authentication token here"
            />
            <small className="form-text text-muted">
              Required for remote LibSQL connections
            </small>
          </div>
        </>
      )}

      {connectionMode === 'file' && (
        <div className="form-group col">
          <label htmlFor="database-file" className="required">
            Database File
          </label>
          <FilePicker
            value={config.defaultDatabase || ''}
            onChange={(value) => handleConfigChange('defaultDatabase', value)}
            inputId="database-file"
            buttonText="Choose LibSQL File"
            options={{
              properties: ['openFile'],
              filters: [
                { name: 'LibSQL Database', extensions: ['db', 'sqlite', 'sqlite3'] },
                { name: 'All Files', extensions: ['*'] }
              ]
            }}
          />
          <small className="form-text text-muted">
            Select a local LibSQL database file
          </small>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="syncUrl">Sync URL</label>
        <input
          type="text"
          id="syncUrl"
          className="form-control"
          value={config.libsqlOptions?.syncUrl || ''}
          onChange={(e) => handleLibSQLOptionsChange('syncUrl', e.target.value)}
          placeholder="https://your-sync-server.com"
        />
        <small className="form-text text-muted">
          Optional sync URL for remote synchronization
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="syncInterval">Sync Interval (seconds)</label>
        <input
          type="number"
          id="syncInterval"
          className="form-control"
          value={config.libsqlOptions?.syncInterval || ''}
          onChange={(e) => handleLibSQLOptionsChange('syncInterval', parseInt(e.target.value))}
          placeholder="30"
          min="1"
        />
        <small className="form-text text-muted">
          How often to sync with the remote database
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.libsqlOptions?.readYourWrites || false}
            onChange={(e) => handleLibSQLOptionsChange('readYourWrites', e.target.checked)}
          />
          Read Your Writes
        </label>
        <small className="form-text text-muted">
          Ensure reads reflect your own writes
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.libsqlOptions?.encryptionKey || false}
            onChange={(e) => handleLibSQLOptionsChange('encryptionKey', e.target.checked)}
          />
          Use Encryption
        </label>
        <small className="form-text text-muted">
          Encrypt the local database file
        </small>
      </div>

      {config.libsqlOptions?.encryptionKey && (
        <div className="form-group">
          <label htmlFor="encryptionKey">Encryption Key</label>
          <input
            type="password"
            id="encryptionKey"
            className="form-control"
            value={config.libsqlOptions?.encryptionKey || ''}
            onChange={(e) => handleLibSQLOptionsChange('encryptionKey', e.target.value)}
            placeholder="Enter encryption key"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="maxConnections">Max Connections</label>
        <input
          type="number"
          id="maxConnections"
          className="form-control"
          value={config.libsqlOptions?.maxConnections || ''}
          onChange={(e) => handleLibSQLOptionsChange('maxConnections', parseInt(e.target.value))}
          placeholder="10"
          min="1"
        />
        <small className="form-text text-muted">
          Maximum number of concurrent connections
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableForeignKeys || false}
            onChange={(e) => handleOptionsChange('enableForeignKeys', e.target.checked)}
          />
          Enable Foreign Keys
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableWAL || false}
            onChange={(e) => handleOptionsChange('enableWAL', e.target.checked)}
          />
          Enable WAL Mode
        </label>
        <small className="form-text text-muted">
          Write-Ahead Logging for better performance
        </small>
      </div>
    </div>
  );
};

export default LibSQLForm;
