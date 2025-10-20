import React, { useState } from 'react';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string | { name: string; url?: string };
  repo: string;
  installed: boolean;
  installing: boolean;
  updateAvailable: boolean;
  checkingForUpdates: boolean;
  autoUpdate: boolean;
  homepage?: string;
  license?: string;
  keywords?: string[];
  readme?: string;
}

interface PluginPageProps {
  plugin: Plugin;
  onUpdate: () => void;
  onUninstall: () => void;
  onCheckForUpdates: () => void;
  onToggleAutoUpdate: (enabled: boolean) => void;
  onEnable: () => void;
  onDisable: () => void;
  isDisabled?: boolean;
}

const PluginPage: React.FC<PluginPageProps> = ({
  plugin,
  onUpdate,
  onUninstall,
  onCheckForUpdates,
  onToggleAutoUpdate,
  onEnable,
  onDisable,
  isDisabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'readme'>('details');

  const getAuthorName = (author: string | { name: string; url?: string }) => {
    return typeof author === 'string' ? author : author.name;
  };

  const getAuthorUrl = (author: string | { name: string; url?: string }) => {
    return typeof author === 'object' ? author.url : undefined;
  };

  const toggleAutoUpdate = (enabled: boolean) => {
    onToggleAutoUpdate(enabled);
  };

  return (
    <div className="plugin-page-container">
      <div className="header">
        <div className="title">
          {plugin.name} <span className="version">{plugin.version}</span>
        </div>
        
        <div className="author-info">
          By{' '}
          {getAuthorUrl(plugin.author) ? (
            <a href={getAuthorUrl(plugin.author)} target="_blank" rel="noopener noreferrer">
              {getAuthorName(plugin.author)}
            </a>
          ) : (
            getAuthorName(plugin.author)
          )}
        </div>
        
        <a
          href={`https://github.com/${plugin.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link"
        >
          <span className="flex">
            <i className="material-icons">link</i>
            <span>&nbsp;</span>
            <span>{plugin.repo}</span>
          </span>
        </a>
        
        <div className="description">
          {plugin.description}
        </div>
        
        <div className="actions">
          {plugin.installed ? (
            <>
              {plugin.updateAvailable ? (
                <button
                  className="btn btn-primary"
                  onClick={onUpdate}
                  disabled={plugin.installing}
                >
                  {plugin.installing ? 'Updating...' : 'Update'}
                </button>
              ) : (
                <button
                  className="btn btn-flat"
                  onClick={onCheckForUpdates}
                  disabled={plugin.checkingForUpdates}
                >
                  {plugin.checkingForUpdates ? 'Checking...' : 'Check for Updates'}
                </button>
              )}
              
              <button className="btn btn-flat" onClick={onUninstall}>
                Uninstall
              </button>
              
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={plugin.autoUpdate}
                  onChange={(e) => toggleAutoUpdate(e.target.checked)}
                />
                <span>Auto-update</span>
              </label>
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={onUpdate}
              disabled={plugin.installing}
            >
              {plugin.installing ? 'Installing...' : 'Install'}
            </button>
          )}
          
          {plugin.installed && (
            <div className="plugin-status">
              {isDisabled ? (
                <button className="btn btn-flat" onClick={onEnable}>
                  Enable Plugin
                </button>
              ) : (
                <button className="btn btn-flat" onClick={onDisable}>
                  Disable Plugin
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="plugin-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`tab ${activeTab === 'readme' ? 'active' : ''}`}
            onClick={() => setActiveTab('readme')}
          >
            README
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'details' && (
            <div className="details-tab">
              <div className="detail-section">
                <h4>Plugin Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Version:</label>
                    <span>{plugin.version}</span>
                  </div>
                  
                  {plugin.license && (
                    <div className="detail-item">
                      <label>License:</label>
                      <span>{plugin.license}</span>
                    </div>
                  )}
                  
                  {plugin.homepage && (
                    <div className="detail-item">
                      <label>Homepage:</label>
                      <a href={plugin.homepage} target="_blank" rel="noopener noreferrer">
                        {plugin.homepage}
                      </a>
                    </div>
                  )}
                  
                  <div className="detail-item">
                    <label>Repository:</label>
                    <a
                      href={`https://github.com/${plugin.repo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {plugin.repo}
                    </a>
                  </div>
                </div>
              </div>

              {plugin.keywords && plugin.keywords.length > 0 && (
                <div className="detail-section">
                  <h4>Keywords</h4>
                  <div className="keywords">
                    {plugin.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h4>Description</h4>
                <p>{plugin.description}</p>
              </div>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="readme-tab">
              {plugin.readme ? (
                <div className="readme-content">
                  <pre>{plugin.readme}</pre>
                </div>
              ) : (
                <div className="no-readme">
                  <p>No README available for this plugin.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PluginPage;
