import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ErrorAlert from '../common/ErrorAlert';
import StatusBar from '../common/StatusBar';
import { isMac } from '@shared/lib/utils/platform';

interface TablePartitionsProps {
  table: any;
  editable?: boolean;
  onRefresh: () => void;
  onAddPartition: () => void;
  onEditPartition: (partition: Partition) => void;
  onDeletePartition: (partition: Partition) => void;
  onDropPartition: (partition: Partition) => void;
  onCopySql: (sql: string) => void;
  onApplyChanges?: () => void;
  onResetChanges?: () => void;
  hasEdits?: boolean;
  editCount?: number;
  className?: string;
}

interface Partition {
  id: string;
  name: string;
  method: string; // RANGE, LIST, HASH, etc.
  expression?: string;
  values?: string; // e.g., FOR VALUES FROM ... TO ...
  rows?: number;
  sizeBytes?: number;
  createdAt?: string;
  lastAnalyzedAt?: string;
  comment?: string;
}

const TablePartitions: React.FC<TablePartitionsProps> = ({
  table,
  editable = false,
  onRefresh,
  onAddPartition,
  onEditPartition,
  onDeletePartition,
  onDropPartition,
  onCopySql,
  onApplyChanges,
  onResetChanges,
  hasEdits = false,
  editCount = 0,
  className = '',
}) => {
  const [partitions, setPartitions] = useState<Partition[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Partition>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  useEffect(() => {
    if (!table) return;
    loadPartitions();
  }, [table]);

  const loadPartitions = async () => {
    setError(null);
    try {
      // Placeholder: replace with real fetch
      const mock: Partition[] = [
        {
          id: 'p1',
          name: 'p_2024_q1',
          method: 'RANGE',
          expression: 'TO_DATE(qtr_date)',
          values: 'FROM (2024-01-01) TO (2024-04-01)',
          rows: 123456,
          sizeBytes: 24_576_000,
          createdAt: new Date().toISOString(),
          lastAnalyzedAt: new Date().toISOString(),
          comment: 'Q1 2024 data',
        },
        {
          id: 'p2',
          name: 'p_2024_q2',
          method: 'RANGE',
          expression: 'TO_DATE(qtr_date)',
          values: 'FROM (2024-04-01) TO (2024-07-01)',
          rows: 98765,
          sizeBytes: 18_432_000,
          createdAt: new Date().toISOString(),
          lastAnalyzedAt: new Date().toISOString(),
          comment: 'Q2 2024 data',
        },
      ];
      setPartitions(mock);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load partitions');
    }
  };

  const filtered = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return partitions.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      (p.method || '').toLowerCase().includes(lower) ||
      (p.values || '').toLowerCase().includes(lower)
    );
  }, [partitions, searchTerm]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDirection === 'asc' ? -1 : 1;
      if (av > bv) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filtered, sortField, sortDirection]);

  const formatSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`;
  };

  const ctrlOrCmd = (k: string) => (isMac ? `⌘${k}` : `Ctrl+${k}`);

  const headerCell = (label: string, field: keyof Partition) => (
    <div className="table-cell" onClick={() => setSortField(prev => (prev === field ? (setSortDirection(d => (d === 'asc' ? 'desc' : 'asc')) as any, field) : field))}>
      {label} {sortField === field ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
    </div>
  );

  return (
    <div className={`table-info-table ${className || ''}`}>
      <div className="table-info-table-wrap">
        <div className="center-wrap">
          {error && <ErrorAlert error={error} />}

          <div className="table-subheader">
            <div className="table-title">
              <h2>Partitions</h2>
            </div>
            <span className="expand" />
            <div className="actions">
              <button className="btn btn-link btn-fab" onClick={onRefresh} title={`${ctrlOrCmd('r')} or F5`}>
                <i className="material-icons">refresh</i>
              </button>
              {editable && (
                <button className="btn btn-primary btn-fab" onClick={onAddPartition} title={ctrlOrCmd('n')}>
                  <i className="material-icons">add</i>
                </button>
              )}
            </div>
          </div>

          <div className="table-filters">
            <div className="filter-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search partitions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="table-header">
            <div className="table-row header">
              <div className="table-cell">#</div>
              {headerCell('Name', 'name')}
              {headerCell('Method', 'method')}
              <div className="table-cell">Expression</div>
              <div className="table-cell">Values</div>
              {headerCell('Rows', 'rows')}
              {headerCell('Size', 'sizeBytes')}
              <div className="table-cell">Comment</div>
              <div className="table-cell">Actions</div>
            </div>
          </div>

          <div className="table-body">
            {sorted.map((p, idx) => (
              <div key={p.id} className="table-row">
                <div className="table-cell">{idx + 1}</div>
                <div className="table-cell">{p.name}</div>
                <div className="table-cell"><span className="badge badge-info">{p.method}</span></div>
                <div className="table-cell"><code>{p.expression || '-'}</code></div>
                <div className="table-cell"><code>{p.values || '-'}</code></div>
                <div className="table-cell">{p.rows?.toLocaleString() ?? '-'}</div>
                <div className="table-cell">{formatSize(p.sizeBytes)}</div>
                <div className="table-cell">{p.comment || '-'}</div>
                <div className="table-cell">
                  <div className="action-buttons">
                    <button className="btn btn-flat btn-icon" title="Edit" onClick={() => onEditPartition(p)}>
                      <i className="material-icons">edit</i>
                    </button>
                    <button className="btn btn-flat btn-icon" title="Copy SQL" onClick={() => onCopySql(`ALTER TABLE ${table?.name} ... PARTITION ${p.name};`)}>
                      <i className="material-icons">content_copy</i>
                    </button>
                    <button className="btn btn-flat btn-icon" title="Drop" onClick={() => onDropPartition(p)}>
                      <i className="material-icons">delete</i>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {sorted.length === 0 && (
              <div className="no-data">
                <div className="alert alert-info">
                  <i className="material-icons">info</i>
                  <div>
                    <strong>No partitions found</strong>
                    <p>This table has no partitions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="expand" />

      <StatusBar className="tablulator-footer" active={true}>
        <div className="flex flex-middle statusbar-actions">
          {hasEdits && (
            <>
              <button className="btn btn-flat reset" onClick={onResetChanges}>
                Reset
              </button>
              <div className="pending-changes">
                <button className="btn btn-primary" onClick={onApplyChanges}>
                  {editCount > 0 && <span className="badge"><small>{editCount}</small></span>}
                  <span>Apply</span>
                </button>
                <button className="btn btn-primary" onClick={() => onCopySql('-- SQL preview here')}> 
                  <i className="material-icons">arrow_drop_down</i>
                </button>
              </div>
            </>
          )}
        </div>
      </StatusBar>
    </div>
  );
};

export default TablePartitions;
