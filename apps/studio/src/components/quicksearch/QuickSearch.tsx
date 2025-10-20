import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import TableIcon from '../common/TableIcon';
import { isMac } from '@shared/lib/utils/platform';

interface QuickSearchProps {
  onSelectItem: (item: any) => void;
  onClose: () => void;
  onOpenTable: (table: any) => void;
  onOpenQuery: (query: any) => void;
  onOpenConnection: (connection: any) => void;
  onOpenTableProperties: (table: any) => void;
  onOpenTableData: (table: any) => void;
  onOpenTableStructure: (table: any) => void;
  onOpenTableIndexes: (table: any) => void;
  onOpenTableRelations: (table: any) => void;
  onOpenTableTriggers: (table: any) => void;
  onOpenTableSchema: (table: any) => void;
  onOpenTablePartitions: (table: any) => void;
  onOpenTableSchemaValidation: (table: any) => void;
  onOpenTableStatistics: (table: any) => void;
  onOpenTableUsage: (table: any) => void;
  onOpenTableDependencies: (table: any) => void;
  onOpenTablePermissions: (table: any) => void;
  onOpenTableBackup: (table: any) => void;
  onOpenTableRestore: (table: any) => void;
  onOpenTableExport: (table: any) => void;
  onOpenTableImport: (table: any) => void;
  onOpenTableClone: (table: any) => void;
  onOpenTableDelete: (table: any) => void;
  className?: string;
}

interface SearchResult {
  id: string;
  name: string;
  type: 'table' | 'query' | 'connection' | 'table-properties' | 'table-data' | 'table-structure' | 'table-indexes' | 'table-relations' | 'table-triggers' | 'table-schema' | 'table-partitions' | 'table-schema-validation' | 'table-statistics' | 'table-usage' | 'table-dependencies' | 'table-permissions' | 'table-backup' | 'table-restore' | 'table-export' | 'table-import' | 'table-clone' | 'table-delete';
  description?: string;
  path?: string;
  icon?: string;
  color?: string;
  metadata?: Record<string, any>;
}

const QuickSearch: React.FC<QuickSearchProps> = ({
  onSelectItem,
  onClose,
  onOpenTable,
  onOpenQuery,
  onOpenConnection,
  onOpenTableProperties,
  onOpenTableData,
  onOpenTableStructure,
  onOpenTableIndexes,
  onOpenTableRelations,
  onOpenTableTriggers,
  onOpenTableSchema,
  onOpenTablePartitions,
  onOpenTableSchemaValidation,
  onOpenTableStatistics,
  onOpenTableUsage,
  onOpenTableDependencies,
  onOpenTablePermissions,
  onOpenTableBackup,
  onOpenTableRestore,
  onOpenTableExport,
  onOpenTableImport,
  onOpenTableClone,
  onOpenTableDelete,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [historyResults, setHistoryResults] = useState<SearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const searchBoxRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const tables = useSelector((state: RootState) => state.sidebar.tables || []);
  const queries = useSelector((state: RootState) => state.tabs.queries || []);
  const connections = useSelector((state: RootState) => state.connections.connections || []);
  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);

  const keymap = {
    'escape': onClose,
    'ctrl+p': () => {},
    'meta+p': () => {},
    'arrowup': () => {
      setSelectedItem(prev => Math.max(0, prev - 1));
    },
    'arrowdown': () => {
      setSelectedItem(prev => Math.min(results.length - 1, prev + 1));
    },
    'enter': () => {
      if (results.length > 0) {
        handleItemClick(results[selectedItem]);
      }
    },
  };

  useEffect(() => {
    if (searchBoxRef.current) {
      searchBoxRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    } else {
      setResults([]);
      loadHistoryResults();
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (key === 'escape') {
        e.preventDefault();
        onClose();
      } else if (isCtrl && key === 'p') {
        e.preventDefault();
        // Already open
      } else if (key === 'arrowup') {
        e.preventDefault();
        setSelectedItem(prev => Math.max(0, prev - 1));
      } else if (key === 'arrowdown') {
        e.preventDefault();
        setSelectedItem(prev => Math.min(results.length - 1, prev + 1));
      } else if (key === 'enter') {
        e.preventDefault();
        if (results.length > 0) {
          handleItemClick(results[selectedItem]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedItem]);

  const performSearch = (term: string) => {
    const searchResults: SearchResult[] = [];
    const lowerTerm = term.toLowerCase();

    // Search tables
    tables.forEach(table => {
      if (table.name.toLowerCase().includes(lowerTerm) ||
          table.schema?.toLowerCase().includes(lowerTerm)) {
        searchResults.push({
          id: `table-${table.id}`,
          name: table.name,
          type: 'table',
          description: `Table in ${table.schema || 'default'}`,
          path: `${table.schema || 'default'}.${table.name}`,
          metadata: { table },
        });
      }
    });

    // Search queries
    queries.forEach(query => {
      if (query.title?.toLowerCase().includes(lowerTerm) ||
          query.text?.toLowerCase().includes(lowerTerm)) {
        searchResults.push({
          id: `query-${query.id}`,
          name: query.title || 'Untitled Query',
          type: 'query',
          description: 'Saved Query',
          path: 'Queries',
          metadata: { query },
        });
      }
    });

    // Search connections
    connections.forEach(connection => {
      if (connection.name.toLowerCase().includes(lowerTerm) ||
          connection.database?.toLowerCase().includes(lowerTerm) ||
          connection.host?.toLowerCase().includes(lowerTerm)) {
        searchResults.push({
          id: `connection-${connection.id}`,
          name: connection.name,
          type: 'connection',
          description: `${connection.database} on ${connection.host}`,
          path: 'Connections',
          metadata: { connection },
        });
      }
    });

    setResults(searchResults);
    setSelectedItem(0);
  };

  const loadHistoryResults = () => {
    // Placeholder for actual history loading
    const mockHistory: SearchResult[] = [
      {
        id: 'history-1',
        name: 'users',
        type: 'table',
        description: 'Table in public',
        path: 'public.users',
        metadata: {},
      },
      {
        id: 'history-2',
        name: 'SELECT * FROM users',
        type: 'query',
        description: 'Saved Query',
        path: 'Queries',
        metadata: {},
      },
    ];
    setHistoryResults(mockHistory);
  };

  const handleItemClick = (item: SearchResult) => {
    onSelectItem(item);
    
    switch (item.type) {
      case 'table':
        onOpenTable(item.metadata?.table);
        break;
      case 'query':
        onOpenQuery(item.metadata?.query);
        break;
      case 'connection':
        onOpenConnection(item.metadata?.connection);
        break;
      case 'table-properties':
        onOpenTableProperties(item.metadata?.table);
        break;
      case 'table-data':
        onOpenTableData(item.metadata?.table);
        break;
      case 'table-structure':
        onOpenTableStructure(item.metadata?.table);
        break;
      case 'table-indexes':
        onOpenTableIndexes(item.metadata?.table);
        break;
      case 'table-relations':
        onOpenTableRelations(item.metadata?.table);
        break;
      case 'table-triggers':
        onOpenTableTriggers(item.metadata?.table);
        break;
      case 'table-schema':
        onOpenTableSchema(item.metadata?.table);
        break;
      case 'table-partitions':
        onOpenTablePartitions(item.metadata?.table);
        break;
      case 'table-schema-validation':
        onOpenTableSchemaValidation(item.metadata?.table);
        break;
      case 'table-statistics':
        onOpenTableStatistics(item.metadata?.table);
        break;
      case 'table-usage':
        onOpenTableUsage(item.metadata?.table);
        break;
      case 'table-dependencies':
        onOpenTableDependencies(item.metadata?.table);
        break;
      case 'table-permissions':
        onOpenTablePermissions(item.metadata?.table);
        break;
      case 'table-backup':
        onOpenTableBackup(item.metadata?.table);
        break;
      case 'table-restore':
        onOpenTableRestore(item.metadata?.table);
        break;
      case 'table-export':
        onOpenTableExport(item.metadata?.table);
        break;
      case 'table-import':
        onOpenTableImport(item.metadata?.table);
        break;
      case 'table-clone':
        onOpenTableClone(item.metadata?.table);
        break;
      case 'table-delete':
        onOpenTableDelete(item.metadata?.table);
        break;
    }
    
    onClose();
  };

  const handleHistoryClick = (item: SearchResult) => {
    handleItemClick(item);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const getItemIcon = (item: SearchResult) => {
    switch (item.type) {
      case 'table':
        return 'storage';
      case 'query':
        return 'code';
      case 'connection':
        return 'link';
      case 'table-properties':
        return 'construction';
      case 'table-data':
        return 'table_chart';
      case 'table-structure':
        return 'schema';
      case 'table-indexes':
        return 'storage';
      case 'table-relations':
        return 'link';
      case 'table-triggers':
        return 'flash_on';
      case 'table-schema':
        return 'schema';
      case 'table-partitions':
        return 'view_module';
      case 'table-schema-validation':
        return 'verified';
      case 'table-statistics':
        return 'analytics';
      case 'table-usage':
        return 'trending_up';
      case 'table-dependencies':
        return 'link';
      case 'table-permissions':
        return 'security';
      case 'table-backup':
        return 'backup';
      case 'table-restore':
        return 'restore';
      case 'table-export':
        return 'export';
      case 'table-import':
        return 'import';
      case 'table-clone':
        return 'content_copy';
      case 'table-delete':
        return 'delete';
      default:
        return 'help';
    }
  };

  const getItemColor = (item: SearchResult) => {
    switch (item.type) {
      case 'table':
        return 'primary';
      case 'query':
        return 'success';
      case 'connection':
        return 'info';
      case 'table-properties':
        return 'warning';
      case 'table-data':
        return 'primary';
      case 'table-structure':
        return 'secondary';
      case 'table-indexes':
        return 'info';
      case 'table-relations':
        return 'success';
      case 'table-triggers':
        return 'warning';
      case 'table-schema':
        return 'secondary';
      case 'table-partitions':
        return 'info';
      case 'table-schema-validation':
        return 'success';
      case 'table-statistics':
        return 'primary';
      case 'table-usage':
        return 'info';
      case 'table-dependencies':
        return 'success';
      case 'table-permissions':
        return 'warning';
      case 'table-backup':
        return 'secondary';
      case 'table-restore':
        return 'info';
      case 'table-export':
        return 'success';
      case 'table-import':
        return 'primary';
      case 'table-clone':
        return 'secondary';
      case 'table-delete':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getShortcutText = () => {
    return isMac ? '⌘P' : 'Ctrl+P';
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`quicksearch ${className}`}>
      <div className="quicksearch-bg" onClick={onClose} />
      <div className="quicksearch-wrap" ref={menuRef}>
        <div className="form-group">
          <input
            type="text"
            ref={searchBoxRef}
            placeholder="Quick Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <span className="clear" onClick={clearSearch}>
              <i className="material-icons">cancel</i>
            </span>
          )}
        </div>

        {!results.length && searchTerm && (
          <ul className="results no-results">
            <li>No Results</li>
          </ul>
        )}

        {!results.length && !searchTerm && historyResults.length > 0 && (
          <ul className="results">
            {historyResults.map((item, idx) => (
              <li
                key={item.id}
                className={`result-item ${idx === selectedItem ? 'selected' : ''}`}
                onClick={() => handleHistoryClick(item)}
              >
                {item.type === 'table' ? (
                  <TableIcon table={item.metadata?.table} />
                ) : (
                  <i className={`material-icons item-icon ${getItemColor(item)}`}>
                    {getItemIcon(item)}
                  </i>
                )}
                <div className="result-content">
                  <div className="result-name">{item.name}</div>
                  <div className="result-description">{item.description}</div>
                  <div className="result-path">{item.path}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {results.length > 0 && (
          <ul className="results">
            {results.map((item, idx) => (
              <li
                key={item.id}
                className={`result-item ${idx === selectedItem ? 'selected' : ''}`}
                onClick={() => handleItemClick(item)}
              >
                {item.type === 'table' ? (
                  <TableIcon table={item.metadata?.table} />
                ) : (
                  <i className={`material-icons item-icon ${getItemColor(item)}`}>
                    {getItemIcon(item)}
                  </i>
                )}
                <div className="result-content">
                  <div className="result-name">{item.name}</div>
                  <div className="result-description">{item.description}</div>
                  <div className="result-path">{item.path}</div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="quicksearch-footer">
          <div className="shortcuts">
            <span className="shortcut">
              <kbd>{getShortcutText()}</kbd>
              <span>Quick Search</span>
            </span>
            <span className="shortcut">
              <kbd>↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="shortcut">
              <kbd>Enter</kbd>
              <span>Select</span>
            </span>
            <span className="shortcut">
              <kbd>Esc</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSearch;