import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ImportTableProps {
  onTableSelect?: (table: any) => void;
  onCreateTable?: (tableData: any) => void;
}

const ImportTable: React.FC<ImportTableProps> = ({ 
  onTableSelect, 
  onCreateTable 
}) => {
  const [createTableFromFile, setCreateTableFromFile] = useState(false);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [schemaTables, setSchemaTables] = useState<any[]>([]);

  const tables = useSelector((state: RootState) => state.global.tables);

  useEffect(() => {
    // Filter tables based on search query
    const filtered = tables.filter(table =>
      table.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    setSchemaTables(filtered);
  }, [tables, filterQuery]);

  const updateTableSwitch = () => {
    setCreateTableFromFile(!createTableFromFile);
    if (!createTableFromFile) {
      setSelectedTable(null);
    }
  };

  const clearFilter = () => {
    setFilterQuery('');
  };

  const handleTableSelect = (table: any) => {
    setSelectedTable(table);
    onTableSelect?.(table);
  };

  const handleCreateTable = () => {
    if (createTableFromFile) {
      // In real implementation, this would create table from import file
      const tableData = {
        name: 'imported_table',
        columns: [],
        data: []
      };
      onCreateTable?.(tableData);
    }
  };

  const selectedTableName = selectedTable?.name || '';

  return (
    <section className="import-section-wrapper schema-builder">
      <div className="card-flat padding">
        <h3 className="card-title">Create Table</h3>
        <div className="table-switch">
          <label htmlFor="createTableSwitch">
            Create Table from Import File
          </label>
          <div className="switch-container">
            <input
              type="checkbox"
              id="createTableSwitch"
              checked={createTableFromFile}
              onChange={updateTableSwitch}
              className="switch-input"
            />
            <label htmlFor="createTableSwitch" className="switch-label">
              <span className="switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <h3 className="card-title decision-break">OR</h3>

      <div className="card-flat padding">
        <h3 className="card-title">
          {selectedTable ? `Selected Table: ${selectedTableName}` : 'Select Table'}
        </h3>

        <div className="fixed">
          <div className="filter">
            <div className="filter-wrap">
              <input
                className="filter-input"
                type="text"
                placeholder="Filter"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
              <div className="filter-actions">
                {filterQuery && (
                  <button
                    className="btn btn-sm btn-icon"
                    onClick={clearFilter}
                    title="Clear Filter"
                  >
                    <i className="material-icons">cancel</i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <form className="schema-toggle-container">
          {schemaTables.map((schemaTable, index) => (
            <div key={index} className="schema-toggle-item">
              <div className="table-option">
                <label className="table-option-label">
                  <input
                    type="radio"
                    name="selectedTable"
                    value={schemaTable.name}
                    checked={selectedTable?.name === schemaTable.name}
                    onChange={() => handleTableSelect(schemaTable)}
                  />
                  <div className="table-info">
                    <span className="table-name">{schemaTable.name}</span>
                    <span className="table-type">{schemaTable.entityType}</span>
                  </div>
                </label>
              </div>
            </div>
          ))}

          {schemaTables.length === 0 && (
            <div className="no-tables">
              <p>No tables found</p>
            </div>
          )}
        </form>

        <div className="import-actions">
          {createTableFromFile ? (
            <button
              className="btn btn-primary"
              onClick={handleCreateTable}
            >
              <i className="material-icons">create_new_folder</i>
              Create Table from File
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => selectedTable && onTableSelect?.(selectedTable)}
              disabled={!selectedTable}
            >
              <i className="material-icons">import_export</i>
              Import to Selected Table
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ImportTable;
