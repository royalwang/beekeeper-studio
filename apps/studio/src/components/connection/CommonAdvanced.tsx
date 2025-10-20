import React, { useState } from 'react';

interface CommonAdvancedProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const CommonAdvanced: React.FC<CommonAdvancedProps> = ({ config, onConfigChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    <div className="common-advanced">
      <div className="advanced-header">
        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className={`material-icons ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? 'expand_less' : 'expand_more'}
          </i>
          Advanced Options
        </button>
      </div>
      
      {isExpanded && (
        <div className="advanced-content">
          <div className="form-group">
            <label htmlFor="connectionTimeout">Connection Timeout (seconds)</label>
            <input
              name="connectionTimeout"
              type="number"
              className="form-control"
              value={config.options?.connectionTimeout || ''}
              onChange={(e) => handleOptionsChange('connectionTimeout', parseInt(e.target.value))}
              placeholder="30"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="queryTimeout">Query Timeout (seconds)</label>
            <input
              name="queryTimeout"
              type="number"
              className="form-control"
              value={config.options?.queryTimeout || ''}
              onChange={(e) => handleOptionsChange('queryTimeout', parseInt(e.target.value))}
              placeholder="0 (no timeout)"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sslMode">SSL Mode</label>
            <select
              name="sslMode"
              className="form-control"
              value={config.options?.sslMode || 'prefer'}
              onChange={(e) => handleOptionsChange('sslMode', e.target.value)}
            >
              <option value="disable">Disable</option>
              <option value="allow">Allow</option>
              <option value="prefer">Prefer</option>
              <option value="require">Require</option>
              <option value="verify-ca">Verify CA</option>
              <option value="verify-full">Verify Full</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="applicationName">Application Name</label>
            <input
              name="applicationName"
              type="text"
              className="form-control"
              value={config.options?.applicationName || ''}
              onChange={(e) => handleOptionsChange('applicationName', e.target.value)}
              placeholder="Beekeeper Studio"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="extraParams">Extra Parameters</label>
            <textarea
              name="extraParams"
              className="form-control"
              rows={3}
              value={config.options?.extraParams || ''}
              onChange={(e) => handleOptionsChange('extraParams', e.target.value)}
              placeholder="key1=value1&#10;key2=value2"
            />
            <small className="form-text text-muted">
              Additional connection parameters (one per line, format: key=value)
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonAdvanced;
