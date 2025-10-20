import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface QueryResult {
  rows: any[];
  truncated?: boolean;
  totalRowCount?: number;
  executionTime?: number;
  affectedRows?: number;
  insertId?: number;
  changedRows?: number;
  warnings?: any[];
}

interface QueryEditorStatusBarProps {
  active: boolean;
  results: QueryResult[];
  selectedResult: number;
  onResultChange: (index: number) => void;
  onExportResults: () => void;
  onShowQueryHistory: () => void;
  onShowQueryInfo: () => void;
  onShowQueryLogs: () => void;
  onShowQuerySettings: () => void;
  onShowQueryBackup: () => void;
  onShowQueryRestore: () => void;
  onShowQueryExport: () => void;
  onShowQueryImport: () => void;
  onShowQueryClone: () => void;
  onShowQueryDelete: () => void;
  className?: string;
  children?: React.ReactNode;
}

const QueryEditorStatusBar: React.FC<QueryEditorStatusBarProps> = ({
  active,
  results,
  selectedResult,
  onResultChange,
  onExportResults,
  onShowQueryHistory,
  onShowQueryInfo,
  onShowQueryLogs,
  onShowQuerySettings,
  onShowQueryBackup,
  onShowQueryRestore,
  onShowQueryExport,
  onShowQueryImport,
  onShowQueryClone,
  onShowQueryDelete,
  className = '',
  children,
}) => {
  const [showHint, setShowHint] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const currentQuery = useSelector((state: RootState) => state.query.currentQuery);

  const result = results[selectedResult];
  const rowCount = result?.rows?.length || 0;
  const hasResults = results && results.length > 0;

  const shortNum = (num: number, decimals: number = 0) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + 'K';
    }
    return num.toString();
  };

  const pluralize = (word: string, count: number, includeCount: boolean = true) => {
    const plural = count !== 1 ? word + 's' : word;
    return includeCount ? `${count} ${plural}` : plural;
  };

  const formatExecutionTime = (time: number) => {
    if (time < 1000) {
      return `${time}ms`;
    } else if (time < 60000) {
      return `${(time / 1000).toFixed(1)}s`;
    } else {
      return `${(time / 60000).toFixed(1)}m`;
    }
  };

  const handleResultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(e.target.value);
    onResultChange(index);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleExportResults = () => {
    onExportResults();
    setShowMenu(false);
  };

  const handleShowQueryHistory = () => {
    onShowQueryHistory();
    setShowMenu(false);
  };

  const handleShowQueryInfo = () => {
    onShowQueryInfo();
    setShowMenu(false);
  };

  const handleShowQueryLogs = () => {
    onShowQueryLogs();
    setShowMenu(false);
  };

  const handleShowQuerySettings = () => {
    onShowQuerySettings();
    setShowMenu(false);
  };

  const handleShowQueryBackup = () => {
    onShowQueryBackup();
    setShowMenu(false);
  };

  const handleShowQueryRestore = () => {
    onShowQueryRestore();
    setShowMenu(false);
  };

  const handleShowQueryExport = () => {
    onShowQueryExport();
    setShowMenu(false);
  };

  const handleShowQueryImport = () => {
    onShowQueryImport();
    setShowMenu(false);
  };

  const handleShowQueryClone = () => {
    onShowQueryClone();
    setShowMenu(false);
  };

  const handleShowQueryDelete = () => {
    onShowQueryDelete();
    setShowMenu(false);
  };

  useEffect(() => {
    if (hasResults && results.length > 1) {
      setShowHint(true);
      const timer = setTimeout(() => setShowHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [hasResults, results.length]);

  return (
    <div className={`statusbar ${active ? 'active' : ''} ${!hasResults ? 'empty' : ''} query-meta ${className}`}>
      {children}

      {hasResults && (
        <div className="truncate statusbar-info">
          {results.length > 1 && (
            <span className="statusbar-item result-selector" title="Results">
              <div className="select-wrap">
                <select
                  name="resultSelector"
                  id="resultSelector"
                  value={selectedResult}
                  onChange={handleResultChange}
                  className="form-control"
                >
                  {results.map((resultOption, index) => (
                    <option key={index} value={index}>
                      Result {index + 1}: {shortNum(resultOption.rows.length, 0)} {pluralize('row', resultOption.rows.length, false)}
                    </option>
                  ))}
                </select>
              </div>
            </span>
          )}

          {rowCount > 0 && (
            <div
              className="statusbar-item row-counts"
              title={`${rowCount} Records${result?.truncated ? ' (Truncated) - get the full resultset in the Download menu' : ''}`}
            >
              <i className="material-icons">list_alt</i>
              <span className="num-rows">{rowCount}</span>
              {result?.truncated && (
                <span className="truncated-rows">/&nbsp;{result.totalRowCount}</span>
              )}
            </div>
          )}

          {result?.executionTime && (
            <div className="statusbar-item execution-time" title="Query execution time">
              <i className="material-icons">timer</i>
              <span>{formatExecutionTime(result.executionTime)}</span>
            </div>
          )}

          {result?.affectedRows && (
            <div className="statusbar-item affected-rows" title="Affected rows">
              <i className="material-icons">edit</i>
              <span>{result.affectedRows}</span>
            </div>
          )}

          {result?.insertId && (
            <div className="statusbar-item insert-id" title="Last insert ID">
              <i className="material-icons">add</i>
              <span>{result.insertId}</span>
            </div>
          )}

          {result?.changedRows && (
            <div className="statusbar-item changed-rows" title="Changed rows">
              <i className="material-icons">update</i>
              <span>{result.changedRows}</span>
            </div>
          )}

          {result?.warnings && result.warnings.length > 0 && (
            <div className="statusbar-item warnings" title={`${result.warnings.length} warnings`}>
              <i className="material-icons">warning</i>
              <span>{result.warnings.length}</span>
            </div>
          )}

          <div className="statusbar-item query-actions">
            <button
              className="btn btn-flat btn-icon"
              onClick={handleMenuToggle}
              title="Query Actions"
            >
              <i className="material-icons">more_vert</i>
            </button>

            {showMenu && (
              <div className="query-menu">
                <div className="menu-item" onClick={handleExportResults}>
                  <i className="material-icons">download</i>
                  <span>Export Results</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item" onClick={handleShowQueryHistory}>
                  <i className="material-icons">history</i>
                  <span>Query History</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryInfo}>
                  <i className="material-icons">info</i>
                  <span>Query Info</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryLogs}>
                  <i className="material-icons">description</i>
                  <span>Query Logs</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item" onClick={handleShowQuerySettings}>
                  <i className="material-icons">settings</i>
                  <span>Query Settings</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryBackup}>
                  <i className="material-icons">backup</i>
                  <span>Backup Query</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryRestore}>
                  <i className="material-icons">restore</i>
                  <span>Restore Query</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryExport}>
                  <i className="material-icons">export</i>
                  <span>Export Query</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryImport}>
                  <i className="material-icons">import</i>
                  <span>Import Query</span>
                </div>

                <div className="menu-item" onClick={handleShowQueryClone}>
                  <i className="material-icons">content_copy</i>
                  <span>Clone Query</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item danger" onClick={handleShowQueryDelete}>
                  <i className="material-icons">delete</i>
                  <span>Delete Query</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!hasResults && (
        <div className="statusbar-info">
          <div className="statusbar-item no-results">
            <i className="material-icons">info</i>
            <span>No results to display</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryEditorStatusBar;