import React from 'react';
import CommonServerInputs from './CommonServerInputs';

interface CassandraFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const CassandraForm: React.FC<CassandraFormProps> = ({ config, onConfigChange }) => {
  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const handleCassandraOptionsChange = (field: string, value: any) => {
    const newConfig = {
      ...config,
      cassandraOptions: {
        ...config.cassandraOptions,
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
    <div className="with-connection-type">
      <div className="alert alert-info">
        <i className="material-icons">info</i>
        <span>
          Cassandra connection form. For more information, see{' '}
          <a 
            href="https://docs.datastax.com/en/developer/nodejs-driver/4.6/api/type.ClientOptions/"
            target="_blank"
            rel="noopener noreferrer"
          >
            DataStax Node.js Driver documentation
          </a>
          .
        </span>
      </div>

      <div className="form-group">
        <label htmlFor="dataCenter">Local Data Center</label>
        <input
          type="text"
          id="dataCenter"
          name="dataCenter"
          className="form-control"
          value={config.cassandraOptions?.localDataCenter || ''}
          onChange={(e) => handleCassandraOptionsChange('localDataCenter', e.target.value)}
          placeholder="datacenter1"
        />
        <small className="form-text text-muted">
          The local data center for this connection
        </small>
      </div>

      <CommonServerInputs config={config} onConfigChange={onConfigChange} />

      <div className="form-group">
        <label htmlFor="keyspace">Keyspace</label>
        <input
          type="text"
          id="keyspace"
          className="form-control"
          value={config.defaultDatabase || ''}
          onChange={(e) => handleConfigChange('defaultDatabase', e.target.value)}
          placeholder="system"
        />
        <small className="form-text text-muted">
          Default keyspace to connect to
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
          placeholder="cassandra"
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
        <label htmlFor="contactPoints">Contact Points</label>
        <input
          type="text"
          id="contactPoints"
          className="form-control"
          value={config.cassandraOptions?.contactPoints || ''}
          onChange={(e) => handleCassandraOptionsChange('contactPoints', e.target.value)}
          placeholder="localhost:9042"
        />
        <small className="form-text text-muted">
          Comma-separated list of contact points (host:port)
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.cassandraOptions?.useCredentials || false}
            onChange={(e) => handleCassandraOptionsChange('useCredentials', e.target.checked)}
          />
          Use Credentials
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.cassandraOptions?.useSSL || false}
            onChange={(e) => handleCassandraOptionsChange('useSSL', e.target.checked)}
          />
          Use SSL/TLS
        </label>
      </div>

      {config.cassandraOptions?.useSSL && (
        <div className="ssl-options">
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={config.cassandraOptions?.rejectUnauthorized || false}
                onChange={(e) => handleCassandraOptionsChange('rejectUnauthorized', e.target.checked)}
              />
              Reject Unauthorized Certificates
            </label>
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="consistencyLevel">Consistency Level</label>
        <select
          id="consistencyLevel"
          className="form-control"
          value={config.cassandraOptions?.consistencyLevel || 'LOCAL_ONE'}
          onChange={(e) => handleCassandraOptionsChange('consistencyLevel', e.target.value)}
        >
          <option value="ANY">ANY</option>
          <option value="ONE">ONE</option>
          <option value="TWO">TWO</option>
          <option value="THREE">THREE</option>
          <option value="QUORUM">QUORUM</option>
          <option value="ALL">ALL</option>
          <option value="LOCAL_ONE">LOCAL_ONE</option>
          <option value="LOCAL_QUORUM">LOCAL_QUORUM</option>
          <option value="EACH_QUORUM">EACH_QUORUM</option>
          <option value="SERIAL">SERIAL</option>
          <option value="LOCAL_SERIAL">LOCAL_SERIAL</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="protocolVersion">Protocol Version</label>
        <select
          id="protocolVersion"
          className="form-control"
          value={config.cassandraOptions?.protocolVersion || '4'}
          onChange={(e) => handleCassandraOptionsChange('protocolVersion', e.target.value)}
        >
          <option value="1">Version 1</option>
          <option value="2">Version 2</option>
          <option value="3">Version 3</option>
          <option value="4">Version 4</option>
          <option value="5">Version 5</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="connectTimeout">Connection Timeout (ms)</label>
        <input
          type="number"
          id="connectTimeout"
          className="form-control"
          value={config.cassandraOptions?.connectTimeout || ''}
          onChange={(e) => handleCassandraOptionsChange('connectTimeout', parseInt(e.target.value))}
          placeholder="5000"
          min="1000"
        />
      </div>

      <div className="form-group">
        <label htmlFor="readTimeout">Read Timeout (ms)</label>
        <input
          type="number"
          id="readTimeout"
          className="form-control"
          value={config.cassandraOptions?.readTimeout || ''}
          onChange={(e) => handleCassandraOptionsChange('readTimeout', parseInt(e.target.value))}
          placeholder="12000"
          min="1000"
        />
      </div>
    </div>
  );
};

export default CassandraForm;
