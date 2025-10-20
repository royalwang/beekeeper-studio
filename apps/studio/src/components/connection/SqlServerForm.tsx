import React, { useState } from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';

interface SqlServerFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const SqlServerForm: React.FC<SqlServerFormProps> = ({ config, onConfigChange }) => {
  const [authType, setAuthType] = useState('default');

  const authTypes = [
    { value: 'default', name: 'Username / Password' },
    { value: 'azure', name: 'Azure Active Directory' },
    { value: 'ntlm', name: 'Windows Authentication (NTLM)' },
  ];

  const azureAuthEnabled = authType === 'azure';

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
    <div className="with-connection-type sql-server-form">
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

      {!azureAuthEnabled && (
        <CommonServerInputs config={config} onConfigChange={onConfigChange}>
          <div className="advanced-connection-settings">
            <h4 className="advanced-heading">SQL Server Options</h4>
            <div className="advanced-body">
              <div className="form-group">
                <label htmlFor="domain">
                  Domain
                  <i
                    className="material-icons"
                    title="Set 'domain' to be logged in using Windows Integrated Authentication (NTLM)"
                  >
                    help_outlined
                  </i>
                </label>
                <input
                  type="text"
                  id="domain"
                  className="form-control"
                  value={config.domain || ''}
                  onChange={(e) => handleConfigChange('domain', e.target.value)}
                  placeholder="DOMAIN"
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-group">
                  <input
                    type="checkbox"
                    name="trustServerCertificate"
                    id="trustServerCertificate"
                    checked={config.trustServerCertificate || false}
                    onChange={(e) => handleConfigChange('trustServerCertificate', e.target.checked)}
                  />
                  Trust Server Certificate?
                  <i
                    className="material-icons"
                    title="Use this for local dev servers and self-signed certificates. ssl -> rejectUnauthorized overrides this setting if ssl is enabled"
                  >
                    help_outlined
                  </i>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="instanceName">Instance Name</label>
                <input
                  type="text"
                  id="instanceName"
                  className="form-control"
                  value={config.instanceName || ''}
                  onChange={(e) => handleConfigChange('instanceName', e.target.value)}
                  placeholder="SQLEXPRESS"
                />
              </div>

              <div className="form-group">
                <label htmlFor="database">Database</label>
                <input
                  type="text"
                  id="database"
                  className="form-control"
                  value={config.defaultDatabase || ''}
                  onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
                  placeholder="master"
                />
              </div>
            </div>
          </div>
        </CommonServerInputs>
      )}

      {azureAuthEnabled && (
        <div className="azure-auth-section">
          <div className="form-group">
            <label htmlFor="azureTenantId">Azure Tenant ID</label>
            <input
              type="text"
              id="azureTenantId"
              className="form-control"
              value={config.azureTenantId || ''}
              onChange={(e) => handleConfigChange('azureTenantId', e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label htmlFor="azureClientId">Azure Client ID</label>
            <input
              type="text"
              id="azureClientId"
              className="form-control"
              value={config.azureClientId || ''}
              onChange={(e) => handleConfigChange('azureClientId', e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
          </div>

          <div className="form-group">
            <label htmlFor="azureClientSecret">Azure Client Secret</label>
            <input
              type="password"
              id="azureClientSecret"
              className="form-control"
              value={config.azureClientSecret || ''}
              onChange={(e) => handleConfigChange('azureClientSecret', e.target.value)}
              placeholder="Client secret"
            />
          </div>

          <div className="form-group">
            <label htmlFor="azureResource">Azure Resource</label>
            <input
              type="text"
              id="azureResource"
              className="form-control"
              value={config.azureResource || 'https://database.windows.net/'}
              onChange={(e) => handleConfigChange('azureResource', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.encrypt || false}
            onChange={(e) => handleOptionsChange('encrypt', e.target.checked)}
          />
          Encrypt connection
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.trustServerCertificate || false}
            onChange={(e) => handleOptionsChange('trustServerCertificate', e.target.checked)}
          />
          Trust server certificate
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableArithAbort || false}
            onChange={(e) => handleOptionsChange('enableArithAbort', e.target.checked)}
          />
          Enable ARITHABORT
        </label>
      </div>

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default SqlServerForm;
