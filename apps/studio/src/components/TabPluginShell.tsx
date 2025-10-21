import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ResultTable from './editor/ResultTable';
import ProgressBar from './editor/ProgressBar';
import ShortcutHints from './editor/ShortcutHints';
import QueryEditorStatusBar from './editor/QueryEditorStatusBar';
import ErrorAlert from './common/ErrorAlert';
import MergeManager from './editor/MergeManager';
import IsolatedPluginView from './plugins/IsolatedPluginView';
import UpsellContent from './upsell/UpsellContent';
import { AppEvent } from '../common/AppEvent';
import { TransportOpenTab } from '../common/transport/TransportOpenTab';

interface TabPluginShellProps {
  tab: TransportOpenTab;
  active: boolean;
}

const TabPluginShell: React.FC<TabPluginShellProps> = ({ tab, active }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<any>(null);

  const [results, setResults] = useState<any[]>([]);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [split, setSplit] = useState<any>(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [executeTime, setExecuteTime] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const [focusingElement, setFocusingElement] = useState('text-editor');
  const [isTablePanelVisible, setIsTablePanelVisible] = useState(false);
  const [pluginManagerStatus, setPluginManagerStatus] = useState<'initializing' | 'ready' | 'failed-to-initialize'>('initializing');
  const [plugin, setPlugin] = useState<any>(null);
  const [url, setUrl] = useState<string>('');
  const [reload, setReload] = useState<number>(0);

  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);
  const pluginManager = useSelector((state: any) => state.plugins?.pluginManager);

  const showResultTable = results.length > 0;
  const runningText = running ? 'Running command...' : '';

  const keymap = {
    'queryEditor.switchPaneFocus': () => {
      setFocusingElement(focusingElement === 'text-editor' ? 'table' : 'text-editor');
    },
  };

  const handleRequest = useCallback(async (request: any) => {
    setRunning(true);
    setError(null);
    setInfo(null);

    try {
      // Mock plugin request handling
      console.log('Handling plugin request:', request);
      
      // Simulate request processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock result
      const mockResult = {
        request,
        result: { success: true, data: [] },
        timestamp: new Date().toISOString(),
      };
      
      setResults(prev => [...prev, mockResult]);
    } catch (err) {
      setError('Plugin request failed');
    } finally {
      setRunning(false);
    }
  }, []);

  const handleTableClick = useCallback(() => {
    setFocusingElement('table');
  }, []);

  const handleTextEditorClick = useCallback(() => {
    setFocusingElement('text-editor');
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setInfo(null);
  }, []);

  const loadPlugin = useCallback(async () => {
    if (!tab.context?.pluginId) return;

    try {
      setPluginManagerStatus('initializing');
      
      // Mock plugin loading
      const mockPlugin = {
        id: tab.context.pluginId,
        manifest: {
          name: 'Sample Plugin',
          minAppVersion: '1.0.0',
        },
        loadable: true,
      };
      
      setPlugin(mockPlugin);
      setUrl(`/plugin/${tab.context.pluginId}`);
      setPluginManagerStatus('ready');
    } catch (error) {
      setPluginManagerStatus('failed-to-initialize');
      setError('Failed to load plugin');
    }
  }, [tab.context?.pluginId]);

  useEffect(() => {
    if (active && !initialized) {
      setInitialized(true);
      loadPlugin();
    }
  }, [active, initialized, loadPlugin]);

  useEffect(() => {
    if (active) {
      setReload(prev => prev + 1);
    }
  }, [active]);

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
    <div className="plugin-shell" ref={containerRef}>
      <div className="top-panel" ref={topPanelRef}>
        {pluginManagerStatus !== 'ready' && (
          <div className={`plugin-status ${pluginManagerStatus}`}>
            {pluginManagerStatus === 'initializing' && (
              <div>Initializing plugins ...</div>
            )}
            {pluginManagerStatus === 'failed-to-initialize' && (
              <div>Failed to initialize plugin manager.</div>
            )}
          </div>
        )}
        
        {pluginManagerStatus === 'ready' && !plugin?.loadable && (
          <div className="plugin-status">
            <p>
              Plugin "{plugin?.manifest?.name}" isn't compatible with this version of Beekeeper Studio.
              It requires version {plugin?.manifest?.minAppVersion} or newer.
            </p>
            <p>To fix this:</p>
            <ol>
              <li>Upgrade your Beekeeper Studio.</li>
              <li>Or install an older plugin version manually (see{' '}
                <a 
                  href="https://docs.beekeeperstudio.io/user_guide/plugins/#installing-a-specific-plugin-version"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  instructions
                </a>).
              </li>
            </ol>
          </div>
        )}
        
        {pluginManagerStatus === 'ready' && plugin?.loadable && (
          <IsolatedPluginView
            visible={active}
            pluginId={tab.context?.pluginId || ''}
            url={url}
            reload={reload}
            onRequest={handleRequest}
            command={tab.context?.command}
            params={tab.context?.params}
          />
        )}
      </div>

      <div 
        className={`bottom-panel ${!isTablePanelVisible ? 'hidden-panel' : ''}`}
        ref={bottomPanelRef}
      >
        {showResultTable && (
          <ResultTable
            ref={tableRef}
            results={results}
            active={active}
            onTableClick={handleTableClick}
            onTextEditorClick={handleTextEditorClick}
            focusingElement={focusingElement}
          />
        )}

        {running && (
          <ProgressBar
            canCancel={true}
            message={runningText}
            onCancel={() => setRunning(false)}
          />
        )}

        {error && <ErrorAlert error={error} />}
        {info && (
          <div className="alert alert-info">
            <i className="material-icons">info</i>
            <div>{info}</div>
          </div>
        )}

        <MergeManager
          split={split}
          onSplitChange={setSplit}
          splitElements={[topPanelRef.current, bottomPanelRef.current]}
        />

        <ShortcutHints
          active={active}
          keymap={keymap}
        />
      </div>

      <QueryEditorStatusBar
        tab={tab}
        active={active}
        results={results}
        executeTime={executeTime}
        onTableClick={handleTableClick}
        onTextEditorClick={handleTextEditorClick}
        focusingElement={focusingElement}
      />
    </div>
  );
};

export default TabPluginShell;
