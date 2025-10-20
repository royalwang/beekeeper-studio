import React, { useState } from 'react';
import FilePicker from '../common/form/FilePicker';

interface SqliteFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  isUltimate?: boolean;
}

const SqliteForm: React.FC<SqliteFormProps> = ({ config, onConfigChange, isUltimate = false }) => {
  const [extensionChosen, setExtensionChosen] = useState(false);
  const [extensions, setExtensions] = useState<string[]>([]);

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onConfigChange(newConfig);
  };

  const unloadExtension = (extension: string) => {
    setExtensions(prev => prev.filter(ext => ext !== extension));
  };

  const loadExtension = () => {
    // In real implementation, this would open a file picker for extension files
    console.log('Load extension');
  };

  return (
    <div className="sqlite-form">
      <div className="host-port-user-password">
        <div className="row gutter">
          <div className="col form-group">
            <label htmlFor="Database" className="required">
              Database File
            </label>
            <FilePicker
              value={config.defaultDatabase || ''}
              onChange={(value) => handleConfigChange('defaultDatabase', value)}
              buttonText="Choose SQLite File"
              options={{ properties: ['openFile'], filters: [
                { name: 'SQLite Database', extensions: ['db', 'sqlite', 'sqlite3'] }
              ]}}
            />
          </div>
        </div>

        {isUltimate && (
          <div className="runtime-extensions">
            <div className="form-section">
              <h4>Runtime Extensions</h4>
              <div className="alert alert-info">
                <i className="material-icons-outlined">info</i>
                <span className="flex">
                  <span className="expand">
                    This is a global setting that affects all SQLite connections.
                  </span>
                  <a href="https://docs.beekeeperstudio.io/docs/sqlite#runtime-extensions">
                    Learn more
                  </a>
                </span>
              </div>

              {extensionChosen ? (
                <div>
                  {extensions.length > 0 ? (
                    extensions.map((extension) => (
                      <div key={extension} className="alert">
                        <i className="material-icons-outlined">check</i>
                        <span className="flex flex-row">
                          <span className="expand">{extension}</span>
                          <button
                            className="a-icon"
                            onClick={() => unloadExtension(extension)}
                          >
                            <i className="material-icons">delete</i>
                          </button>
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="alert">
                      <span className="flex">
                        <span className="expand">No extensions loaded</span>
                      </span>
                    </div>
                  )}
                  
                  <div className="form-group">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={loadExtension}
                    >
                      <i className="material-icons">add</i>
                      Load Extension
                    </button>
                  </div>
                </div>
              ) : (
                <div className="alert">
                  <span className="flex">
                    <span className="expand">No extensions loaded</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={config.options?.readOnly || false}
              onChange={(e) => {
                const newConfig = {
                  ...config,
                  options: {
                    ...config.options,
                    readOnly: e.target.checked
                  }
                };
                onConfigChange(newConfig);
              }}
            />
            Read-only mode
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={config.options?.enableWAL || false}
              onChange={(e) => {
                const newConfig = {
                  ...config,
                  options: {
                    ...config.options,
                    enableWAL: e.target.checked
                  }
                };
                onConfigChange(newConfig);
              }}
            />
            Enable WAL mode
          </label>
        </div>
      </div>
    </div>
  );
};

export default SqliteForm;
