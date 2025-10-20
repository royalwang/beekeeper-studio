import React from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';

interface FirebirdFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const FirebirdForm: React.FC<FirebirdFormProps> = ({ config, onConfigChange }) => {
  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
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
    <div className="with-connection-type">
      <div className="alert alert-warning">
        <i className="material-icons-outlined">warning</i>
        <span>
          Firebird 3+ wire protocol is not supported yet. You'll need to enable legacy authentication. 
          Please refer to the{' '}
          <a 
            href="https://docs.beekeeperstudio.io/user_guide/connecting/firebird/"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentation
          </a>
          .
        </span>
      </div>

      <CommonServerInputs 
        config={config} 
        onConfigChange={onConfigChange}
        headerSlot={
          <div className="alert alert-info">
            <i className="material-icons">info</i>
            <span>
              Firebird connection requires specific configuration. 
              Make sure to enable legacy authentication on your Firebird server.
            </span>
          </div>
        }
      />

      <div className="form-group">
        <label htmlFor="database">Database File</label>
        <input
          type="text"
          id="database"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="C:\\path\\to\\database.fdb"
        />
        <small className="form-text text-muted">
          Full path to the Firebird database file (.fdb)
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={config.username || ''}
          onChange={(e) => handleConfigChange('username', e.target.value)}
          placeholder="SYSDBA"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={config.password || ''}
          onChange={(e) => handleConfigChange('password', e.target.value)}
          placeholder="Password"
        />
      </div>

      <div className="form-group">
        <label htmlFor="role">Role</label>
        <input
          type="text"
          id="role"
          className="form-control"
          value={config.role || ''}
          onChange={(e) => handleConfigChange('role', e.target.value)}
          placeholder="Optional role"
        />
        <small className="form-text text-muted">
          Optional role for the connection
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="charset">Character Set</label>
        <select
          id="charset"
          className="form-control"
          value={config.options?.charset || 'UTF8'}
          onChange={(e) => handleOptionsChange('charset', e.target.value)}
        >
          <option value="UTF8">UTF8</option>
          <option value="UTF16">UTF16</option>
          <option value="ISO8859_1">ISO8859_1</option>
          <option value="WIN1252">WIN1252</option>
          <option value="WIN1250">WIN1250</option>
          <option value="WIN1251">WIN1251</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.legacyAuth || false}
            onChange={(e) => handleOptionsChange('legacyAuth', e.target.checked)}
          />
          Use Legacy Authentication
        </label>
        <small className="form-text text-muted">
          Required for Firebird 3+ connections
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.wireCrypt || false}
            onChange={(e) => handleOptionsChange('wireCrypt', e.target.checked)}
          />
          Enable Wire Crypt
        </label>
        <small className="form-text text-muted">
          Encrypt data transmission
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="dialect">SQL Dialect</label>
        <select
          id="dialect"
          className="form-control"
          value={config.options?.dialect || '3'}
          onChange={(e) => handleOptionsChange('dialect', e.target.value)}
        >
          <option value="1">Dialect 1</option>
          <option value="2">Dialect 2</option>
          <option value="3">Dialect 3</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="connectionTimeout">Connection Timeout (seconds)</label>
        <input
          type="number"
          id="connectionTimeout"
          className="form-control"
          value={config.options?.connectionTimeout || ''}
          onChange={(e) => handleOptionsChange('connectionTimeout', parseInt(e.target.value))}
          placeholder="10"
          min="1"
        />
      </div>

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default FirebirdForm;
