import React, { useState } from 'react';
import ToggleFormArea from '../common/ToggleFormArea';

interface BigQueryFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  isDevelopment?: boolean;
}

const BigQueryForm: React.FC<BigQueryFormProps> = ({ 
  config, 
  onConfigChange, 
  isDevelopment = false 
}) => {
  const [devMode, setDevMode] = useState(false);

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleBigQueryOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      bigQueryOptions: {
        ...config.bigQueryOptions,
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
    <div className="with-connection-type sqlite-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          BigQuery support is still in beta. Please report any problems on{' '}
          <a href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose">
            our issue tracker
          </a>
          .
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="projectId">Project ID</label>
        <input
          type="text"
          id="projectId"
          className="form-control"
          placeholder="eg: example-project"
          value={config.bigQueryOptions?.projectId || ''}
          onChange={(e) => handleBigQueryOptionsChange('projectId', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="defaultDataset">Default Dataset</label>
        <input
          type="text"
          id="defaultDataset"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="(Optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="keyFilename">Service Account Key File</label>
        <input
          type="text"
          id="keyFilename"
          className="form-control"
          value={config.bigQueryOptions?.keyFilename || ''}
          onChange={(e) => handleBigQueryOptionsChange('keyFilename', e.target.value)}
          placeholder="Path to service account key file"
        />
        <small className="form-text text-muted">
          Path to the service account key file (JSON format)
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="credentials">Credentials (JSON)</label>
        <textarea
          id="credentials"
          className="form-control"
          rows={4}
          value={config.bigQueryOptions?.credentials || ''}
          onChange={(e) => handleBigQueryOptionsChange('credentials', e.target.value)}
          placeholder="Paste your service account credentials JSON here"
        />
        <small className="form-text text-muted">
          Alternative to key file: paste your service account credentials JSON directly
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.bigQueryOptions?.useLegacySql || false}
            onChange={(e) => handleBigQueryOptionsChange('useLegacySql', e.target.checked)}
          />
          Use Legacy SQL
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.bigQueryOptions?.location || false}
            onChange={(e) => handleBigQueryOptionsChange('location', e.target.checked)}
          />
          Set Location
        </label>
      </div>

      {config.bigQueryOptions?.location && (
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            className="form-control"
            value={config.bigQueryOptions?.location || ''}
            onChange={(e) => handleBigQueryOptionsChange('location', e.target.value)}
            placeholder="US, EU, asia-northeast1, etc."
          />
        </div>
      )}

      {isDevelopment && (
        <ToggleFormArea
          expanded={devMode}
          title="[DEV MODE OVERRIDES]"
          hideToggle={true}
          headerSlot={
            <div className="switch-container">
              <input
                type="checkbox"
                checked={devMode}
                onChange={(e) => setDevMode(e.target.checked)}
                className="switch-input"
              />
              <label className="switch-label">
                <span className="switch-slider"></span>
              </label>
            </div>
          }
        >
          <div className="form-group">
            <label htmlFor="host">Host</label>
            <input
              type="text"
              id="host"
              className="form-control"
              value={config.host || ''}
              onChange={(e) => handleConfigChange('host', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="port">Port</label>
            <input
              type="text"
              id="port"
              className="form-control"
              value={config.port || ''}
              onChange={(e) => handleConfigChange('port', e.target.value)}
            />
          </div>
        </ToggleFormArea>
      )}

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.useQueryCache || false}
            onChange={(e) => handleOptionsChange('useQueryCache', e.target.checked)}
          />
          Use Query Cache
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.dryRun || false}
            onChange={(e) => handleOptionsChange('dryRun', e.target.checked)}
          />
          Dry Run (validate queries without executing)
        </label>
      </div>
    </div>
  );
};

export default BigQueryForm;
