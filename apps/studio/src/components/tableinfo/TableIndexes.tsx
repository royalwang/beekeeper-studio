import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ErrorAlert from '../common/ErrorAlert';
import ProgressBar from '../editor/ProgressBar';
import { isMac } from '@shared/lib/utils/platform';

interface TableIndexesProps {
  table: any;
  onRefresh: () => void;
  onAddIndex: () => void;
  onEditIndex: (index: any) => void;
  onDeleteIndex: (index: any) => void;
  onDropIndex: (index: any) => void;
  onShowIndexDetails: (index: any) => void;
  onShowIndexSQL: (index: any) => void;
  onShowIndexProperties: (index: any) => void;
  onShowIndexStatistics: (index: any) => void;
  onShowIndexUsage: (index: any) => void;
  onShowIndexDependencies: (index: any) => void;
  onShowIndexPermissions: (index: any) => void;
  onShowIndexBackup: (index: any) => void;
  onShowIndexRestore: (index: any) => void;
  onShowIndexExport: (index: any) => void;
  onShowIndexImport: (index: any) => void;
  onShowIndexClone: (index: any) => void;
  onShowIndexDelete: (index: any) => void;
  className?: string;
}

interface Index {
  id: string;
  name: string;
  type: string;
  columns: string[];
  unique: boolean;
  primary: boolean;
  clustered: boolean;
  size: number;
  usage: number;
  lastUsed: string;
  createdAt: string;
  modifiedAt: string;
  comment: string;
  properties: Record<string, any>;
}

const TableIndexes: React.FC<TableIndexesProps> = ({
  table,
  onRefresh,
  onAddIndex,
  onEditIndex,
  onDeleteIndex,
  onDropIndex,
  onShowIndexDetails,
  onShowIndexSQL,
  onShowIndexProperties,
  onShowIndexStatistics,
  onShowIndexUsage,
  onShowIndexDependencies,
  onShowIndexPermissions,
  onShowIndexBackup,
  onShowIndexRestore,
  onShowIndexExport,
  onShowIndexImport,
  onShowIndexClone,
  onShowIndexDelete,
  className = '',
}) => {
  const [indexes, setIndexes] = useState<Index[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedIndexes, setSelectedIndexes] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUnique, setFilterUnique] = useState<string>('all');

  const tabulatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const hotkeys = {
    'ctrl+r': onRefresh,
    'meta+r': onRefresh,
    'f5': onRefresh,
    'ctrl+n': onAddIndex,
    'meta+n': onAddIndex,
    'delete': () => {
      if (selectedIndexes.length > 0) {
        handleBulkDelete();
      }
    },
    'escape': () => {
      setSelectedIndexes([]);
      setShowMenu(null);
    },
  };

  useEffect(() => {
    if (table) {
      loadIndexes();
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
        onAddIndex();
      } else if (key === 'f5') {
        e.preventDefault();
        onRefresh();
      } else if (key === 'delete' && selectedIndexes.length > 0) {
        e.preventDefault();
        handleBulkDelete();
      } else if (key === 'escape') {
        setSelectedIndexes([]);
        setShowMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndexes]);

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

  const loadIndexes = async () => {
    if (!table) return;

    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual index loading logic
      const mockIndexes: Index[] = [
        {
          id: '1',
          name: 'PRIMARY',
          type: 'BTREE',
          columns: ['id'],
          unique: true,
          primary: true,
          clustered: true,
          size: 1024,
          usage: 95,
          lastUsed: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          comment: 'Primary key index',
          properties: {},
        },
        {
          id: '2',
          name: 'idx_name',
          type: 'BTREE',
          columns: ['name'],
          unique: false,
          primary: false,
          clustered: false,
          size: 512,
          usage: 80,
          lastUsed: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          comment: 'Name index',
          properties: {},
        },
      ];
      setIndexes(mockIndexes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load indexes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIndex = () => {
    onAddIndex();
  };

  const handleEditIndex = (index: Index) => {
    onEditIndex(index);
  };

  const handleDeleteIndex = (index: Index) => {
    onDeleteIndex(index);
  };

  const handleDropIndex = (index: Index) => {
    onDropIndex(index);
  };

  const handleBulkDelete = () => {
    if (selectedIndexes.length > 0) {
      const selectedIndexObjects = indexes.filter(idx => selectedIndexes.includes(idx.id));
      selectedIndexObjects.forEach(index => onDeleteIndex(index));
      setSelectedIndexes([]);
    }
  };

  const handleBulkDrop = () => {
    if (selectedIndexes.length > 0) {
      const selectedIndexObjects = indexes.filter(idx => selectedIndexes.includes(idx.id));
      selectedIndexObjects.forEach(index => onDropIndex(index));
      setSelectedIndexes([]);
    }
  };

  const handleSelectIndex = (indexId: string) => {
    setSelectedIndexes(prev => 
      prev.includes(indexId) 
        ? prev.filter(id => id !== indexId)
        : [...prev, indexId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIndexes.length === filteredIndexes.length) {
      setSelectedIndexes([]);
    } else {
      setSelectedIndexes(filteredIndexes.map(idx => idx.id));
    }
  };

  const handleMenuToggle = (indexId: string) => {
    setShowMenu(showMenu === indexId ? null : indexId);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredIndexes = indexes.filter(index => {
    const matchesSearch = index.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         index.columns.some(col => col.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || index.type.toLowerCase() === filterType.toLowerCase();
    const matchesUnique = filterUnique === 'all' || 
                         (filterUnique === 'unique' && index.unique) ||
                         (filterUnique === 'non-unique' && !index.unique);
    
    return matchesSearch && matchesType && matchesUnique;
  });

  const sortedIndexes = [...filteredIndexes].sort((a, b) => {
    const aValue = a[sortField as keyof Index];
    const bValue = b[sortField as keyof Index];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getIndexTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'btree': return 'tree';
      case 'hash': return 'hash';
      case 'gin': return 'gin';
      case 'gist': return 'gist';
      case 'spgist': return 'spgist';
      case 'brin': return 'brin';
      default: return 'storage';
    }
  };

  const getIndexTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'btree': return 'primary';
      case 'hash': return 'secondary';
      case 'gin': return 'success';
      case 'gist': return 'info';
      case 'spgist': return 'warning';
      case 'brin': return 'danger';
      default: return 'default';
    }
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatUsage = (usage: number) => {
    return `${usage}%`;
  };

  const ctrlOrCmd = (key: string) => {
    return isMac ? `⌘${key}` : `Ctrl+${key}`;
  };

  return (
    <div className={`table-info-table view-only ${className}`}>
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

          {loading && (
            <div>
              <div className="alert alert-info">Applying changes...</div>
              <ProgressBar />
            </div>
          )}

          <div className="content-wrap">
            <div className="table-subheader">
              <div className="table-title">
                <h2>Indexes</h2>
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
                <button
                  onClick={handleAddIndex}
                  className="btn btn-primary btn-fab"
                  title={ctrlOrCmd('n')}
                >
                  <i className="material-icons">add</i>
                </button>
              </div>
            </div>

            <div className="table-indexes" ref={tabulatorRef}>
              <div className="table-filters">
                <div className="filter-group">
                  <input
                    type="text"
                    placeholder="Search indexes..."
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
                    <option value="btree">BTREE</option>
                    <option value="hash">HASH</option>
                    <option value="gin">GIN</option>
                    <option value="gist">GIST</option>
                    <option value="spgist">SPGIST</option>
                    <option value="brin">BRIN</option>
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
                    <option value="non-unique">Non-Unique</option>
                  </select>
                </div>
              </div>

              <div className="table-header">
                <div className="table-row header">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedIndexes.length === filteredIndexes.length && filteredIndexes.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div className="table-cell name" onClick={() => handleSort('name')}>
                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="table-cell type" onClick={() => handleSort('type')}>
                    Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="table-cell columns">
                    Columns
                  </div>
                  <div className="table-cell size" onClick={() => handleSort('size')}>
                    Size {sortField === 'size' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="table-cell usage" onClick={() => handleSort('usage')}>
                    Usage {sortField === 'usage' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </div>
                  <div className="table-cell actions">
                    Actions
                  </div>
                </div>
              </div>

              <div className="table-body">
                {sortedIndexes.map((index) => (
                  <div key={index.id} className="table-row">
                    <div className="table-cell checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIndexes.includes(index.id)}
                        onChange={() => handleSelectIndex(index.id)}
                      />
                    </div>
                    <div className="table-cell name">
                      <div className="index-name">
                        <i className={`material-icons ${getIndexTypeColor(index.type)}`}>
                          {getIndexTypeIcon(index.type)}
                        </i>
                        <span className="name-text">{index.name}</span>
                        {index.primary && <span className="badge badge-primary">PRIMARY</span>}
                        {index.unique && <span className="badge badge-success">UNIQUE</span>}
                        {index.clustered && <span className="badge badge-info">CLUSTERED</span>}
                      </div>
                    </div>
                    <div className="table-cell type">
                      <span className={`badge badge-${getIndexTypeColor(index.type)}`}>
                        {index.type}
                      </span>
                    </div>
                    <div className="table-cell columns">
                      <div className="columns-list">
                        {index.columns.map((column, idx) => (
                          <span key={idx} className="column-tag">
                            {column}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="table-cell size">
                      {formatSize(index.size)}
                    </div>
                    <div className="table-cell usage">
                      <div className="usage-bar">
                        <div 
                          className="usage-fill" 
                          style={{ width: `${index.usage}%` }}
                        />
                        <span className="usage-text">{formatUsage(index.usage)}</span>
                      </div>
                    </div>
                    <div className="table-cell actions">
                      <div className="action-buttons">
                        <button
                          className="btn btn-flat btn-icon"
                          onClick={() => handleMenuToggle(index.id)}
                          title="More Actions"
                        >
                          <i className="material-icons">more_vert</i>
                        </button>

                        {showMenu === index.id && (
                          <div className="index-menu" ref={menuRef}>
                            <div className="menu-item" onClick={() => onShowIndexDetails(index)}>
                              <i className="material-icons">info</i>
                              <span>View Details</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexSQL(index)}>
                              <i className="material-icons">code</i>
                              <span>View SQL</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexProperties(index)}>
                              <i className="material-icons">settings</i>
                              <span>Properties</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexStatistics(index)}>
                              <i className="material-icons">analytics</i>
                              <span>Statistics</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexUsage(index)}>
                              <i className="material-icons">trending_up</i>
                              <span>Usage</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexDependencies(index)}>
                              <i className="material-icons">link</i>
                              <span>Dependencies</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexPermissions(index)}>
                              <i className="material-icons">security</i>
                              <span>Permissions</span>
                            </div>
                            <div className="menu-divider" />
                            <div className="menu-item" onClick={() => onShowIndexBackup(index)}>
                              <i className="material-icons">backup</i>
                              <span>Backup</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexRestore(index)}>
                              <i className="material-icons">restore</i>
                              <span>Restore</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexExport(index)}>
                              <i className="material-icons">export</i>
                              <span>Export</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexImport(index)}>
                              <i className="material-icons">import</i>
                              <span>Import</span>
                            </div>
                            <div className="menu-item" onClick={() => onShowIndexClone(index)}>
                              <i className="material-icons">content_copy</i>
                              <span>Clone</span>
                            </div>
                            <div className="menu-divider" />
                            <div className="menu-item" onClick={() => handleEditIndex(index)}>
                              <i className="material-icons">edit</i>
                              <span>Edit</span>
                            </div>
                            <div className="menu-item danger" onClick={() => handleDropIndex(index)}>
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

              {sortedIndexes.length === 0 && (
                <div className="no-data">
                  <div className="alert alert-info">
                    <i className="material-icons">info</i>
                    <div>
                      <strong>No indexes found</strong>
                      <p>This table has no indexes.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {selectedIndexes.length > 0 && (
              <div className="bulk-actions">
                <div className="bulk-actions-bar">
                  <span className="selected-count">
                    {selectedIndexes.length} index(es) selected
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
        </div>
      </div>
    </div>
  );
};

export default TableIndexes;
