import React from 'react';

interface QueryEditorStatusBarProps {
  query: string;
  isExecuting: boolean;
  resultsCount: number;
  hasUnsavedChanges: boolean;
}

const QueryEditorStatusBar: React.FC<QueryEditorStatusBarProps> = ({
  query,
  isExecuting,
  resultsCount,
  hasUnsavedChanges,
}) => {
  const getQueryStats = () => {
    const lines = query.split('\n').length;
    const characters = query.length;
    const words = query.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, characters, words };
  };

  const stats = getQueryStats();

  return (
    <div className="query-editor-status-bar">
      <div className="status-left">
        <div className="status-item">
          <span className="status-label">Lines:</span>
          <span className="status-value">{stats.lines}</span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Characters:</span>
          <span className="status-value">{stats.characters}</span>
        </div>
        
        <div className="status-item">
          <span className="status-label">Words:</span>
          <span className="status-value">{stats.words}</span>
        </div>
      </div>
      
      <div className="status-center">
        {isExecuting && (
          <div className="status-item executing">
            <i className="material-icons spinning">hourglass_empty</i>
            <span>Executing query...</span>
          </div>
        )}
        
        {!isExecuting && resultsCount > 0 && (
          <div className="status-item success">
            <i className="material-icons">check_circle</i>
            <span>Query executed successfully</span>
          </div>
        )}
      </div>
      
      <div className="status-right">
        {hasUnsavedChanges && (
          <div className="status-item warning">
            <i className="material-icons">edit</i>
            <span>Unsaved changes</span>
          </div>
        )}
        
        <div className="status-item">
          <span className="status-label">Results:</span>
          <span className="status-value">{resultsCount}</span>
        </div>
      </div>
    </div>
  );
};

export default QueryEditorStatusBar;
