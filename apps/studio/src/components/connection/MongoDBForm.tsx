import React from 'react';

interface MongoDBFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const MongoDBForm: React.FC<MongoDBFormProps> = ({ config, onConfigChange }) => {
  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  return (
    <div className="mongodb-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          MongoDB support is in alpha.{' '}
          <a href="https://docs.beekeeperstudio.io/user_guide/connecting/mongodb">
            Supported features
          </a>
          ,{' '}
          <a href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose">
            report an issue
          </a>
          .
        </span>
      </div>
      
      <div className="form-group">
        <label htmlFor="url" className="required">
          Database URL
        </label>
        <input
          id="url"
          type="text"
          className="form-control"
          name="url"
          value={config.url || ''}
          onChange={(e) => handleConfigChange('url', e.target.value)}
          placeholder="mongodb://localhost:27017"
        />
        <small className="form-text text-muted">
          Example: mongodb://username:password@localhost:27017/database
        </small>
      </div>
      
      <div className="form-group">
        <label htmlFor="defaultDatabase">Default Database</label>
        <input
          type="text"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="database_name"
        />
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.useSSL || false}
            onChange={(e) => {
              const newConfig = {
                ...config,
                options: {
                  ...config.options,
                  useSSL: e.target.checked
                }
              };
              onConfigChange(newConfig);
            }}
          />
          Use SSL/TLS
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.allowInvalidCertificates || false}
            onChange={(e) => {
              const newConfig = {
                ...config,
                options: {
                  ...config.options,
                  allowInvalidCertificates: e.target.checked
                }
              };
              onConfigChange(newConfig);
            }}
          />
          Allow invalid certificates
        </label>
      </div>
    </div>
  );
};

export default MongoDBForm;
