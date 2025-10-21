import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ResultTable from './editor/ResultTable';
import ProgressBar from './editor/ProgressBar';
import ShortcutHints from './editor/ShortcutHints';
import SQLTextEditor from './common/texteditor/SQLTextEditor';
import QueryEditorStatusBar from './editor/QueryEditorStatusBar';
import ErrorAlert from './common/ErrorAlert';
import MergeManager from './editor/MergeManager';
import { AppEvent } from '../common/AppEvent';
import { TransportOpenTab } from '../common/transport/TransportOpenTab';
import { getVimKeymapsFromVimrc } from '../lib/editor/vim';

interface TabQueryEditorProps {
  query: TransportOpenTab;
  active: boolean;
  onClose?: () => void;
}

const TabQueryEditor: React.FC<TabQueryEditorProps> = ({ 
  query, 
  active, 
  onClose 
}) => {
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
  const [unsavedText, setUnsavedText] = useState(query.text || '');
  const [originalText, setOriginalText] = useState(query.text || '');
  const [remoteDeleted, setRemoteDeleted] = useState(false);
  const [isTablePanelVisible, setIsTablePanelVisible] = useState(false);

  const usedConfig = useSelector((state: any) => state.connection?.usedConfig);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);
  const wrapText = useSelector((state: any) => state.settings?.wrapText);
  const userKeymap = useSelector((state: any) => state.settings?.userKeymap);
  const vimConfig = useSelector((state: any) => state.settings?.vimConfig);
  const vimKeymaps = useSelector((state: any) => state.settings?.vimKeymaps);
  const entities = useSelector((state: any) => state.data?.entities || []);
  const defaultSchema = useSelector((state: any) => state.connection?.defaultSchema);

  const dialect = usedConfig?.connectionType || '';
  const formatterDialect = dialect;
  const identifierDialect = dialect;

  const editor = {
    value: unsavedText,
    onChange: setUnsavedText,
    readOnly: false,
    markers: [],
  };

  const editorMarkers = [];
  const paramTypes = [];
  const keybindings = [];
  const columnsGetter = () => [];

  const runningText = running ? 'Running query...' : '';

  const keymap = {
    'queryEditor.switchPaneFocus': () => {
      setFocusingElement(focusingElement === 'text-editor' ? 'table' : 'text-editor');
    },
    'queryEditor.runQuery': () => {
      runQuery();
    },
    'queryEditor.runQueryCurrent': () => {
      runQueryCurrent();
    },
  };

  const runQuery = useCallback(async () => {
    if (!unsavedText.trim()) return;

    setRunning(true);
    setError(null);
    setInfo(null);

    try {
      const startTime = Date.now();
      
      // Mock query execution
      console.log('Executing query:', unsavedText);
      
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const endTime = Date.now();
      setExecuteTime(endTime - startTime);
      
      // Mock result
      const mockResult = {
        query: unsavedText,
        rows: [
          { id: 1, name: 'Sample 1', value: 100 },
          { id: 2, name: 'Sample 2', value: 200 },
        ],
        fields: [
          { name: 'id', type: 'integer' },
          { name: 'name', type: 'text' },
          { name: 'value', type: 'integer' },
        ],
        rowCount: 2,
        executeTime: endTime - startTime,
      };
      
      setResults([mockResult]);
      setInfo(`Query executed successfully in ${executeTime}ms`);
    } catch (err) {
      setError('Query execution failed');
    } finally {
      setRunning(false);
    }
  }, [unsavedText, executeTime]);

  const runQueryCurrent = useCallback(async () => {
    // Mock implementation for running current query
    console.log('Running current query');
    await runQuery();
  }, [runQuery]);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
    setInfo(null);
  }, []);

  const handleTableClick = useCallback(() => {
    setFocusingElement('table');
  }, []);

  const handleTextEditorClick = useCallback(() => {
    setFocusingElement('text-editor');
  }, []);

  const handleChange = useCallback((newText: string) => {
    setUnsavedText(newText);
  }, []);

  const handleMergeAccepted = useCallback(() => {
    setOriginalText(unsavedText);
  }, [unsavedText]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (active && !initialized) {
      setInitialized(true);
    }
  }, [active, initialized]);

  useEffect(() => {
    setUnsavedText(query.text || '');
    setOriginalText(query.text || '');
  }, [query.text]);

  const editorComponent = SQLTextEditor;

  return (
    <div className="query-editor" ref={containerRef}>
      <div className="top-panel" ref={topPanelRef}>
        {query && query.id && (
          <MergeManager
            originalText={originalText}
            query={query}
            unsavedText={unsavedText}
            onChange={handleChange}
            onMergeAccepted={handleMergeAccepted}
          />
        )}
        
        {remoteDeleted && (
          <div className="no-content">
            <div className="alert alert-danger">
              <i className="material-icons">error_outline</i>
              <div className="alert-body">
                This query was deleted by someone else. It is no longer editable.
              </div>
              <button
                onClick={handleClose}
                className="btn btn-flat"
              >
                Close Tab
              </button>
            </div>
          </div>
        )}

        <SQLTextEditor
          value={unsavedText}
          readOnly={editor.readOnly}
          isFocused={focusingElement === 'text-editor'}
          markers={editorMarkers}
          formatterDialect={formatterDialect}
          identifierDialect={identifierDialect}
          paramTypes={paramTypes}
          keybindings={keybindings}
          vimConfig={vimConfig}
          lineWrapping={wrapText}
          keymap={userKeymap}
          vimKeymaps={vimKeymaps}
          entities={entities}
          columnsGetter={columnsGetter}
          defaultSchema={defaultSchema}
          onChange={handleChange}
          onFocus={handleTextEditorClick}
        />
        
        <span className="expand"></span>
        <div className="toolbar text-right">
          <button
            className="btn btn-primary"
            onClick={runQuery}
            disabled={running || !unsavedText.trim()}
          >
            <i className="material-icons">play_arrow</i>
            Run
          </button>
        </div>
      </div>

      <div className="bottom-panel" ref={bottomPanelRef}>
        {running && (
          <ProgressBar
            canCancel={true}
            message={runningText}
            onCancel={() => setRunning(false)}
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
        tab={query}
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

export default TabQueryEditor;