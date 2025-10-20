import React, { useState, useEffect } from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';
import FilePicker from '../common/form/FilePicker';

interface SqlAnywhereFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  privacyMode?: boolean;
}

const SqlAnywhereForm: React.FC<SqlAnywhereFormProps> = ({ 
  config, 
  onConfigChange, 
  privacyMode = false 
}) => {
  const [connectionMode, setConnectionMode] = useState(config.sqlAnywhereOptions?.mode || 'server');
  const [showPassword, setShowPassword] = useState(false);

  const isServer = connectionMode === 'server';

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleSqlAnywhereOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      sqlAnywhereOptions: {
        ...config.sqlAnywhereOptions,
        [field]: value,
      },
    };
    onConfigChange(newConfig);
  };

  const handleConnectionModeChange = (mode: string) => {
    setConnectionMode(mode);
    handleSqlAnywhereOptionsChange('mode', mode);
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordInputType = showPassword ? 'text' : 'password';
  const togglePasswordIcon = showPassword ? 'visibility_off' : 'visibility';

  return (
    <div className="with-connection-type">
      <div className="form-group col">
        <label htmlFor="connectionMethod">Connection Method</label>
        <select
          name="connectionMethod"
          id="connectionMethod"
          value={connectionMode}
          onChange={(e) => handleConnectionModeChange(e.target.value)}
        >
          <option value="server">Server</option>
          <option value="file">File</option>
        </select>
      </div>

      {isServer && (
        <CommonServerInputs
          config={config}
          onConfigChange={onConfigChange}
          supportComplexSSL={false}
        >
          <div className="form-group expand">
            <label htmlFor="serverName">Server Name</label>
            <input
              type="text"
              id="serverName"
              className="form-control"
              value={privacyMode ? '••••••••' : (config.sqlAnywhereOptions?.serverName || '')}
              onChange={(e) => handleSqlAnywhereOptionsChange('serverName', e.target.value)}
              placeholder="MyServer"
              disabled={privacyMode}
            />
          </div>
        </CommonServerInputs>
      )}

      {!isServer && (
        <div className="file-connection">
          <div className="row gutter">
            <div className="col s6 form-group">
              <label htmlFor="user">User</label>
              <input
                type="text"
                id="user"
                className="form-control"
                value={privacyMode ? '••••••••' : (config.username || '')}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                placeholder="DBA"
                disabled={privacyMode}
              />
            </div>
            <div className="col s6 form-group">
              <label htmlFor="password">Password</label>
              <input
                type={togglePasswordInputType}
                id="password"
                className="password form-control"
                value={privacyMode ? '••••••••' : (config.password || '')}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="Password"
                disabled={privacyMode}
              />
              <i
                className="material-icons password-icon"
                onClick={togglePassword}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {togglePasswordIcon}
              </i>
            </div>
          </div>

          <div className="form-group expand">
            <label htmlFor="serverName">Server Name</label>
            <input
              type="text"
              id="serverName"
              className="form-control"
              value={privacyMode ? '••••••••' : (config.sqlAnywhereOptions?.serverName || '')}
              onChange={(e) => handleSqlAnywhereOptionsChange('serverName', e.target.value)}
              placeholder="MyServer"
              disabled={privacyMode}
            />
          </div>

          <div className="form-group">
            <label htmlFor="databaseFile">Database File</label>
            <FilePicker
              value={config.defaultDatabase || ''}
              onChange={(value) => handleConfigChange('defaultDatabase', value)}
              inputId="databaseFile"
              buttonText="Choose Database File"
              options={{
                properties: ['openFile'],
                filters: [
                  { name: 'SQL Anywhere Database', extensions: ['db'] },
                  { name: 'All Files', extensions: ['*'] }
                ]
              }}
            />
            <small className="form-text text-muted">
              Select the SQL Anywhere database file (.db)
            </small>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          type="text"
          id="database"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="MyDatabase"
        />
        <small className="form-text text-muted">
          Database name
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
          placeholder="DBA"
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
        <label htmlFor="connectionName">Connection Name</label>
        <input
          type="text"
          id="connectionName"
          className="form-control"
          value={config.sqlAnywhereOptions?.connectionName || ''}
          onChange={(e) => handleSqlAnywhereOptionsChange('connectionName', e.target.value)}
          placeholder="MyConnection"
        />
        <small className="form-text text-muted">
          Optional connection name
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="connectionString">Connection String</label>
        <textarea
          id="connectionString"
          className="form-control"
          rows={3}
          value={config.sqlAnywhereOptions?.connectionString || ''}
          onChange={(e) => handleSqlAnywhereOptionsChange('connectionString', e.target.value)}
          placeholder="UID=DBA;PWD=sql;ENG=MyServer;DBN=MyDatabase;"
        />
        <small className="form-text text-muted">
          Custom connection string (optional)
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.sqlAnywhereOptions?.useSSL || false}
            onChange={(e) => handleSqlAnywhereOptionsChange('useSSL', e.target.checked)}
          />
          Use SSL/TLS
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="connectionTimeout">Connection Timeout (seconds)</label>
        <input
          type="number"
          id="connectionTimeout"
          className="form-control"
          value={config.sqlAnywhereOptions?.connectionTimeout || ''}
          onChange={(e) => handleSqlAnywhereOptionsChange('connectionTimeout', parseInt(e.target.value))}
          placeholder="30"
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="queryTimeout">Query Timeout (seconds)</label>
        <input
          type="number"
          id="queryTimeout"
          className="form-control"
          value={config.sqlAnywhereOptions?.queryTimeout || ''}
          onChange={(e) => handleSqlAnywhereOptionsChange('queryTimeout', parseInt(e.target.value))}
          placeholder="300"
          min="1"
        />
      </div>

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default SqlAnywhereForm;
