import React, { useState } from 'react';

interface SurrealDBFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  privacyMode?: boolean;
}

const SurrealDBForm: React.FC<SurrealDBFormProps> = ({ 
  config, 
  onConfigChange, 
  privacyMode = false 
}) => {
  const [protocol, setProtocol] = useState(config.surrealDbOptions?.protocol || '');
  const [authType, setAuthType] = useState(config.surrealDbOptions?.authType || '');

  const protocols = ['ws', 'wss', 'http', 'https'];
  const authTypes = [
    { value: 'none', name: 'None' },
    { value: 'basic', name: 'Basic Authentication' },
    { value: 'token', name: 'Token Authentication' },
    { value: 'jwt', name: 'JWT Authentication' },
  ];

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleSurrealDbOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      surrealDbOptions: {
        ...config.surrealDbOptions,
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
    <div className="with-connection-type">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          SurrealDB support is in alpha.{' '}
          <a 
            href="https://docs.beekeeperstudio.io/user_guide/connecting/surrealdb"
            target="_blank"
            rel="noopener noreferrer"
          >
            Supported features
          </a>
          ,{' '}
          <a 
            href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
          >
            report an issue
          </a>
          .
        </span>
      </div>

      <div className="host-port-user-password">
        <div className="form-group col">
          <label htmlFor="protocol">Protocol</label>
          <select
            name="protocol"
            id="protocolSelect"
            value={protocol}
            onChange={(e) => {
              setProtocol(e.target.value);
              handleSurrealDbOptionsChange('protocol', e.target.value);
            }}
          >
            <option value="" disabled hidden>Select a protocol...</option>
            {protocols.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="row gutter">
          <div className="form-group col s9">
            <label htmlFor="server">Host</label>
            <input
              type="text"
              id="server"
              className="form-control"
              value={privacyMode ? '••••••••' : (config.host || '')}
              onChange={(e) => handleConfigChange('host', e.target.value)}
              placeholder="localhost"
              disabled={privacyMode}
            />
          </div>
          <div className="form-group col s3">
            <label htmlFor="port">Port</label>
            <input
              type="number"
              id="port"
              className="form-control"
              value={privacyMode ? '••••' : (config.port || '')}
              onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
              placeholder="8000"
              disabled={privacyMode}
            />
          </div>
        </div>
      </div>

      <div className="form-group col">
        <label htmlFor="authenticationType">Authentication Method</label>
        <select
          name="authMethod"
          id="surrealAuthMethod"
          value={authType}
          onChange={(e) => {
            setAuthType(e.target.value);
            handleSurrealDbOptionsChange('authType', e.target.value);
          }}
        >
          <option value="" disabled hidden>Select...</option>
          {authTypes.map((t) => (
            <option key={`${t.value}-${t.name}`} value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {authType === 'basic' && (
        <div className="auth-fields">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={privacyMode ? '••••••••' : (config.username || '')}
              onChange={(e) => handleConfigChange('username', e.target.value)}
              placeholder="root"
              disabled={privacyMode}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={privacyMode ? '••••••••' : (config.password || '')}
              onChange={(e) => handleConfigChange('password', e.target.value)}
              placeholder="Password"
              disabled={privacyMode}
            />
          </div>
        </div>
      )}

      {authType === 'token' && (
        <div className="auth-fields">
          <div className="form-group">
            <label htmlFor="token">Token</label>
            <textarea
              id="token"
              className="form-control"
              rows={3}
              value={privacyMode ? '••••••••' : (config.surrealDbOptions?.token || '')}
              onChange={(e) => handleSurrealDbOptionsChange('token', e.target.value)}
              placeholder="Paste your authentication token here"
              disabled={privacyMode}
            />
          </div>
        </div>
      )}

      {authType === 'jwt' && (
        <div className="auth-fields">
          <div className="form-group">
            <label htmlFor="jwt">JWT Token</label>
            <textarea
              id="jwt"
              className="form-control"
              rows={3}
              value={privacyMode ? '••••••••' : (config.surrealDbOptions?.jwt || '')}
              onChange={(e) => handleSurrealDbOptionsChange('jwt', e.target.value)}
              placeholder="Paste your JWT token here"
              disabled={privacyMode}
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="namespace">Namespace</label>
        <input
          type="text"
          id="namespace"
          className="form-control"
          value={config.surrealDbOptions?.namespace || ''}
          onChange={(e) => handleSurrealDbOptionsChange('namespace', e.target.value)}
          placeholder="test"
        />
        <small className="form-text text-muted">
          SurrealDB namespace
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          type="text"
          id="database"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="test"
        />
        <small className="form-text text-muted">
          SurrealDB database name
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="scope">Scope</label>
        <input
          type="text"
          id="scope"
          className="form-control"
          value={config.surrealDbOptions?.scope || ''}
          onChange={(e) => handleSurrealDbOptionsChange('scope', e.target.value)}
          placeholder="user"
        />
        <small className="form-text text-muted">
          SurrealDB scope for authentication
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.useSSL || false}
            onChange={(e) => handleOptionsChange('useSSL', e.target.checked)}
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
          value={config.options?.connectionTimeout || ''}
          onChange={(e) => handleOptionsChange('connectionTimeout', parseInt(e.target.value))}
          placeholder="30"
          min="1"
        />
      </div>

      <div className="form-group">
        <label htmlFor="requestTimeout">Request Timeout (seconds)</label>
        <input
          type="number"
          id="requestTimeout"
          className="form-control"
          value={config.options?.requestTimeout || ''}
          onChange={(e) => handleOptionsChange('requestTimeout', parseInt(e.target.value))}
          placeholder="60"
          min="1"
        />
      </div>
    </div>
  );
};

export default SurrealDBForm;
