import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ResultTable from './editor/ResultTable';
import ProgressBar from './editor/ProgressBar';
import ShortcutHints from './editor/ShortcutHints';
import SQLTextEditor from './common/texteditor/SQLTextEditor';
import MongoShell from '@beekeeperstudio/ui-kit/vue/mongo-shell';
import QueryEditorStatusBar from './editor/QueryEditorStatusBar';
import ErrorAlert from './common/ErrorAlert';
import MergeManager from './editor/MergeManager';
import { AppEvent } from '../common/AppEvent';
import { TransportOpenTab } from '../common/transport/TransportOpenTab';
import { getVimKeymapsFromVimrc } from '../lib/editor/vim';

interface TabShellProps {
  tab: TransportOpenTab;
  active: boolean;
}

const TabShell: React.FC<TabShellProps> = ({ tab, active }) => {
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
  const [query, setQuery] = useState('');
  const [isTablePanelVisible, setIsTablePanelVisible] = useState(false);
  const [mongoOutputResult, setMongoOutputResult] = useState<any>(null);
  const [promptSymbol, setPromptSymbol] = useState('>');

  const usedConfig = useSelector((state: any) => state.connection?.usedConfig);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);
  const wrapText = useSelector((state: any) => state.settings?.wrapText);
  const userKeymap = useSelector((state: any) => state.settings?.userKeymap);
  const vimConfig = useSelector((state: any) => state.settings?.vimConfig);
  const vimKeymaps = useSelector((state: any) => state.settings?.vimKeymaps);

  const dialect = usedConfig?.connectionType || '';
  const enabled = dialect === 'mongodb';

  const editor = {
    value: query,
    onChange: setQuery,
    extensions: [], // Mock extensions
  };

  const extensions = []; // Mock extensions

  const runningText = running ? 'Running command...' : '';

  const keymap = {
    'queryEditor.switchPaneFocus': () => {
      setFocusingElement(focusingElement === 'text-editor' ? 'table' : 'text-editor');
    },
  };

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setInfo(null);
  }, []);

  const submitMongoCommand = useCallback(async (command: string) => {
    if (!command.trim()) return;

    setRunning(true);
    setError(null);
    setInfo(null);

    try {
      // Mock MongoDB command execution
      console.log('Executing MongoDB command:', command);
      
      // Simulate command execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock result
      const mockResult = {
        command: command,
        result: { success: true, data: [] },
        timestamp: new Date().toISOString(),
      };
      
      setMongoOutputResult(mockResult);
      setResults(prev => [...prev, mockResult]);
    } catch (err) {
      setError('Command execution failed');
    } finally {
      setRunning(false);
    }
  }, []);

  const updateTextEditorFocus = useCallback((focused: boolean) => {
    if (focused) {
      setFocusingElement('text-editor');
    }
  }, []);

  const handleEditorInitialized = useCallback(() => {
    setInitialized(true);
  }, []);

  const handleTableClick = useCallback(() => {
    setFocusingElement('table');
  }, []);

  const handleTextEditorClick = useCallback(() => {
    setFocusingElement('text-editor');
  }, []);

  useEffect(() => {
    if (active && !initialized) {
      setInitialized(true);
    }
  }, [active, initialized]);

  if (!enabled) {
    return (
      <div className="query-editor">
        <div className="not-supported">
          <span className="title">Shell</span>
          <div className="body">
            <p>We don't currently support a shell for {dialect}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="query-editor" ref={containerRef}>
      <div className="top-panel" ref={topPanelRef}>
        <MongoShell
          {...editor}
          vimConfig={vimConfig}
          vimKeymaps={vimKeymaps}
          keymap={userKeymap}
          output={mongoOutputResult}
          isFocused={focusingElement === 'text-editor'}
          autoFocus={true}
          extensions={extensions}
          promptSymbol={promptSymbol}
          lineWrapping={wrapText}
          onClear={clear}
          onSubmitCommand={submitMongoCommand}
          onUpdateFocus={updateTextEditorFocus}
          onBksInitialized={handleEditorInitialized}
          onBksShellRunCommand={submitMongoCommand}
        />
        <span className="expand"></span>
        <div className="toolbar text-right"></div>
      </div>

      <div className="bottom-panel" ref={bottomPanelRef}>
        {running && (
          <ProgressBar
            canCancel={false}
            message={runningText}
          />
        )}
        
        <ResultTable
          ref={tableRef}
          results={results}
          active={active}
          onTableClick={handleTableClick}
          onTextEditorClick={handleTextEditorClick}
          focusingElement={focusingElement}
        />

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

export default TabShell;
