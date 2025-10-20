import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import MergeManager from './editor/MergeManager';
import ResultTable from './editor/ResultTable';
import QueryEditorStatusBar from './editor/QueryEditorStatusBar';

interface TabQueryEditorProps {
  query?: any;
  onClose?: () => void;
}

const TabQueryEditor: React.FC<TabQueryEditorProps> = ({ query, onClose }) => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  
  const [unsavedText, setUnsavedText] = useState(query?.text || '');
  const [originalText, setOriginalText] = useState(query?.text || '');
  const [remoteDeleted, setRemoteDeleted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const defaultSchema = useSelector((state: RootState) => state.global.defaultSchema);
  const wrapText = useSelector((state: RootState) => state.settings.wrapText);
  const vimConfig = useSelector((state: RootState) => state.settings.vimConfig);

  const keymap = {
    'general.executeQuery': () => executeQuery(),
    'general.executeCurrentQuery': () => executeCurrentQuery(),
    'general.formatQuery': () => formatQuery(),
    'general.saveQuery': () => saveQuery(),
  };

  const handleTextChange = (newText: string) => {
    setUnsavedText(newText);
    // Auto-save logic would go here
  };

  const executeQuery = async () => {
    if (!unsavedText.trim()) return;
    
    setIsExecuting(true);
    setError(null);
    
    try {
      // Mock query execution - in real implementation, this would call the backend
      console.log('Executing query:', unsavedText);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock results
      const mockResults = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ];
      
      setResults(mockResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const executeCurrentQuery = () => {
    // Execute only the current query (if multiple queries in editor)
    executeQuery();
  };

  const formatQuery = () => {
    // Format the SQL query
    console.log('Formatting query');
    // In real implementation, this would use a SQL formatter
  };

  const saveQuery = () => {
    if (query) {
      // Save the query
      console.log('Saving query:', unsavedText);
      setOriginalText(unsavedText);
    }
  };

  const handleMergeAccepted = () => {
    setOriginalText(query?.text || '');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          executeQuery();
          break;
        case 's':
          e.preventDefault();
          saveQuery();
          break;
        case 'k':
          e.preventDefault();
          formatQuery();
          break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="query-editor"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div ref={topPanelRef} className="top-panel">
        {query && query.id && (
          <MergeManager
            originalText={originalText}
            query={query}
            unsavedText={unsavedText}
            onChange={handleTextChange}
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
                onClick={onClose}
                className="btn btn-flat"
              >
                Close Tab
              </button>
            </div>
          </div>
        )}
        
        <div className="editor-container">
          <div className="editor-toolbar">
            <div className="toolbar-group">
              <button
                className="btn btn-primary"
                onClick={executeQuery}
                disabled={isExecuting || !unsavedText.trim()}
                title="Execute Query (Ctrl+Enter)"
              >
                <i className="material-icons">
                  {isExecuting ? 'hourglass_empty' : 'play_arrow'}
                </i>
                {isExecuting ? 'Executing...' : 'Execute'}
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={formatQuery}
                disabled={!unsavedText.trim()}
                title="Format Query (Ctrl+K)"
              >
                <i className="material-icons">format_align_left</i>
                Format
              </button>
              
              {query && (
                <button
                  className="btn btn-secondary"
                  onClick={saveQuery}
                  disabled={unsavedText === originalText}
                  title="Save Query (Ctrl+S)"
                >
                  <i className="material-icons">save</i>
                  Save
                </button>
              )}
            </div>
          </div>
          
          <div className="editor-content">
            <textarea
              className="sql-editor"
              value={unsavedText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Enter your SQL query here..."
              style={{
                width: '100%',
                height: '300px',
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                resize: 'vertical',
                whiteSpace: wrapText ? 'normal' : 'pre',
              }}
            />
          </div>
        </div>
      </div>
      
      <div className="bottom-panel">
        {error && (
          <div className="error-panel">
            <div className="alert alert-danger">
              <i className="material-icons">error</i>
              <div className="alert-body">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}
        
        {results.length > 0 && (
          <div className="results-panel">
            <ResultTable results={results} />
          </div>
        )}
        
        <QueryEditorStatusBar
          query={unsavedText}
          isExecuting={isExecuting}
          resultsCount={results.length}
          hasUnsavedChanges={unsavedText !== originalText}
        />
      </div>
    </div>
  );
};

export default TabQueryEditor;
