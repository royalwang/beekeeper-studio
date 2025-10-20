import React from 'react';
import FilePicker from '../common/form/FilePicker';

interface DuckDBFormProps {
  config: any;
  onConfigChange: (config: any) => void;
}

const DuckDBForm: React.FC<DuckDBFormProps> = ({ config, onConfigChange }) => {
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
    <div className="duckdb-form">
      <div className="alert alert-warning">
        <i className="material-icons">warning</i>
        <span>
          DuckDB support is still in beta. Please report any problems on{' '}
          <a href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose">
            our issue tracker
          </a>
          .
        </span>
      </div>

      <div className="form-group col">
        <label htmlFor="default-database" className="required">
          Database File
        </label>
        <FilePicker
          value={config.defaultDatabase || ''}
          onChange={(value) => handleConfigChange('defaultDatabase', value)}
          inputId="default-database"
          editable={true}
          showCreateButton={true}
          buttonText="Choose DuckDB File"
          options={{
            properties: ['openFile', 'createDirectory'],
            filters: [
              { name: 'DuckDB Database', extensions: ['db', 'duckdb'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          }}
        />
        <small className="form-text text-muted">
          Select an existing DuckDB database file or create a new one
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="accessMode">Access Mode</label>
        <select
          id="accessMode"
          className="form-control"
          value={config.options?.accessMode || 'READ_WRITE'}
          onChange={(e) => handleOptionsChange('accessMode', e.target.value)}
        >
          <option value="READ_WRITE">Read/Write</option>
          <option value="READ_ONLY">Read Only</option>
        </select>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.createIfNotExists || false}
            onChange={(e) => handleOptionsChange('createIfNotExists', e.target.checked)}
          />
          Create database if it doesn't exist
        </label>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableMemoryMap || false}
            onChange={(e) => handleOptionsChange('enableMemoryMap', e.target.checked)}
          />
          Enable Memory Mapping
        </label>
        <small className="form-text text-muted">
          Use memory mapping for better performance on large files
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="maxMemory">Max Memory (MB)</label>
        <input
          type="number"
          id="maxMemory"
          className="form-control"
          value={config.options?.maxMemory || ''}
          onChange={(e) => handleOptionsChange('maxMemory', parseInt(e.target.value))}
          placeholder="256"
          min="64"
        />
        <small className="form-text text-muted">
          Maximum memory usage for DuckDB operations
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="threads">Number of Threads</label>
        <input
          type="number"
          id="threads"
          className="form-control"
          value={config.options?.threads || ''}
          onChange={(e) => handleOptionsChange('threads', parseInt(e.target.value))}
          placeholder="4"
          min="1"
        />
        <small className="form-text text-muted">
          Number of threads for parallel processing
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableProfiling || false}
            onChange={(e) => handleOptionsChange('enableProfiling', e.target.checked)}
          />
          Enable Query Profiling
        </label>
        <small className="form-text text-muted">
          Enable detailed query performance profiling
        </small>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={config.options?.enableProgressBar || false}
            onChange={(e) => handleOptionsChange('enableProgressBar', e.target.checked)}
          />
          Show Progress Bar
        </label>
        <small className="form-text text-muted">
          Show progress bar for long-running queries
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="tempDirectory">Temporary Directory</label>
        <input
          type="text"
          id="tempDirectory"
          className="form-control"
          value={config.options?.tempDirectory || ''}
          onChange={(e) => handleOptionsChange('tempDirectory', e.target.value)}
          placeholder="System default"
        />
        <small className="form-text text-muted">
          Directory for temporary files (leave empty for system default)
        </small>
      </div>
    </div>
  );
};

export default DuckDBForm;
