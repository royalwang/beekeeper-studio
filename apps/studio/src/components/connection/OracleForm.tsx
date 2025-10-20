import React, { useState } from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';

interface OracleFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  oracleSupported?: boolean;
}

const OracleForm: React.FC<OracleFormProps> = ({ 
  config, 
  onConfigChange, 
  oracleSupported = true 
}) => {
  const [oracleExpanded, setOracleExpanded] = useState(false);
  const [connectionMethod, setConnectionMethod] = useState('manual');

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

  const restart = () => {
    // Handle restart after configuration change
    console.log('Restart required after Oracle configuration change');
  };

  const help = "Oracle Instant Client is required for Oracle connections. Download from Oracle's website.";

  if (!oracleSupported) {
    return (
      <div className="oracle-form">
        <div className="alert alert-warning">
          <i className="material-icons">warning</i>
          <span>Oracle support is not available in this build.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="with-connection-type oracledb-form">
      <div className="advanced-connection-settings">
        <div className="flex flex-middle">
          <button
            className="btn-link btn-fab"
            onClick={() => setOracleExpanded(!oracleExpanded)}
          >
            <i className={`material-icons ${oracleExpanded ? 'expanded' : ''}`}>
              {oracleExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
            </i>
          </button>
          <h4 className="advanced-heading">Global Oracle Configuration</h4>
        </div>
        
        {oracleExpanded && (
          <div className="advanced-body">
            <div className="form-group">
              <label htmlFor="oracleInstantClient">Instant Client Location</label>
              <input
                id="oracleInstantClient"
                type="text"
                className="form-control"
                placeholder="Path to Oracle Instant Client"
                onChange={(e) => {
                  // Handle instant client path change
                  console.log('Instant client path:', e.target.value);
                  restart();
                }}
              />
              <small className="form-text text-muted">{help}</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="oracleConfigLocation">TNS_ADMIN Override</label>
              <input
                id="oracleConfigLocation"
                type="text"
                className="form-control"
                placeholder="Path to TNS configuration directory"
                onChange={(e) => {
                  // Handle TNS_ADMIN path change
                  console.log('TNS_ADMIN path:', e.target.value);
                }}
              />
              <small className="form-text text-muted">
                The directory containing tnsnames.ora, sqlnet.ora, and wallets
              </small>
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="connectionType">Connection Method</label>
        <select
          id="connectionType"
          value={connectionMethod}
          onChange={(e) => setConnectionMethod(e.target.value)}
        >
          <option value="manual">Manual Host and Port</option>
          <option value="connectionString">Connection String or Alias</option>
        </select>
      </div>

      {connectionMethod === 'manual' && (
        <div className="oracle-manual">
          <CommonServerInputs
            config={config}
            onConfigChange={onConfigChange}
            supportComplexSSL={false}
            sslHelp="Requires your wallet to be already set up in TNS_ADMIN"
          />
          
          <div className="form-group">
            <label htmlFor="serviceName">Service Name</label>
            <input
              type="text"
              className="form-control"
              id="serviceName"
              value={config.serviceName || ''}
              onChange={(e) => handleConfigChange('serviceName', e.target.value)}
              placeholder="XE"
            />
          </div>
          
          <CommonAdvanced config={config} onConfigChange={onConfigChange} />
        </div>
      )}

      {connectionMethod === 'connectionString' && (
        <div>
          <div className="form-group gutter">
            <label htmlFor="connectionString">Connection String or TNS alias</label>
            <textarea
              id="connectionString"
              name="connectionString"
              className="form-control"
              rows={5}
              value={config.options?.connectionString || ''}
              onChange={(e) => handleOptionsChange('connectionString', e.target.value)}
              placeholder="(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=localhost)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=XE)))"
            />
          </div>
          
          <div className="row gutter">
            <div className="col s6 form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={config.username || ''}
                onChange={(e) => handleConfigChange('username', e.target.value)}
              />
            </div>
            <div className="col s6 form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={config.password || ''}
                onChange={(e) => handleConfigChange('password', e.target.value)}
              />
            </div>
          </div>
          
          <CommonAdvanced config={config} onConfigChange={onConfigChange} />
        </div>
      )}

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.useWallet || false}
            onChange={(e) => handleOptionsChange('useWallet', e.target.checked)}
          />
          Use Oracle Wallet
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableStatistics || false}
            onChange={(e) => handleOptionsChange('enableStatistics', e.target.checked)}
          />
          Enable Statistics
        </label>
      </div>
    </div>
  );
};

export default OracleForm;
