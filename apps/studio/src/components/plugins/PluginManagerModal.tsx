import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import PluginList from './PluginList';
import PluginPage from './PluginPage';
import ErrorAlert from '../common/ErrorAlert';
import { AppEvent } from '../../common/AppEvent';

interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  installed: boolean;
  updateAvailable: boolean;
  readme?: string;
}

interface PluginManagerModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const PluginManagerModal: React.FC<PluginManagerModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [selectedPluginReadme, setSelectedPluginReadme] = useState<string>('');
  const [loadingPlugins, setLoadingPlugins] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const loadPlugins = useCallback(async () => {
    setLoadingPlugins(true);
    setErrors([]);

    try {
      // Mock plugin loading
      const mockPlugins: Plugin[] = [
        {
          id: '1',
          name: 'SQL Formatter',
          version: '1.0.0',
          description: 'Format SQL queries with proper indentation',
          installed: true,
          updateAvailable: false,
        },
        {
          id: '2',
          name: 'Database Schema Visualizer',
          version: '2.1.0',
          description: 'Visualize database schemas and relationships',
          installed: false,
          updateAvailable: false,
        },
        {
          id: '3',
          name: 'Query Performance Analyzer',
          version: '1.5.0',
          description: 'Analyze query performance and suggest optimizations',
          installed: true,
          updateAvailable: true,
        },
      ];

      setPlugins(mockPlugins);
    } catch (error) {
      setErrors(['Failed to load plugins']);
    } finally {
      setLoadingPlugins(false);
    }
  }, []);

  const install = useCallback(async (plugin: Plugin) => {
    try {
      console.log('Installing plugin:', plugin.name);
      
      // Mock installation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlugins(prev => 
        prev.map(p => 
          p.id === plugin.id 
            ? { ...p, installed: true }
            : p
        )
      );
    } catch (error) {
      setErrors(['Failed to install plugin']);
    }
  }, []);

  const uninstall = useCallback(async (plugin: Plugin) => {
    try {
      console.log('Uninstalling plugin:', plugin.name);
      
      // Mock uninstallation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlugins(prev => 
        prev.map(p => 
          p.id === plugin.id 
            ? { ...p, installed: false }
            : p
        )
      );
    } catch (error) {
      setErrors(['Failed to uninstall plugin']);
    }
  }, []);

  const update = useCallback(async (plugin: Plugin) => {
    try {
      console.log('Updating plugin:', plugin.name);
      
      // Mock update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlugins(prev => 
        prev.map(p => 
          p.id === plugin.id 
            ? { ...p, updateAvailable: false, version: '2.0.0' }
            : p
        )
      );
    } catch (error) {
      setErrors(['Failed to update plugin']);
    }
  }, []);

  const checkForUpdates = useCallback(async (plugin?: Plugin) => {
    try {
      console.log('Checking for updates:', plugin?.name || 'all plugins');
      
      // Mock update check
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock some updates available
      setPlugins(prev => 
        prev.map(p => ({
          ...p,
          updateAvailable: Math.random() > 0.7,
        }))
      );
    } catch (error) {
      setErrors(['Failed to check for updates']);
    }
  }, []);

  const openPluginPage = useCallback(async (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    
    // Mock loading plugin readme
    try {
      const mockReadme = `# ${plugin.name}\n\n${plugin.description}\n\n## Installation\n\nInstall this plugin to enhance your database experience.\n\n## Usage\n\nUse this plugin to improve your workflow.`;
      setSelectedPluginReadme(mockReadme);
    } catch (error) {
      setSelectedPluginReadme('Failed to load plugin information');
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPlugin(null);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      loadPlugins();
    }
  }, [isVisible, loadPlugins]);

  useEffect(() => {
    const handlePluginManager = () => {
      // This would be triggered by the app event
      console.log('Plugin manager opened');
    };

    window.addEventListener(AppEvent.openPluginManager, handlePluginManager as EventListener);

    return () => {
      window.removeEventListener(AppEvent.openPluginManager, handlePluginManager as EventListener);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className={`vue-dialog beekeeper-modal plugin-manager-modal ${selectedPlugin ? 'plugin-page-open' : ''}`}>
      <div className="dialog-content">
        <div className="dialog-c-title">Plugins</div>
        <a 
          className="close-btn btn btn-fab" 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          <i className="material-icons">clear</i>
        </a>
        
        {loadingPlugins && (
          <div className="progress-bar" style={{ marginTop: '-5px' }}>
            <div className="progress-content">
              <div className="progress-spinner">
                <div className="spinner"></div>
              </div>
              <p>Loading plugins...</p>
            </div>
          </div>
        )}
        
        <div className="plugin-manager-content">
          <div className="plugin-list-container">
            <div className="description">
              Manage and install plugins in Beekeeper Studio.
            </div>
            {errors.length > 0 && <ErrorAlert error={errors.join(', ')} />}
            <PluginList
              plugins={plugins}
              onInstall={install}
              onUninstall={uninstall}
              onUpdate={update}
              onItemClick={openPluginPage}
              onCheckForUpdates={checkForUpdates}
            />
          </div>
          
          {selectedPlugin && (
            <PluginPage
              plugin={selectedPlugin}
              markdown={selectedPluginReadme}
              onInstall={() => install(selectedPlugin)}
              onUninstall={() => uninstall(selectedPlugin)}
              onUpdate={() => update(selectedPlugin)}
              onCheckForUpdates={() => checkForUpdates(selectedPlugin)}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default PluginManagerModal;
