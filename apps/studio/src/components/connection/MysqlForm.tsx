import React, { useState } from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';
import CommonIam from './CommonIam';

interface MysqlFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const MysqlForm: React.FC<MysqlFormProps> = ({ config, onConfigChange }) => {
  const [authType, setAuthType] = useState('password');

  const authTypes = [
    { value: 'password', name: 'Password' },
    { value: 'iam', name: 'IAM Authentication' },
    { value: 'azure', name: 'Azure Authentication' },
  ];

  const iamAuthenticationEnabled = authType === 'iam' || authType === 'azure';

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  return (
    <div className="with-connection-type">
      <div className="form-group col">
        <label htmlFor="authenticationType">Authentication Method</label>
        <select
          name="authenticationType"
          id="authenticationType"
          value={authType}
          onChange={(e) => setAuthType(e.target.value)}
        >
          {authTypes.map((t) => (
            <option key={`${t.value}-${t.name}`} value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {!iamAuthenticationEnabled && (
        <CommonServerInputs config={config} onConfigChange={onConfigChange} />
      )}

      {iamAuthenticationEnabled && (
        <div className="host-port-user-password">
          <div className="row gutter">
            <div className="form-group col s9">
              <label htmlFor="server">Host</label>
              <input
                name="server"
                type="text"
                className="form-control"
                value={config.host || ''}
                onChange={(e) => handleConfigChange('host', e.target.value)}
              />
            </div>
            <div className="form-group col s3">
              <label htmlFor="port">Port</label>
              <input
                type="number"
                className="form-control"
                name="port"
                value={config.port || ''}
                onChange={(e) => handleConfigChange('port', parseInt(e.target.value))}
              />
            </div>
          </div>
          <div className="gutter">
            <div className="form-group">
              <label htmlFor="database">Database</label>
              <input
                name="database"
                type="text"
                className="form-control"
                value={config.defaultDatabase || ''}
                onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="user">User</label>
              <input
                name="user"
                type="text"
                className="form-control"
                value={config.username || ''}
                onChange={(e) => handleConfigChange('username', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {iamAuthenticationEnabled && (
        <CommonIam authType={authType} config={config} onConfigChange={onConfigChange} />
      )}

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default MysqlForm;
