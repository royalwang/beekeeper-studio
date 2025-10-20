import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ErrorAlert from '../common/ErrorAlert';
import { isMac } from '@shared/lib/utils/platform';

interface TableSchemaProps {
  table: any;
  onRefresh: () => void;
  onAddColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (column: any) => void;
  onDropColumn: (column: any) => void;
  onShowColumnDetails: (column: any) => void;
  onShowColumnSQL: (column: any) => void;
  onShowColumnProperties: (column: any) => void;
  onShowColumnStatistics: (column: any) => void;
  onShowColumnUsage: (column: any) => void;
  onShowColumnDependencies: (column: any) => void;
  onShowColumnPermissions: (column: any) => void;
  onShowColumnBackup: (column: any) => void;
  onShowColumnRestore: (column: any) => void;
  onShowColumnExport: (column: any) => void;
  onShowColumnImport: (column: any) => void;
  onShowColumnClone: (column: any) => void;
  onShowColumnDelete: (column: any) => void;
  onShowColumnConstraints: (column: any) => void;
  onShowColumnIndexes: (column: any) => void;
  onShowColumnRelations: (column: any) => void;
  onShowColumnTriggers: (column: any) => void;
  onShowColumnSchema: (column: any) => void;
  onShowColumnPartitions: (column: any) => void;
  onShowColumnSchemaValidation: (column: any) => void;
  onShowColumnStatistics: (column: any) => void;
  onShowColumnUsage: (column: any) => void;
  onShowColumnDependencies: (column: any) => void;
  onShowColumnPermissions: (column: any) => void;
  onShowColumnBackup: (column: any) => void;
  onShowColumnRestore: (column: any) => void;
  onShowColumnExport: (column: any) => void;
  onShowColumnImport: (column: any) => void;
  onShowColumnClone: (column: any) => void;
  onShowColumnDelete: (column: any) => void;
  editable?: boolean;
  className?: string;
}

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  primaryKey: boolean;
  unique: boolean;
  autoIncrement: boolean;
  comment?: string;
  length?: number;
  precision?: number;
  scale?: number;
  collation?: string;
  charset?: string;
  properties: Record<string, any>;
  createdAt: string;
  modifiedAt: string;
  position: number;
  constraints: string[];
  indexes: string[];
  relations: string[];
  triggers: string[];
}

const TableSchema: React.FC<TableSchemaProps> = ({
  table,
  onRefresh,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onDropColumn,
  onShowColumnDetails,
  onShowColumnSQL,
  onShowColumnProperties,
  onShowColumnStatistics,
  onShowColumnUsage,
  onShowColumnDependencies,
  onShowColumnPermissions,
  onShowColumnBackup,
  onShowColumnRestore,
  onShowColumnExport,
  onShowColumnImport,
  onShowColumnClone,
  onShowColumnDelete,
  onShowColumnConstraints,
  onShowColumnIndexes,
  onShowColumnRelations,
  onShowColumnTriggers,
  onShowColumnSchema,
  onShowColumnPartitions,
  onShowColumnSchemaValidation,
  editable = false,
  className = '',
}) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('position');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterNullable, setFilterNullable] = useState<string>('all');
  const [filterPrimaryKey, setFilterPrimaryKey] = useState<string>('all');
  const [filterUnique, setFilterUnique] = useState<string>('all');
  const [filterAutoIncrement, setFilterAutoIncrement] = useState<string>('all');

  const tableSchemaRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const hotkeys = {
    'ctrl+r': onRefresh,
    'meta+r': onRefresh,
    'f5': onRefresh,
    'ctrl+n': onAddColumn,
    'meta+n': onAddColumn,
    'delete': () => {
      if (selectedColumns.length > 0) {
        handleBulkDelete();
      }
    },
    'escape': () => {
      setSelectedColumns([]);
      setShowMenu(null);
    },
  };

  useEffect(() => {
    if (table) {
      loadColumns();
    }
  }, [table]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;
      
      if (isCtrl && key === 'r') {
        e.preventDefault();
        onRefresh();
      } else if (isCtrl && key === 'n') {
        e.preventDefault();
        onAddColumn();
      } else if (key === 'f5') {
        e.preventDefault();
        onRefresh();
      } else if (key === 'delete' && selectedColumns.length > 0) {
        e.preventDefault();
        handleBulkDelete();
      } else if (key === 'escape') {
        setSelectedColumns([]);
        setShowMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedColumns]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(null);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const loadColumns = async () => {
    if (!table) return;

    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual column loading logic
      const mockColumns: Column[] = [
        {
          id: '1',
          name: 'id',
          type: 'INTEGER',
          nullable: false,
          defaultValue: undefined,
          primaryKey: true,
          unique: true,
          autoIncrement: true,
          comment: 'Primary key',
          length: undefined,
          precision: undefined,
          scale: undefined,
          collation: undefined,
          charset: undefined,
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          position: 1,
          constraints: ['PRIMARY KEY'],
          indexes: ['PRIMARY'],
          relations: [],
          triggers: [],
        },
        {
          id: '2',
          name: 'name',
          type: 'VARCHAR',
          nullable: false,
          defaultValue: undefined,
          primaryKey: false,
          unique: false,
          autoIncrement: false,
          comment: 'User name',
          length: 255,
          precision: undefined,
          scale: undefined,
          collation: 'utf8_general_ci',
          charset: 'utf8',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          position: 2,
          constraints: ['NOT NULL'],
          indexes: [],
          relations: [],
          triggers: [],
        },
        {
          id: '3',
          name: 'email',
          type: 'VARCHAR',
          nullable: false,
          defaultValue: undefined,
          primaryKey: false,
          unique: true,
          autoIncrement: false,
          comment: 'User email',
          length: 255,
          precision: undefined,
          scale: undefined,
          collation: 'utf8_general_ci',
          charset: 'utf8',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          position: 3,
          constraints: ['NOT NULL', 'UNIQUE'],
          indexes: ['idx_email'],
          relations: [],
          triggers: [],
        },
      ];
      setColumns(mockColumns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load columns');
    } finally {
      setLoading(false);
    }
  };

  const handleAddColumn = () => {
    onAddColumn();
  };

  const handleEditColumn = (column: Column) => {
    onEditColumn(column);
  };

  const handleDeleteColumn = (column: Column) => {
    onDeleteColumn(column);
  };

  const handleDropColumn = (column: Column) => {
    onDropColumn(column);
  };

  const handleBulkDelete = () => {
    if (selectedColumns.length > 0) {
      const selectedColumnObjects = columns.filter(col => selectedColumns.includes(col.id));
      selectedColumnObjects.forEach(column => onDeleteColumn(column));
      setSelectedColumns([]);
    }
  };

  const handleBulkDrop = () => {
    if (selectedColumns.length > 0) {
      const selectedColumnObjects = columns.filter(col => selectedColumns.includes(col.id));
      selectedColumnObjects.forEach(column => onDropColumn(column));
      setSelectedColumns([]);
    }
  };

  const handleSelectColumn = (columnId: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnId) 
        ? prev.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleSelectAll = () => {
    if (selectedColumns.length === filteredColumns.length) {
      setSelectedColumns([]);
    } else {
      setSelectedColumns(filteredColumns.map(col => col.id));
    }
  };

  const handleMenuToggle = (columnId: string) => {
    setShowMenu(showMenu === columnId ? null : columnId);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredColumns = columns.filter(column => {
    const matchesSearch = column.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         column.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         column.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || column.type.toLowerCase() === filterType.toLowerCase();
    const matchesNullable = filterNullable === 'all' || 
                           (filterNullable === 'nullable' && column.nullable) ||
                           (filterNullable === 'not-nullable' && !column.nullable);
    const matchesPrimaryKey = filterPrimaryKey === 'all' || 
                             (filterPrimaryKey === 'primary' && column.primaryKey) ||
                             (filterPrimaryKey === 'not-primary' && !column.primaryKey);
    const matchesUnique = filterUnique === 'all' || 
                         (filterUnique === 'unique' && column.unique) ||
                         (filterUnique === 'not-unique' && !column.unique);
    const matchesAutoIncrement = filterAutoIncrement === 'all' || 
                               (filterAutoIncrement === 'auto-increment' && column.autoIncrement) ||
                               (filterAutoIncrement === 'not-auto-increment' && !column.autoIncrement);
    
    return matchesSearch && matchesType && matchesNullable && matchesPrimaryKey && matchesUnique && matchesAutoIncrement;
  });

  const sortedColumns = [...filteredColumns].sort((a, b) => {
    const aValue = a[sortField as keyof Column];
    const bValue = b[sortField as keyof Column];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('int') || lowerType.includes('number')) return 'looks_one';
    if (lowerType.includes('char') || lowerType.includes('text')) return 'text_fields';
    if (lowerType.includes('date') || lowerType.includes('time')) return 'schedule';
    if (lowerType.includes('bool')) return 'toggle_on';
    if (lowerType.includes('json')) return 'code';
    if (lowerType.includes('blob') || lowerType.includes('binary')) return 'attach_file';
    return 'storage';
  };

  const getTypeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('int') || lowerType.includes('number')) return 'primary';
    if (lowerType.includes('char') || lowerType.includes('text')) return 'success';
    if (lowerType.includes('date') || lowerType.includes('time')) return 'warning';
    if (lowerType.includes('bool')) return 'info';
    if (lowerType.includes('json')) return 'secondary';
    if (lowerType.includes('blob') || lowerType.includes('binary')) return 'danger';
    return 'default';
  };

  const formatType = (column: Column) => {
    let typeStr = column.type;
    if (column.length) {
      typeStr += `(${column.length})`;
    } else if (column.precision && column.scale) {
      typeStr += `(${column.precision},${column.scale})`;
    } else if (column.precision) {
      typeStr += `(${column.precision})`;
    }
    return typeStr;
  };

  const ctrlOrCmd = (key: string) => {
    return isMac ? `⌘${key}` : `Ctrl+${key}`;
  };

  return (
    <div className={`table-info-table table-schema ${className}`}>
      <div className="table-info-table-wrap">
        <div className="center-wrap">
          {error && <ErrorAlert error={error} />}
          
          {notice && (
            <div className="notices">
              <div className="alert alert-info">
                <i className="material-icons-outlined">info</i>
                <div>{notice}</div>
              </div>
            </div>
          )}

          <div className="table-subheader">
            <div className="table-title">
              <h2>Columns</h2>
            </div>
            <span className="expand" />
            <div className="actions">
              <button
                onClick={onRefresh}
                className="btn btn-link btn-fab"
                title={`${ctrlOrCmd('r')} or F5`}
              >
                <i className="material-icons">refresh</i>
              </button>
              {editable && (
                <button
                  onClick={handleAddColumn}
                  className="btn btn-primary btn-fab"
                  title={ctrlOrCmd('n')}
                >
                  <i className="material-icons">add</i>
                </button>
              )}
            </div>
          </div>

          <div ref={tableSchemaRef}>
            <div className="table-filters">
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Search columns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="filter-group">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All Types</option>
                  <option value="integer">INTEGER</option>
                  <option value="varchar">VARCHAR</option>
                  <option value="text">TEXT</option>
                  <option value="date">DATE</option>
                  <option value="datetime">DATETIME</option>
                  <option value="boolean">BOOLEAN</option>
                  <option value="json">JSON</option>
                  <option value="blob">BLOB</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterNullable}
                  onChange={(e) => setFilterNullable(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All</option>
                  <option value="nullable">Nullable</option>
                  <option value="not-nullable">Not Nullable</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterPrimaryKey}
                  onChange={(e) => setFilterPrimaryKey(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All</option>
                  <option value="primary">Primary Key</option>
                  <option value="not-primary">Not Primary Key</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterUnique}
                  onChange={(e) => setFilterUnique(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All</option>
                  <option value="unique">Unique</option>
                  <option value="not-unique">Not Unique</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterAutoIncrement}
                  onChange={(e) => setFilterAutoIncrement(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All</option>
                  <option value="auto-increment">Auto Increment</option>
                  <option value="not-auto-increment">Not Auto Increment</option>
                </select>
              </div>
            </div>

            <div className="table-header">
              <div className="table-row header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedColumns.length === filteredColumns.length && filteredColumns.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell position" onClick={() => handleSort('position')}>
                  # {sortField === 'position' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell name" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell type" onClick={() => handleSort('type')}>
                  Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell nullable" onClick={() => handleSort('nullable')}>
                  Nullable {sortField === 'nullable' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell default">
                  Default
                </div>
                <div className="table-cell constraints">
                  Constraints
                </div>
                <div className="table-cell comment">
                  Comment
                </div>
                <div className="table-cell actions">
                  Actions
                </div>
              </div>
            </div>

            <div className="table-body">
              {sortedColumns.map((column) => (
                <div key={column.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.id)}
                      onChange={() => handleSelectColumn(column.id)}
                    />
                  </div>
                  <div className="table-cell position">
                    <span className="position-number">{column.position}</span>
                  </div>
                  <div className="table-cell name">
                    <div className="column-name">
                      <i className={`material-icons ${getTypeColor(column.type)}`}>
                        {getTypeIcon(column.type)}
                      </i>
                      <span className="name-text">{column.name}</span>
                      {column.primaryKey && <span className="badge badge-primary">PK</span>}
                      {column.unique && <span className="badge badge-success">UQ</span>}
                      {column.autoIncrement && <span className="badge badge-info">AI</span>}
                    </div>
                  </div>
                  <div className="table-cell type">
                    <span className={`badge badge-${getTypeColor(column.type)}`}>
                      {formatType(column)}
                    </span>
                  </div>
                  <div className="table-cell nullable">
                    <span className={`badge badge-${column.nullable ? 'warning' : 'success'}`}>
                      {column.nullable ? 'NULL' : 'NOT NULL'}
                    </span>
                  </div>
                  <div className="table-cell default">
                    <code className="default-value">
                      {column.defaultValue || '-'}
                    </code>
                  </div>
                  <div className="table-cell constraints">
                    <div className="constraints-list">
                      {column.constraints.map((constraint, idx) => (
                        <span key={idx} className="constraint-tag">
                          {constraint}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="table-cell comment">
                    <span className="column-comment">
                      {column.comment || '-'}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-flat btn-icon"
                        onClick={() => handleMenuToggle(column.id)}
                        title="More Actions"
                      >
                        <i className="material-icons">more_vert</i>
                      </button>

                      {showMenu === column.id && (
                        <div className="column-menu" ref={menuRef}>
                          <div className="menu-item" onClick={() => onShowColumnDetails(column)}>
                            <i className="material-icons">info</i>
                            <span>View Details</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnSQL(column)}>
                            <i className="material-icons">code</i>
                            <span>View SQL</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnProperties(column)}>
                            <i className="material-icons">settings</i>
                            <span>Properties</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnStatistics(column)}>
                            <i className="material-icons">analytics</i>
                            <span>Statistics</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnUsage(column)}>
                            <i className="material-icons">trending_up</i>
                            <span>Usage</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnDependencies(column)}>
                            <i className="material-icons">link</i>
                            <span>Dependencies</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnPermissions(column)}>
                            <i className="material-icons">security</i>
                            <span>Permissions</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => onShowColumnConstraints(column)}>
                            <i className="material-icons">lock</i>
                            <span>Constraints</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnIndexes(column)}>
                            <i className="material-icons">storage</i>
                            <span>Indexes</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnRelations(column)}>
                            <i className="material-icons">link</i>
                            <span>Relations</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnTriggers(column)}>
                            <i className="material-icons">flash_on</i>
                            <span>Triggers</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnSchema(column)}>
                            <i className="material-icons">schema</i>
                            <span>Schema</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnPartitions(column)}>
                            <i className="material-icons">view_module</i>
                            <span>Partitions</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnSchemaValidation(column)}>
                            <i className="material-icons">verified</i>
                            <span>Schema Validation</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => onShowColumnBackup(column)}>
                            <i className="material-icons">backup</i>
                            <span>Backup</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnRestore(column)}>
                            <i className="material-icons">restore</i>
                            <span>Restore</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnExport(column)}>
                            <i className="material-icons">export</i>
                            <span>Export</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnImport(column)}>
                            <i className="material-icons">import</i>
                            <span>Import</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowColumnClone(column)}>
                            <i className="material-icons">content_copy</i>
                            <span>Clone</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => handleEditColumn(column)}>
                            <i className="material-icons">edit</i>
                            <span>Edit</span>
                          </div>
                          <div className="menu-item danger" onClick={() => handleDropColumn(column)}>
                            <i className="material-icons">delete</i>
                            <span>Drop</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedColumns.length === 0 && (
              <div className="no-data">
                <div className="alert alert-info">
                  <i className="material-icons">info</i>
                  <div>
                    <strong>No columns found</strong>
                    <p>This table has no columns.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {table.columns.length > 0 && (
            <div className="columns-loading-disclaimer">
              <p>Columns loading.</p>
              <p>This may take a few minutes depending on column count.</p>
            </div>
          )}
        </div>
      </div>

      {selectedColumns.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-actions-bar">
            <span className="selected-count">
              {selectedColumns.length} column(s) selected
            </span>
            <div className="bulk-actions-buttons">
              <button
                className="btn btn-flat"
                onClick={handleBulkDelete}
              >
                <i className="material-icons">delete</i>
                Delete
              </button>
              <button
                className="btn btn-flat"
                onClick={handleBulkDrop}
              >
                <i className="material-icons">remove</i>
                Drop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSchema;