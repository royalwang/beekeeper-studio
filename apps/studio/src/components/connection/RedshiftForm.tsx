import React, { useState, useEffect } from 'react';
import CommonServerInputs from './CommonServerInputs';
import CommonAdvanced from './CommonAdvanced';
import CommonIam from './CommonIam';
import { IamAuthTypes } from '@shared/lib/db/types';

interface RedshiftFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const RedshiftForm: React.FC<RedshiftFormProps> = ({ config, onConfigChange }) => {
  const [authType, setAuthType] = useState(config.redshiftOptions?.authType || 'default');
  const [iamAuthenticationEnabled, setIamAuthenticationEnabled] = useState(
    config.redshiftOptions?.authType?.includes?.('iam') || false
  );

  const authTypes = [
    { name: 'Username / Password', value: 'default' },
    ...IamAuthTypes,
  ];

  useEffect(() => {
    const newConfig = {
      ...config,
      redshiftOptions: {
        ...config.redshiftOptions,
        authType,
        iamAuthenticationEnabled,
      },
    };
    onConfigChange(newConfig);
  }, [authType, iamAuthenticationEnabled]);

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleRedshiftOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      redshiftOptions: {
        ...config.redshiftOptions,
        [field]: value,
      },
    };
    onConfigChange(newConfig);
  };

  const handleAuthTypeChange = (newAuthType: string) => {
    setAuthType(newAuthType);
    const isIamEnabled = newAuthType.includes('iam');
    setIamAuthenticationEnabled(isIamEnabled);
  };

  return (
    <div className="with-connection-type">
      <div className="form-group col">
        <label htmlFor="authenticationType">Authentication Method</label>
        <select
          name="authenticationType"
          id="authenticationType"
          value={authType}
          onChange={(e) => handleAuthTypeChange(e.target.value)}
        >
          {authTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <CommonServerInputs config={config} onConfigChange={onConfigChange} />

      {iamAuthenticationEnabled && (
        <CommonIam
          config={config}
          onConfigChange={onConfigChange}
          authType={authType}
        />
      )}

      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          type="text"
          id="database"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="dev"
        />
        <small className="form-text text-muted">
          Redshift database name
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
          placeholder="public"
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
        <label htmlFor="clusterId">Cluster ID</label>
        <input
          type="text"
          id="clusterId"
          className="form-control"
          value={config.redshiftOptions?.clusterId || ''}
          onChange={(e) => handleRedshiftOptionsChange('clusterId', e.target.value)}
          placeholder="my-cluster"
        />
        <small className="form-text text-muted">
          Redshift cluster identifier
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="region">Region</label>
        <input
          type="text"
          id="region"
          className="form-control"
          value={config.redshiftOptions?.region || ''}
          onChange={(e) => handleRedshiftOptionsChange('region', e.target.value)}
          placeholder="us-east-1"
        />
        <small className="form-text text-muted">
          AWS region where your Redshift cluster is located
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="workgroupName">Workgroup Name</label>
        <input
          type="text"
          id="workgroupName"
          className="form-control"
          value={config.redshiftOptions?.workgroupName || ''}
          onChange={(e) => handleRedshiftOptionsChange('workgroupName', e.target.value)}
          placeholder="default"
        />
        <small className="form-text text-muted">
          Redshift Serverless workgroup name
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.redshiftOptions?.useSSL || false}
            onChange={(e) => handleRedshiftOptionsChange('useSSL', e.target.checked)}
          />
          Use SSL/TLS
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.redshiftOptions?.requireSSL || false}
            onChange={(e) => handleRedshiftOptionsChange('requireSSL', e.target.checked)}
          />
          Require SSL
        </label>
        <small className="form-text text-muted">
          Force SSL connection
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="connectionTimeout">Connection Timeout (seconds)</label>
        <input
          type="number"
          id="connectionTimeout"
          className="form-control"
          value={config.redshiftOptions?.connectionTimeout || ''}
          onChange={(e) => handleRedshiftOptionsChange('connectionTimeout', parseInt(e.target.value))}
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
          value={config.redshiftOptions?.queryTimeout || ''}
          onChange={(e) => handleRedshiftOptionsChange('queryTimeout', parseInt(e.target.value))}
          placeholder="300"
          min="1"
        />
      </div>

      <CommonAdvanced config={config} onConfigChange={onConfigChange} />
    </div>
  );
};

export default RedshiftForm;
