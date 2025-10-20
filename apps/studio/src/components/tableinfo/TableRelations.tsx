import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ErrorAlert from '../common/ErrorAlert';
import StatusBar from '../common/StatusBar';
import { isMac } from '@shared/lib/utils/platform';

interface TableRelationsProps {
  table: any;
  onRefresh: () => void;
  onAddRelation: () => void;
  onEditRelation: (relation: any) => void;
  onDeleteRelation: (relation: any) => void;
  onDropRelation: (relation: any) => void;
  onShowRelationDetails: (relation: any) => void;
  onShowRelationSQL: (relation: any) => void;
  onShowRelationProperties: (relation: any) => void;
  onShowRelationStatistics: (relation: any) => void;
  onShowRelationUsage: (relation: any) => void;
  onShowRelationDependencies: (relation: any) => void;
  onShowRelationPermissions: (relation: any) => void;
  onShowRelationBackup: (relation: any) => void;
  onShowRelationRestore: (relation: any) => void;
  onShowRelationExport: (relation: any) => void;
  onShowRelationImport: (relation: any) => void;
  onShowRelationClone: (relation: any) => void;
  onShowRelationDelete: (relation: any) => void;
  className?: string;
}

interface Relation {
  id: string;
  name: string;
  type: 'FOREIGN KEY' | 'PRIMARY KEY' | 'UNIQUE' | 'CHECK' | 'INDEX';
  constraintName: string;
  referencedTable: string;
  referencedColumn: string;
  column: string;
  onDelete: string;
  onUpdate: string;
  deferrable: boolean;
  initiallyDeferred: boolean;
  matchType: string;
  comment: string;
  properties: Record<string, any>;
  createdAt: string;
  modifiedAt: string;
}

const TableRelations: React.FC<TableRelationsProps> = ({
  table,
  onRefresh,
  onAddRelation,
  onEditRelation,
  onDeleteRelation,
  onDropRelation,
  onShowRelationDetails,
  onShowRelationSQL,
  onShowRelationProperties,
  onShowRelationStatistics,
  onShowRelationUsage,
  onShowRelationDependencies,
  onShowRelationPermissions,
  onShowRelationBackup,
  onShowRelationRestore,
  onShowRelationExport,
  onShowRelationImport,
  onShowRelationClone,
  onShowRelationDelete,
  className = '',
}) => {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedRelations, setSelectedRelations] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<string>('all');
  const [active, setActive] = useState(false);

  const tabulatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const hotkeys = {
    'ctrl+r': onRefresh,
    'meta+r': onRefresh,
    'f5': onRefresh,
    'ctrl+n': onAddRelation,
    'meta+n': onAddRelation,
    'delete': () => {
      if (selectedRelations.length > 0) {
        handleBulkDelete();
      }
    },
    'escape': () => {
      setSelectedRelations([]);
      setShowMenu(null);
    },
  };

  useEffect(() => {
    if (table) {
      loadRelations();
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
        onAddRelation();
      } else if (key === 'f5') {
        e.preventDefault();
        onRefresh();
      } else if (key === 'delete' && selectedRelations.length > 0) {
        e.preventDefault();
        handleBulkDelete();
      } else if (key === 'escape') {
        setSelectedRelations([]);
        setShowMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedRelations]);

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

  const loadRelations = async () => {
    if (!table) return;

    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual relation loading logic
      const mockRelations: Relation[] = [
        {
          id: '1',
          name: 'fk_user_id',
          type: 'FOREIGN KEY',
          constraintName: 'fk_user_id',
          referencedTable: 'users',
          referencedColumn: 'id',
          column: 'user_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          deferrable: false,
          initiallyDeferred: false,
          matchType: 'SIMPLE',
          comment: 'Foreign key to users table',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'fk_category_id',
          type: 'FOREIGN KEY',
          constraintName: 'fk_category_id',
          referencedTable: 'categories',
          referencedColumn: 'id',
          column: 'category_id',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          deferrable: true,
          initiallyDeferred: true,
          matchType: 'SIMPLE',
          comment: 'Foreign key to categories table',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
        },
      ];
      setRelations(mockRelations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load relations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRelation = () => {
    onAddRelation();
  };

  const handleEditRelation = (relation: Relation) => {
    onEditRelation(relation);
  };

  const handleDeleteRelation = (relation: Relation) => {
    onDeleteRelation(relation);
  };

  const handleDropRelation = (relation: Relation) => {
    onDropRelation(relation);
  };

  const handleBulkDelete = () => {
    if (selectedRelations.length > 0) {
      const selectedRelationObjects = relations.filter(rel => selectedRelations.includes(rel.id));
      selectedRelationObjects.forEach(relation => onDeleteRelation(relation));
      setSelectedRelations([]);
    }
  };

  const handleBulkDrop = () => {
    if (selectedRelations.length > 0) {
      const selectedRelationObjects = relations.filter(rel => selectedRelations.includes(rel.id));
      selectedRelationObjects.forEach(relation => onDropRelation(relation));
      setSelectedRelations([]);
    }
  };

  const handleSelectRelation = (relationId: string) => {
    setSelectedRelations(prev => 
      prev.includes(relationId) 
        ? prev.filter(id => id !== relationId)
        : [...prev, relationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedRelations.length === filteredRelations.length) {
      setSelectedRelations([]);
    } else {
      setSelectedRelations(filteredRelations.map(rel => rel.id));
    }
  };

  const handleMenuToggle = (relationId: string) => {
    setShowMenu(showMenu === relationId ? null : relationId);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRelations = relations.filter(relation => {
    const matchesSearch = relation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         relation.constraintName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         relation.referencedTable.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         relation.column.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || relation.type.toLowerCase() === filterType.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const sortedRelations = [...filteredRelations].sort((a, b) => {
    const aValue = a[sortField as keyof Relation];
    const bValue = b[sortField as keyof Relation];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getRelationTypeIcon = (type: string) => {
    switch (type) {
      case 'FOREIGN KEY': return 'link';
      case 'PRIMARY KEY': return 'vpn_key';
      case 'UNIQUE': return 'star';
      case 'CHECK': return 'check_circle';
      case 'INDEX': return 'storage';
      default: return 'link';
    }
  };

  const getRelationTypeColor = (type: string) => {
    switch (type) {
      case 'FOREIGN KEY': return 'primary';
      case 'PRIMARY KEY': return 'success';
      case 'UNIQUE': return 'warning';
      case 'CHECK': return 'info';
      case 'INDEX': return 'secondary';
      default: return 'default';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CASCADE': return 'trending_down';
      case 'SET NULL': return 'remove';
      case 'SET DEFAULT': return 'restore';
      case 'RESTRICT': return 'block';
      case 'NO ACTION': return 'pause';
      default: return 'help';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CASCADE': return 'danger';
      case 'SET NULL': return 'warning';
      case 'SET DEFAULT': return 'info';
      case 'RESTRICT': return 'secondary';
      case 'NO ACTION': return 'default';
      default: return 'default';
    }
  };

  const ctrlOrCmd = (key: string) => {
    return isMac ? `⌘${key}` : `Ctrl+${key}`;
  };

  const canAdd = true; // Placeholder for actual permission check

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

          <div className="table-subheader">
            <div className="table-title">
              <h2>Relations</h2>
            </div>
            <div className="expand" />
            <div className="actions">
              <button
                onClick={onRefresh}
                className="btn btn-link btn-fab"
                title={`${ctrlOrCmd('r')} or F5`}
              >
                <i className="material-icons">refresh</i>
              </button>
              {canAdd && (
                <button
                  onClick={handleAddRelation}
                  className="btn btn-primary btn-fab"
                  title={ctrlOrCmd('n')}
                >
                  <i className="material-icons">add</i>
                </button>
              )}
            </div>
          </div>

          <div className="table-relations" ref={tabulatorRef}>
            <div className="table-filters">
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Search relations..."
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
                  <option value="FOREIGN KEY">Foreign Key</option>
                  <option value="PRIMARY KEY">Primary Key</option>
                  <option value="UNIQUE">Unique</option>
                  <option value="CHECK">Check</option>
                  <option value="INDEX">Index</option>
                </select>
              </div>
            </div>

            <div className="table-header">
              <div className="table-row header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRelations.length === filteredRelations.length && filteredRelations.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell name" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell type" onClick={() => handleSort('type')}>
                  Type {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell column">
                  Column
                </div>
                <div className="table-cell referenced">
                  Referenced
                </div>
                <div className="table-cell actions">
                  Actions
                </div>
                <div className="table-cell on-delete">
                  On Delete
                </div>
                <div className="table-cell on-update">
                  On Update
                </div>
                <div className="table-cell actions">
                  Actions
                </div>
              </div>
            </div>

            <div className="table-body">
              {sortedRelations.map((relation) => (
                <div key={relation.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRelations.includes(relation.id)}
                      onChange={() => handleSelectRelation(relation.id)}
                    />
                  </div>
                  <div className="table-cell name">
                    <div className="relation-name">
                      <i className={`material-icons ${getRelationTypeColor(relation.type)}`}>
                        {getRelationTypeIcon(relation.type)}
                      </i>
                      <span className="name-text">{relation.name}</span>
                      <span className="constraint-name">({relation.constraintName})</span>
                    </div>
                  </div>
                  <div className="table-cell type">
                    <span className={`badge badge-${getRelationTypeColor(relation.type)}`}>
                      {relation.type}
                    </span>
                  </div>
                  <div className="table-cell column">
                    <span className="column-name">{relation.column}</span>
                  </div>
                  <div className="table-cell referenced">
                    <div className="referenced-info">
                      <span className="table-name">{relation.referencedTable}</span>
                      <span className="column-name">.{relation.referencedColumn}</span>
                    </div>
                  </div>
                  <div className="table-cell on-delete">
                    <span className={`action-badge badge-${getActionColor(relation.onDelete)}`}>
                      <i className="material-icons">{getActionIcon(relation.onDelete)}</i>
                      {relation.onDelete}
                    </span>
                  </div>
                  <div className="table-cell on-update">
                    <span className={`action-badge badge-${getActionColor(relation.onUpdate)}`}>
                      <i className="material-icons">{getActionIcon(relation.onUpdate)}</i>
                      {relation.onUpdate}
                    </span>
                  </div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-flat btn-icon"
                        onClick={() => handleMenuToggle(relation.id)}
                        title="More Actions"
                      >
                        <i className="material-icons">more_vert</i>
                      </button>

                      {showMenu === relation.id && (
                        <div className="relation-menu" ref={menuRef}>
                          <div className="menu-item" onClick={() => onShowRelationDetails(relation)}>
                            <i className="material-icons">info</i>
                            <span>View Details</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationSQL(relation)}>
                            <i className="material-icons">code</i>
                            <span>View SQL</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationProperties(relation)}>
                            <i className="material-icons">settings</i>
                            <span>Properties</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationStatistics(relation)}>
                            <i className="material-icons">analytics</i>
                            <span>Statistics</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationUsage(relation)}>
                            <i className="material-icons">trending_up</i>
                            <span>Usage</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationDependencies(relation)}>
                            <i className="material-icons">link</i>
                            <span>Dependencies</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationPermissions(relation)}>
                            <i className="material-icons">security</i>
                            <span>Permissions</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => onShowRelationBackup(relation)}>
                            <i className="material-icons">backup</i>
                            <span>Backup</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationRestore(relation)}>
                            <i className="material-icons">restore</i>
                            <span>Restore</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationExport(relation)}>
                            <i className="material-icons">export</i>
                            <span>Export</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationImport(relation)}>
                            <i className="material-icons">import</i>
                            <span>Import</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowRelationClone(relation)}>
                            <i className="material-icons">content_copy</i>
                            <span>Clone</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => handleEditRelation(relation)}>
                            <i className="material-icons">edit</i>
                            <span>Edit</span>
                          </div>
                          <div className="menu-item danger" onClick={() => handleDropRelation(relation)}>
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

            {sortedRelations.length === 0 && (
              <div className="no-data">
                <div className="alert alert-info">
                  <i className="material-icons">info</i>
                  <div>
                    <strong>No relations found</strong>
                    <p>This table has no relations.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="expand" />

      <StatusBar className="tabulator-footer" active={active} />

      {selectedRelations.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-actions-bar">
            <span className="selected-count">
              {selectedRelations.length} relation(s) selected
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

export default TableRelations;
