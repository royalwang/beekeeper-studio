import React, { useState } from 'react';

interface RedisFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  privacyMode?: boolean;
}

const RedisForm: React.FC<RedisFormProps> = ({ 
  config, 
  onConfigChange, 
  privacyMode = false 
}) => {
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordIcon = showPassword ? 'visibility_off' : 'visibility';
  const togglePasswordInputType = showPassword ? 'text' : 'password';

  return (
    <div className="redis-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          Redis support is still in beta. Please report any problems on{' '}
          <a href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose">
            our issue tracker
          </a>
          .
        </span>
      </div>

      {/* Connection Details */}
      <div className="row gutter">
        <div className="col s9 form-group">
          <label htmlFor="host">Host</label>
          <input
            type="text"
            id="host"
            className="form-control"
            value={privacyMode ? '••••••••' : (config.host || '')}
            onChange={(e) => handleConfigChange('host', e.target.value)}
            placeholder="localhost"
            disabled={privacyMode}
          />
        </div>
        <div className="col s3 form-group">
          <label htmlFor="port">Port</label>
          <input
            type="number"
            id="port"
            className="form-control"
            value={privacyMode ? '••••' : (config.port || '')}
            onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
            placeholder="6379"
            disabled={privacyMode}
          />
        </div>
      </div>

      {/* Authentication */}
      <div className="form-group form-group-password">
        <label htmlFor="password">Password (optional)</label>
        <div className="password-input-wrapper">
          <input
            type={togglePasswordInputType}
            id="password"
            className="password form-control"
            value={privacyMode ? '••••••••' : (config.password || '')}
            onChange={(e) => handleConfigChange('password', e.target.value)}
            placeholder="password"
            disabled={privacyMode}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={togglePassword}
            disabled={privacyMode}
          >
            <i className="material-icons password-icon">
              {togglePasswordIcon}
            </i>
          </button>
        </div>
      </div>

      {/* Redis Specific Options */}
      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          type="number"
          id="database"
          className="form-control"
          value={config.database || ''}
          onChange={(e) => handleConfigChange('database', parseInt(e.target.value))}
          placeholder="0"
          min="0"
          max="15"
        />
        <small className="form-text text-muted">
          Redis database number (0-15)
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="keyPrefix">Key Prefix</label>
        <input
          type="text"
          id="keyPrefix"
          className="form-control"
          value={config.keyPrefix || ''}
          onChange={(e) => handleConfigChange('keyPrefix', e.target.value)}
          placeholder="Optional key prefix"
        />
        <small className="form-text text-muted">
          Optional prefix for all keys
        </small>
      </div>

      {/* Connection Options */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.lazyConnect || false}
            onChange={(e) => handleOptionsChange('lazyConnect', e.target.checked)}
          />
          Lazy Connect
        </label>
        <small className="form-text text-muted">
          Connect only when needed
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.keepAlive || false}
            onChange={(e) => handleOptionsChange('keepAlive', e.target.checked)}
          />
          Keep Alive
        </label>
        <small className="form-text text-muted">
          Keep connection alive
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="connectTimeout">Connection Timeout (ms)</label>
        <input
          type="number"
          id="connectTimeout"
          className="form-control"
          value={config.options?.connectTimeout || ''}
          onChange={(e) => handleOptionsChange('connectTimeout', parseInt(e.target.value))}
          placeholder="10000"
          min="1000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="commandTimeout">Command Timeout (ms)</label>
        <input
          type="number"
          id="commandTimeout"
          className="form-control"
          value={config.options?.commandTimeout || ''}
          onChange={(e) => handleOptionsChange('commandTimeout', parseInt(e.target.value))}
          placeholder="5000"
          min="1000"
        />
      </div>

      {/* SSL/TLS Options */}
      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.tls || false}
            onChange={(e) => handleOptionsChange('tls', e.target.checked)}
          />
          Use TLS/SSL
        </label>
      </div>

      {config.options?.tls && (
        <div className="tls-options">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.options?.rejectUnauthorized || false}
                onChange={(e) => handleOptionsChange('rejectUnauthorized', e.target.checked)}
              />
              Reject Unauthorized Certificates
            </label>
          </div>
        </div>
      )}

      {/* Advanced Options */}
      <div className="form-group">
        <label htmlFor="family">IP Family</label>
        <select
          id="family"
          className="form-control"
          value={config.options?.family || '4'}
          onChange={(e) => handleOptionsChange('family', parseInt(e.target.value))}
        >
          <option value="4">IPv4</option>
          <option value="6">IPv6</option>
        </select>
      </div>
    </div>
  );
};

export default RedisForm;
