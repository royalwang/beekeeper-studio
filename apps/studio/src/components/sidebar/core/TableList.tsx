import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const TableList: React.FC = () => {
  const tables = useSelector((state: RootState) => state.global.tables);
  const entityFilter = useSelector((state: RootState) => state.global.entityFilter);

  return (
    <div className="table-list">
      <div className="list-header">
        <h4>Tables</h4>
        <div className="filter-controls">
          <label>
            <input
              type="checkbox"
              checked={entityFilter.showTables}
              onChange={(e) => {
                // Handle filter change
                console.log('Show tables:', e.target.checked);
              }}
            />
            Tables
          </label>
          <label>
            <input
              type="checkbox"
              checked={entityFilter.showViews}
              onChange={(e) => {
                // Handle filter change
                console.log('Show views:', e.target.checked);
              }}
            />
            Views
          </label>
          <label>
            <input
              type="checkbox"
              checked={entityFilter.showRoutines}
              onChange={(e) => {
                // Handle filter change
                console.log('Show routines:', e.target.checked);
              }}
            />
            Routines
          </label>
        </div>
      </div>
      <div className="list-content">
        {tables.length > 0 ? (
          <ul className="table-items">
            {tables.map((table) => (
              <li key={table.name} className="table-item">
                <span className="table-name">{table.name}</span>
                <span className="table-type">{table.entityType}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            <p>No tables found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableList;
