import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import StatusBar from '../common/StatusBar';
import { isMac } from '@shared/lib/utils/platform';

interface TableTriggersProps {
  table: any;
  onRefresh: () => void;
  onAddTrigger: () => void;
  onEditTrigger: (trigger: any) => void;
  onDeleteTrigger: (trigger: any) => void;
  onDropTrigger: (trigger: any) => void;
  onShowTriggerDetails: (trigger: any) => void;
  onShowTriggerSQL: (trigger: any) => void;
  onShowTriggerProperties: (trigger: any) => void;
  onShowTriggerStatistics: (trigger: any) => void;
  onShowTriggerUsage: (trigger: any) => void;
  onShowTriggerDependencies: (trigger: any) => void;
  onShowTriggerPermissions: (trigger: any) => void;
  onShowTriggerBackup: (trigger: any) => void;
  onShowTriggerRestore: (trigger: any) => void;
  onShowTriggerExport: (trigger: any) => void;
  onShowTriggerImport: (trigger: any) => void;
  onShowTriggerClone: (trigger: any) => void;
  onShowTriggerDelete: (trigger: any) => void;
  onExecuteTrigger: (trigger: any) => void;
  onEnableTrigger: (trigger: any) => void;
  onDisableTrigger: (trigger: any) => void;
  className?: string;
}

interface Trigger {
  id: string;
  name: string;
  event: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE';
  timing: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
  action: string;
  condition?: string;
  enabled: boolean;
  comment: string;
  properties: Record<string, any>;
  createdAt: string;
  modifiedAt: string;
  lastExecuted?: string;
  executionCount: number;
  averageExecutionTime: number;
}

const TableTriggers: React.FC<TableTriggersProps> = ({
  table,
  onRefresh,
  onAddTrigger,
  onEditTrigger,
  onDeleteTrigger,
  onDropTrigger,
  onShowTriggerDetails,
  onShowTriggerSQL,
  onShowTriggerProperties,
  onShowTriggerStatistics,
  onShowTriggerUsage,
  onShowTriggerDependencies,
  onShowTriggerPermissions,
  onShowTriggerBackup,
  onShowTriggerRestore,
  onShowTriggerExport,
  onShowTriggerImport,
  onShowTriggerClone,
  onShowTriggerDelete,
  onExecuteTrigger,
  onEnableTrigger,
  onDisableTrigger,
  className = '',
}) => {
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterTiming, setFilterTiming] = useState<string>('all');
  const [filterEnabled, setFilterEnabled] = useState<string>('all');
  const [active, setActive] = useState(false);

  const tabulatorRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const hotkeys = {
    'ctrl+r': onRefresh,
    'meta+r': onRefresh,
    'f5': onRefresh,
    'ctrl+n': onAddTrigger,
    'meta+n': onAddTrigger,
    'delete': () => {
      if (selectedTriggers.length > 0) {
        handleBulkDelete();
      }
    },
    'escape': () => {
      setSelectedTriggers([]);
      setShowMenu(null);
    },
  };

  useEffect(() => {
    if (table) {
      loadTriggers();
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
        onAddTrigger();
      } else if (key === 'f5') {
        e.preventDefault();
        onRefresh();
      } else if (key === 'delete' && selectedTriggers.length > 0) {
        e.preventDefault();
        handleBulkDelete();
      } else if (key === 'escape') {
        setSelectedTriggers([]);
        setShowMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedTriggers]);

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

  const loadTriggers = async () => {
    if (!table) return;

    setLoading(true);
    setError(null);
    try {
      // Placeholder for actual trigger loading logic
      const mockTriggers: Trigger[] = [
        {
          id: '1',
          name: 'trg_user_audit',
          event: 'INSERT',
          timing: 'AFTER',
          action: 'INSERT INTO audit_log (table_name, action, user_id, timestamp) VALUES (\'users\', \'INSERT\', NEW.id, NOW())',
          condition: 'NEW.status = \'active\'',
          enabled: true,
          comment: 'Audit trigger for user insertions',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          lastExecuted: new Date().toISOString(),
          executionCount: 150,
          averageExecutionTime: 2.5,
        },
        {
          id: '2',
          name: 'trg_user_update',
          event: 'UPDATE',
          timing: 'BEFORE',
          action: 'SET NEW.updated_at = NOW()',
          enabled: true,
          comment: 'Update timestamp trigger',
          properties: {},
          createdAt: new Date().toISOString(),
          modifiedAt: new Date().toISOString(),
          lastExecuted: new Date().toISOString(),
          executionCount: 300,
          averageExecutionTime: 1.2,
        },
      ];
      setTriggers(mockTriggers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load triggers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrigger = () => {
    onAddTrigger();
  };

  const handleEditTrigger = (trigger: Trigger) => {
    onEditTrigger(trigger);
  };

  const handleDeleteTrigger = (trigger: Trigger) => {
    onDeleteTrigger(trigger);
  };

  const handleDropTrigger = (trigger: Trigger) => {
    onDropTrigger(trigger);
  };

  const handleBulkDelete = () => {
    if (selectedTriggers.length > 0) {
      const selectedTriggerObjects = triggers.filter(trg => selectedTriggers.includes(trg.id));
      selectedTriggerObjects.forEach(trigger => onDeleteTrigger(trigger));
      setSelectedTriggers([]);
    }
  };

  const handleBulkDrop = () => {
    if (selectedTriggers.length > 0) {
      const selectedTriggerObjects = triggers.filter(trg => selectedTriggers.includes(trg.id));
      selectedTriggerObjects.forEach(trigger => onDropTrigger(trigger));
      setSelectedTriggers([]);
    }
  };

  const handleSelectTrigger = (triggerId: string) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTriggers.length === filteredTriggers.length) {
      setSelectedTriggers([]);
    } else {
      setSelectedTriggers(filteredTriggers.map(trg => trg.id));
    }
  };

  const handleMenuToggle = (triggerId: string) => {
    setShowMenu(showMenu === triggerId ? null : triggerId);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTriggers = triggers.filter(trigger => {
    const matchesSearch = trigger.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trigger.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trigger.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = filterEvent === 'all' || trigger.event.toLowerCase() === filterEvent.toLowerCase();
    const matchesTiming = filterTiming === 'all' || trigger.timing.toLowerCase() === filterTiming.toLowerCase();
    const matchesEnabled = filterEnabled === 'all' || 
                          (filterEnabled === 'enabled' && trigger.enabled) ||
                          (filterEnabled === 'disabled' && !trigger.enabled);
    
    return matchesSearch && matchesEvent && matchesTiming && matchesEnabled;
  });

  const sortedTriggers = [...filteredTriggers].sort((a, b) => {
    const aValue = a[sortField as keyof Trigger];
    const bValue = b[sortField as keyof Trigger];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getEventIcon = (event: string) => {
    switch (event) {
      case 'INSERT': return 'add';
      case 'UPDATE': return 'edit';
      case 'DELETE': return 'delete';
      case 'TRUNCATE': return 'clear';
      default: return 'flash_on';
    }
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'INSERT': return 'success';
      case 'UPDATE': return 'warning';
      case 'DELETE': return 'danger';
      case 'TRUNCATE': return 'info';
      default: return 'default';
    }
  };

  const getTimingIcon = (timing: string) => {
    switch (timing) {
      case 'BEFORE': return 'schedule';
      case 'AFTER': return 'done';
      case 'INSTEAD OF': return 'swap_horiz';
      default: return 'flash_on';
    }
  };

  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'BEFORE': return 'warning';
      case 'AFTER': return 'success';
      case 'INSTEAD OF': return 'info';
      default: return 'default';
    }
  };

  const formatExecutionTime = (time: number) => {
    return `${time.toFixed(2)}ms`;
  };

  const formatExecutionCount = (count: number) => {
    return count.toLocaleString();
  };

  const ctrlOrCmd = (key: string) => {
    return isMac ? `⌘${key}` : `Ctrl+${key}`;
  };

  return (
    <div className={`table-info-table view-only ${className}`}>
      <div className="table-info-table-wrap">
        <div className="center-wrap">
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
              <h2>Triggers</h2>
            </div>
            <div className="table-actions">
              <button
                className="btn btn-flat btn-icon btn-small"
                onClick={onRefresh}
                title={`${ctrlOrCmd('r')} or F5`}
              >
                <i className="material-icons">refresh</i>
              </button>
              <button
                className="btn btn-flat btn-icon btn-small"
                onClick={handleAddTrigger}
                title={ctrlOrCmd('n')}
              >
                <i className="material-icons">add</i>
                Trigger
              </button>
            </div>
          </div>

          <div className="table-triggers" ref={tabulatorRef}>
            <div className="table-filters">
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="Search triggers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="filter-group">
                <select
                  value={filterEvent}
                  onChange={(e) => setFilterEvent(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All Events</option>
                  <option value="INSERT">INSERT</option>
                  <option value="UPDATE">UPDATE</option>
                  <option value="DELETE">DELETE</option>
                  <option value="TRUNCATE">TRUNCATE</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterTiming}
                  onChange={(e) => setFilterTiming(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All Timing</option>
                  <option value="BEFORE">BEFORE</option>
                  <option value="AFTER">AFTER</option>
                  <option value="INSTEAD OF">INSTEAD OF</option>
                </select>
              </div>
              <div className="filter-group">
                <select
                  value={filterEnabled}
                  onChange={(e) => setFilterEnabled(e.target.value)}
                  className="form-control"
                >
                  <option value="all">All</option>
                  <option value="enabled">Enabled</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="table-header">
              <div className="table-row header">
                <div className="table-cell checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTriggers.length === filteredTriggers.length && filteredTriggers.length > 0}
                    onChange={handleSelectAll}
                  />
                </div>
                <div className="table-cell name" onClick={() => handleSort('name')}>
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell event" onClick={() => handleSort('event')}>
                  Event {sortField === 'event' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell timing" onClick={() => handleSort('timing')}>
                  Timing {sortField === 'timing' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell action">
                  Action
                </div>
                <div className="table-cell status">
                  Status
                </div>
                <div className="table-cell execution" onClick={() => handleSort('executionCount')}>
                  Executions {sortField === 'executionCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell performance" onClick={() => handleSort('averageExecutionTime')}>
                  Avg Time {sortField === 'averageExecutionTime' && (sortDirection === 'asc' ? '↑' : '↓')}
                </div>
                <div className="table-cell actions">
                  Actions
                </div>
              </div>
            </div>

            <div className="table-body">
              {sortedTriggers.map((trigger) => (
                <div key={trigger.id} className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTriggers.includes(trigger.id)}
                      onChange={() => handleSelectTrigger(trigger.id)}
                    />
                  </div>
                  <div className="table-cell name">
                    <div className="trigger-name">
                      <i className="material-icons">flash_on</i>
                      <span className="name-text">{trigger.name}</span>
                      {!trigger.enabled && <span className="badge badge-warning">DISABLED</span>}
                    </div>
                  </div>
                  <div className="table-cell event">
                    <span className={`badge badge-${getEventColor(trigger.event)}`}>
                      <i className="material-icons">{getEventIcon(trigger.event)}</i>
                      {trigger.event}
                    </span>
                  </div>
                  <div className="table-cell timing">
                    <span className={`badge badge-${getTimingColor(trigger.timing)}`}>
                      <i className="material-icons">{getTimingIcon(trigger.timing)}</i>
                      {trigger.timing}
                    </span>
                  </div>
                  <div className="table-cell action">
                    <div className="action-preview">
                      <code>{trigger.action.substring(0, 50)}{trigger.action.length > 50 ? '...' : ''}</code>
                    </div>
                  </div>
                  <div className="table-cell status">
                    <div className="status-indicator">
                      <span className={`status-dot ${trigger.enabled ? 'enabled' : 'disabled'}`} />
                      <span className="status-text">{trigger.enabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                  <div className="table-cell execution">
                    <div className="execution-info">
                      <span className="execution-count">{formatExecutionCount(trigger.executionCount)}</span>
                      {trigger.lastExecuted && (
                        <span className="last-executed">
                          {new Date(trigger.lastExecuted).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="table-cell performance">
                    <div className="performance-info">
                      <span className="avg-time">{formatExecutionTime(trigger.averageExecutionTime)}</span>
                    </div>
                  </div>
                  <div className="table-cell actions">
                    <div className="action-buttons">
                      <button
                        className="btn btn-flat btn-icon"
                        onClick={() => handleMenuToggle(trigger.id)}
                        title="More Actions"
                      >
                        <i className="material-icons">more_vert</i>
                      </button>

                      {showMenu === trigger.id && (
                        <div className="trigger-menu" ref={menuRef}>
                          <div className="menu-item" onClick={() => onShowTriggerDetails(trigger)}>
                            <i className="material-icons">info</i>
                            <span>View Details</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerSQL(trigger)}>
                            <i className="material-icons">code</i>
                            <span>View SQL</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerProperties(trigger)}>
                            <i className="material-icons">settings</i>
                            <span>Properties</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerStatistics(trigger)}>
                            <i className="material-icons">analytics</i>
                            <span>Statistics</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerUsage(trigger)}>
                            <i className="material-icons">trending_up</i>
                            <span>Usage</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerDependencies(trigger)}>
                            <i className="material-icons">link</i>
                            <span>Dependencies</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerPermissions(trigger)}>
                            <i className="material-icons">security</i>
                            <span>Permissions</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => onExecuteTrigger(trigger)}>
                            <i className="material-icons">play_arrow</i>
                            <span>Execute</span>
                          </div>
                          <div className="menu-item" onClick={() => trigger.enabled ? onDisableTrigger(trigger) : onEnableTrigger(trigger)}>
                            <i className="material-icons">{trigger.enabled ? 'pause' : 'play_arrow'}</i>
                            <span>{trigger.enabled ? 'Disable' : 'Enable'}</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => onShowTriggerBackup(trigger)}>
                            <i className="material-icons">backup</i>
                            <span>Backup</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerRestore(trigger)}>
                            <i className="material-icons">restore</i>
                            <span>Restore</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerExport(trigger)}>
                            <i className="material-icons">export</i>
                            <span>Export</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerImport(trigger)}>
                            <i className="material-icons">import</i>
                            <span>Import</span>
                          </div>
                          <div className="menu-item" onClick={() => onShowTriggerClone(trigger)}>
                            <i className="material-icons">content_copy</i>
                            <span>Clone</span>
                          </div>
                          <div className="menu-divider" />
                          <div className="menu-item" onClick={() => handleEditTrigger(trigger)}>
                            <i className="material-icons">edit</i>
                            <span>Edit</span>
                          </div>
                          <div className="menu-item danger" onClick={() => handleDropTrigger(trigger)}>
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

            {sortedTriggers.length === 0 && (
              <div className="no-data">
                <div className="alert alert-info">
                  <i className="material-icons">info</i>
                  <div>
                    <strong>No triggers found</strong>
                    <p>This table has no triggers.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="expand" />

      <StatusBar className="tabulator-footer" active={active}>
        <div className="flex flex-middle flex-right statusbar-actions">
          {/* Footer content */}
        </div>
      </StatusBar>

      {selectedTriggers.length > 0 && (
        <div className="bulk-actions">
          <div className="bulk-actions-bar">
            <span className="selected-count">
              {selectedTriggers.length} trigger(s) selected
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

export default TableTriggers;
