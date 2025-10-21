import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import IsolatedPluginView from './plugins/IsolatedPluginView';
import UpsellContent from './upsell/UpsellContent';
import { TransportPluginTab } from '../common/transport/TransportOpenTab';
import { OnViewRequestListenerParams } from '../services/plugin/types';

interface TabPluginBaseProps {
  tab: TransportPluginTab;
  active: boolean;
  reload?: number;
}

const TabPluginBase: React.FC<TabPluginBaseProps> = ({ 
  tab, 
  active, 
  reload = 0 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string>('');
  const [plugin, setPlugin] = useState<any>(null);

  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);
  const pluginManager = useSelector((state: any) => state.plugins?.pluginManager);

  const handleRequest = useCallback(async (params: OnViewRequestListenerParams) => {
    try {
      // Mock plugin request handling
      console.log('Handling plugin request:', params);
      
      // Simulate request processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      return { success: true, data: [] };
    } catch (error) {
      console.error('Plugin request failed:', error);
      return { success: false, error: 'Request failed' };
    }
  }, []);

  const loadPlugin = useCallback(async () => {
    if (!tab.context?.pluginId) return;

    try {
      // Mock plugin loading
      const mockPlugin = {
        id: tab.context.pluginId,
        manifest: {
          name: 'Sample Plugin',
          capabilities: {
            views: [
              {
                id: tab.context.pluginTabTypeId,
                entry: '/index.html',
              }
            ]
          }
        }
      };
      
      setPlugin(mockPlugin);
      
      // Mock URL building
      const mockUrl = `/plugin/${tab.context.pluginId}/index.html`;
      setUrl(mockUrl);
    } catch (error) {
      console.error('Failed to load plugin:', error);
    }
  }, [tab.context?.pluginId, tab.context?.pluginTabTypeId]);

  useEffect(() => {
    if (active) {
      loadPlugin();
    }
  }, [active, loadPlugin]);

  useEffect(() => {
    if (active && reload > 0) {
      // Handle reload
      loadPlugin();
    }
  }, [active, reload, loadPlugin]);

  // Check if this is a community plugin that requires upgrade
  const isCommunityPlugin = isCommunity && tab.context?.pluginId === 'bks-ai-shell';

  if (isCommunityPlugin) {
    return (
      <div className="tab-upsell-wrapper">
        <UpsellContent />
      </div>
    );
  }

  return (
    <div className="plugin-base" ref={containerRef}>
      <IsolatedPluginView
        visible={active}
        pluginId={tab.context?.pluginId || ''}
        url={url}
        reload={reload}
        onRequest={handleRequest}
        command={tab.context?.command}
        params={tab.context?.params}
      />
    </div>
  );
};

export default TabPluginBase;
