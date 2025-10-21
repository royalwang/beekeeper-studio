import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import TableSchema from './tableinfo/TableSchema';
import TableIndexes from './tableinfo/TableIndexes';
import TableRelations from './tableinfo/TableRelations';
import TableTriggers from './tableinfo/TableTriggers';
import TablePartitions from './tableinfo/TablePartitions';
import TableSchemaValidation from './tableinfo/TableSchemaValidation';
import ErrorAlert from './common/ErrorAlert';
import { AppEvent } from '../common/AppEvent';

interface TabTablePropertiesProps {
  tab: any;
  active: boolean;
  onClose?: () => void;
}

interface Pill {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  dirty: boolean;
}

const TabTableProperties: React.FC<TabTablePropertiesProps> = ({
  tab,
  active,
  onClose
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [table, setTable] = useState<any>(null);
  const [activePill, setActivePill] = useState('schema');
  const [primaryKeys, setPrimaryKeys] = useState<string[]>([]);
  const [properties, setProperties] = useState<any>({});

  const usedConfig = useSelector((state: any) => state.connection?.usedConfig);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const pills: Pill[] = [
    {
      id: 'schema',
      name: 'Schema',
      component: TableSchema,
      dirty: false,
    },
    {
      id: 'indexes',
      name: 'Indexes',
      component: TableIndexes,
      dirty: false,
    },
    {
      id: 'relations',
      name: 'Relations',
      component: TableRelations,
      dirty: false,
    },
    {
      id: 'triggers',
      name: 'Triggers',
      component: TableTriggers,
      dirty: false,
    },
    {
      id: 'partitions',
      name: 'Partitions',
      component: TablePartitions,
      dirty: false,
    },
    {
      id: 'validation',
      name: 'Validation',
      component: TableSchemaValidation,
      dirty: false,
    },
  ];

  const loadTable = useCallback(async () => {
    if (!tab?.table) return;

    setLoading(true);
    setError(null);

    try {
      // Mock table loading
      console.log('Loading table properties for:', tab.table);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTable = {
        id: 1,
        name: tab.table,
        schema: tab.schema || 'public',
        columns: [
          { name: 'id', type: 'integer', isNullable: false, isPk: true },
          { name: 'name', type: 'varchar', isNullable: true, isPk: false },
          { name: 'created_at', type: 'timestamp', isNullable: false, isPk: false },
        ],
        indexes: [],
        relations: [],
        triggers: [],
        partitions: [],
      };
      
      setTable(mockTable);
      setPrimaryKeys(['id']);
      setProperties({
        engine: 'InnoDB',
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
      });
    } catch (err) {
      setError('Failed to load table properties');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  const refresh = useCallback(() => {
    loadTable();
  }, [loadTable]);

  const handlePillClick = useCallback((pillId: string) => {
    setActivePill(pillId);
  }, []);

  const handleActionCompleted = useCallback(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (active && tab) {
      loadTable();
    }
  }, [active, tab, loadTable]);

  if (error) {
    return (
      <div className="table-properties">
        <div className="alert-wrapper">
          <ErrorAlert error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="table-properties">
      <div className="table-properties-header">
        {pills.length > 1 && (
          <div className="nav-pills">
            {pills.map((pill) => (
              <a
                key={pill.id}
                className={`nav-pill ${pill.id === activePill ? 'active' : ''}`}
                title={pill.dirty ? 'Unsaved Changes' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handlePillClick(pill.id);
                }}
              >
                {pill.name} {pill.dirty ? '*' : ''}
              </a>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="table-properties-loading">
          <div className="progress-bar">
            <div className="progress-content">
              <div className="progress-spinner">
                <div className="spinner"></div>
              </div>
              <p>Loading table properties...</p>
            </div>
          </div>
        </div>
      )}

      {table && !loading && (
        <div className="table-properties-wrap">
          {pills.map((pill) => {
            const PillComponent = pill.component;
            return (
              <div
                key={pill.id}
                className="schema-builder"
                style={{ display: pill.id === activePill ? 'block' : 'none' }}
              >
                <PillComponent
                  table={table}
                  primaryKeys={primaryKeys}
                  tabState={pill}
                  properties={properties}
                  active={pill.id === activePill && active}
                  onActionCompleted={handleActionCompleted}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TabTableProperties;
