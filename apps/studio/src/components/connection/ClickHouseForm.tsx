import React from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';

interface ClickHouseFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const ClickHouseForm: React.FC<ClickHouseFormProps> = ({ config, onConfigChange }) => {
  return (
    <div className="with-connection-type">
      <div className="alert alert-info">
        <i className="material-icons">info</i>
        <span>
          ClickHouse connection form. Note: ClickHouse client supports custom SSL certificates.
        </span>
      </div>

      <CommonServerInputs 
        config={config} 
        onConfigChange={onConfigChange}
        supportComplexSSL={false}
      />
      
      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          type="text"
          id="database"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => {
            const newConfig = { ...config, defaultDatabase: e.target.value };
            onConfigChange(newConfig);
          }}
          placeholder="default"
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={config.username || ''}
          onChange={(e) => {
            const newConfig = { ...config, username: e.target.value };
            onConfigChange(newConfig);
          }}
          placeholder="default"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={config.password || ''}
          onChange={(e) => {
            const newConfig = { ...config, password: e.target.value };
            onConfigChange(newConfig);
          }}
          placeholder="Password"
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.secure || false}
            onChange={(e) => {
              const newConfig = {
                ...config,
                options: {
                  ...config.options,
                  secure: e.target.checked
                }
              };
              onConfigChange(newConfig);
            }}
          />
          Use Secure Connection (HTTPS)
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.verify || false}
            onChange={(e) => {
              const newConfig = {
                ...config,
                options: {
                  ...config.options,
                  verify: e.target.checked
                }
              };
              onConfigChange(newConfig);
            }}
          />
          Verify SSL Certificate
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="sessionId">Session ID</label>
        <input
          type="text"
          id="sessionId"
          className="form-control"
          value={config.options?.sessionId || ''}
          onChange={(e) => {
            const newConfig = {
              ...config,
              options: {
                ...config.options,
                sessionId: e.target.value
              }
            };
            onConfigChange(newConfig);
          }}
          placeholder="Optional session ID"
        />
      </div>

      <div className="form-group">
        <label htmlFor="queryId">Query ID</label>
        <input
          type="text"
          id="queryId"
          className="form-control"
          value={config.options?.queryId || ''}
          onChange={(e) => {
            const newConfig = {
              ...config,
              options: {
                ...config.options,
                queryId: e.target.value
              }
            };
            onConfigChange(newConfig);
          }}
          placeholder="Optional query ID"
        />
      </div>

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default ClickHouseForm;
