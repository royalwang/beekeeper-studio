import React from 'react';

interface CommonServerInputsProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const CommonServerInputs: React.FC<CommonServerInputsProps> = ({ config, onConfigChange }) => {
  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  return (
    <div className="common-server-inputs">
      <div className="row gutter">
        <div className="form-group col s9">
          <label htmlFor="server">Host</label>
          <input
            name="server"
            type="text"
            className="form-control"
            value={config.host || ''}
            onChange={(e) => handleConfigChange('host', e.target.value)}
            placeholder="localhost"
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
            placeholder="5432"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="database">Database</label>
        <input
          name="database"
          type="text"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="database_name"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          name="username"
          type="text"
          className="form-control"
          value={config.username || ''}
          onChange={(e) => handleConfigChange('username', e.target.value)}
          placeholder="username"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          value={config.password || ''}
          onChange={(e) => handleConfigChange('password', e.target.value)}
          placeholder="password"
        />
      </div>
    </div>
  );
};

export default CommonServerInputs;
