import React from 'react';
import CommonServerInputs from './CommonServerInputs';

interface TrinoFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const TrinoForm: React.FC<TrinoFormProps> = ({ config, onConfigChange }) => {
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
    <div className="trino-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          Trino support is in alpha.{' '}
          <a 
            href="https://docs.beekeeperstudio.io/user_guide/connecting/trino"
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

      <div className="with-connection-type">
        <CommonServerInputs config={config} onConfigChange={onConfigChange} />
      </div>

      <div className="form-group">
        <label htmlFor="catalog">Catalog</label>
        <input
          type="text"
          id="catalog"
          className="form-control"
          value={config.catalog || ''}
          onChange={(e) => handleConfigChange('catalog', e.target.value)}
          placeholder="hive"
        />
        <small className="form-text text-muted">
          Trino catalog name (e.g., hive, mysql, postgresql)
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="schema">Schema</label>
        <input
          type="text"
          id="schema"
          className="form-control"
          value={config.schema || ''}
          onChange={(e) => handleConfigChange('schema', e.target.value)}
          placeholder="default"
        />
        <small className="form-text text-muted">
          Default schema to connect to
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
          placeholder="admin"
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
        <label htmlFor="source">Source</label>
        <input
          type="text"
          id="source"
          className="form-control"
          value={config.source || ''}
          onChange={(e) => handleConfigChange('source', e.target.value)}
          placeholder="beekeeper-studio"
        />
        <small className="form-text text-muted">
          Source identifier for Trino queries
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="user">User</label>
        <input
          type="text"
          id="user"
          className="form-control"
          value={config.user || ''}
          onChange={(e) => handleConfigChange('user', e.target.value)}
          placeholder="admin"
        />
        <small className="form-text text-muted">
          User for Trino session
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="clientInfo">Client Info</label>
        <input
          type="text"
          id="clientInfo"
          className="form-control"
          value={config.clientInfo || ''}
          onChange={(e) => handleConfigChange('clientInfo', e.target.value)}
          placeholder="Beekeeper Studio"
        />
        <small className="form-text text-muted">
          Client information for Trino session
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="sessionProperties">Session Properties</label>
        <textarea
          id="sessionProperties"
          className="form-control"
          rows={3}
          value={config.sessionProperties || ''}
          onChange={(e) => handleConfigChange('sessionProperties', e.target.value)}
          placeholder="query_max_run_time=1h,query_max_execution_time=1h"
        />
        <small className="form-text text-muted">
          Comma-separated session properties (key=value pairs)
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

      {config.options?.useSSL && (
        <div className="ssl-options">
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

export default TrinoForm;
