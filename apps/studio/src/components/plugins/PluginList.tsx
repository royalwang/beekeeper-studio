import React from 'react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  author: string | { name: string };
  installed: boolean;
  installing: boolean;
  updateAvailable: boolean;
  loadable: boolean;
  minAppVersion?: string;
  error?: string;
}

interface PluginListProps {
  plugins: Plugin[];
  onInstall: (plugin: Plugin) => void;
  onUpdate: (plugin: Plugin) => void;
  onUninstall: (plugin: Plugin) => void;
  onEnable: (plugin: Plugin) => void;
  onDisable: (plugin: Plugin) => void;
  onItemClick: (plugin: Plugin) => void;
  disabledPlugins?: Record<string, { disabled: boolean }>;
}

const PluginList: React.FC<PluginListProps> = ({
  plugins,
  onInstall,
  onUpdate,
  onUninstall,
  onEnable,
  onDisable,
  onItemClick,
  disabledPlugins = {},
}) => {
  const handleItemClick = (plugin: Plugin) => {
    onItemClick(plugin);
  };

  const handleKeyDown = (e: React.KeyboardEvent, plugin: Plugin) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleItemClick(plugin);
    }
  };

  const getAuthorName = (author: string | { name: string }) => {
    return typeof author === 'string' ? author : author.name;
  };

  const isPluginDisabled = (pluginId: string) => {
    return disabledPlugins[pluginId]?.disabled || false;
  };

  const getErrorMessage = (error: string) => {
    if (error.includes('not compatible')) {
      return error.split("Please upgrade")[0];
    }
    return error;
  };

  return (
    <ul className="plugin-list">
      {plugins.map((plugin) => (
        <li
          key={plugin.id}
          className="item"
          tabIndex={0}
          onClick={() => handleItemClick(plugin)}
          onKeyDown={(e) => handleKeyDown(e, plugin)}
        >
          <div className="info">
            <div className="title">
              {plugin.name}
              {isPluginDisabled(plugin.id) && (
                <span className="badge">disabled</span>
              )}
            </div>
            
            {!plugin.loadable && plugin.installed && (
              <div className="status-error">
                This plugin requires version {plugin.minAppVersion} or newer.
              </div>
            )}
            
            {plugin.error && (
              <div className="status-error">
                {getErrorMessage(plugin.error)}
              </div>
            )}
            
            <div className="description">
              {plugin.description}
            </div>
            
            <div className="author">
              {getAuthorName(plugin.author)}
            </div>
          </div>
          
          <div className="actions">
            {plugin.installed && plugin.updateAvailable && (
              <button
                className="btn btn-flat"
                disabled={plugin.installing}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdate(plugin);
                }}
              >
                {plugin.installing ? 'Updating...' : 'Update'}
              </button>
            )}
            
            {!plugin.installed && (
              <button
                className="btn btn-flat"
                disabled={plugin.installing}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onInstall(plugin);
                }}
              >
                {plugin.installing ? 'Installing...' : 'Install'}
              </button>
            )}
            
            {plugin.installed && (
              <>
                {isPluginDisabled(plugin.id) ? (
                  <button
                    className="btn btn-flat"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEnable(plugin);
                    }}
                  >
                    Enable
                  </button>
                ) : (
                  <button
                    className="btn btn-flat"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDisable(plugin);
                    }}
                  >
                    Disable
                  </button>
                )}
                
                <button
                  className="btn btn-flat btn-danger"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onUninstall(plugin);
                  }}
                >
                  Uninstall
                </button>
              </>
            )}
          </div>
        </li>
      ))}
      
      {plugins.length === 0 && (
        <li className="no-plugins">
          <div className="empty-state">
            <i className="material-icons">extension</i>
            <h3>No Plugins Available</h3>
            <p>No plugins are currently available for installation.</p>
          </div>
        </li>
      )}
    </ul>
  );
};

export default PluginList;
