import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ColumnMapping {
  sourceColumn: string;
  targetColumn: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isUnique: boolean;
  defaultValue?: string;
  comment?: string;
}

interface ImportMapperProps {
  createTable: boolean;
  defaultSchema?: string;
  sourceColumns: string[];
  targetColumns: string[];
  onMappingChange: (mappings: ColumnMapping[]) => void;
  onTruncateTableChange: (truncate: boolean) => void;
  onRunAsUpsertChange: (upsert: boolean) => void;
  onNewTableSchemaChange: (schema: string) => void;
  onNewTableNameChange: (name: string) => void;
  onColumnAdd: (mapping: ColumnMapping) => void;
  onColumnRemove: (index: number) => void;
  onColumnEdit: (index: number, mapping: ColumnMapping) => void;
  onColumnReorder: (mappings: ColumnMapping[]) => void;
  onColumnValidate: (mapping: ColumnMapping) => string | null;
  onColumnAutoMap: () => void;
  onColumnClear: () => void;
  onColumnReset: () => void;
  onColumnExport: () => void;
  onColumnImport: () => void;
  onColumnBackup: () => void;
  onColumnRestore: () => void;
  onColumnClone: () => void;
  onColumnDelete: () => void;
  className?: string;
}

const ImportMapper: React.FC<ImportMapperProps> = ({
  createTable,
  defaultSchema,
  sourceColumns,
  targetColumns,
  onMappingChange,
  onTruncateTableChange,
  onRunAsUpsertChange,
  onNewTableSchemaChange,
  onNewTableNameChange,
  onColumnAdd,
  onColumnRemove,
  onColumnEdit,
  onColumnReorder,
  onColumnValidate,
  onColumnAutoMap,
  onColumnClear,
  onColumnReset,
  onColumnExport,
  onColumnImport,
  onColumnBackup,
  onColumnRestore,
  onColumnClone,
  onColumnDelete,
  className = '',
}) => {
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [truncateTable, setTruncateTable] = useState(false);
  const [runAsUpsert, setRunAsUpsert] = useState(false);
  const [newTableSchema, setNewTableSchema] = useState(defaultSchema || '');
  const [newTableName, setNewTableName] = useState('untitled_table');
  const [showMenu, setShowMenu] = useState(false);
  const [draggedItem, setDraggedItem] = useState<ColumnMapping | null>(null);
  const [dragOverItem, setDragOverItem] = useState<ColumnMapping | null>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const dataTypes = [
    'VARCHAR',
    'TEXT',
    'INTEGER',
    'BIGINT',
    'DECIMAL',
    'FLOAT',
    'DOUBLE',
    'BOOLEAN',
    'DATE',
    'DATETIME',
    'TIMESTAMP',
    'TIME',
    'BLOB',
    'JSON',
    'UUID',
  ];

  useEffect(() => {
    if (sourceColumns.length > 0 && targetColumns.length > 0) {
      const autoMappings: ColumnMapping[] = sourceColumns.map((sourceCol, index) => {
        const targetCol = targetColumns[index] || sourceCol;
        return {
          sourceColumn: sourceCol,
          targetColumn: targetCol,
          dataType: 'VARCHAR',
          isNullable: true,
          isPrimaryKey: false,
          isUnique: false,
          defaultValue: '',
          comment: '',
        };
      });
      setMappings(autoMappings);
      onMappingChange(autoMappings);
    }
  }, [sourceColumns, targetColumns]);

  const handleTruncateTableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setTruncateTable(value);
    onTruncateTableChange(value);
  };

  const handleRunAsUpsertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setRunAsUpsert(value);
    onRunAsUpsertChange(value);
  };

  const handleNewTableSchemaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTableSchema(value);
    onNewTableSchemaChange(value);
  };

  const handleNewTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTableName(value);
    onNewTableNameChange(value);
  };

  const handleMappingChange = (index: number, field: keyof ColumnMapping, value: any) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    setMappings(newMappings);
    onMappingChange(newMappings);
    onColumnEdit(index, newMappings[index]);
  };

  const handleColumnAdd = () => {
    const newMapping: ColumnMapping = {
      sourceColumn: '',
      targetColumn: '',
      dataType: 'VARCHAR',
      isNullable: true,
      isPrimaryKey: false,
      isUnique: false,
      defaultValue: '',
      comment: '',
    };
    const newMappings = [...mappings, newMapping];
    setMappings(newMappings);
    onMappingChange(newMappings);
    onColumnAdd(newMapping);
  };

  const handleColumnRemove = (index: number) => {
    const newMappings = mappings.filter((_, i) => i !== index);
    setMappings(newMappings);
    onMappingChange(newMappings);
    onColumnRemove(index);
  };

  const handleColumnReorder = (fromIndex: number, toIndex: number) => {
    const newMappings = [...mappings];
    const [removed] = newMappings.splice(fromIndex, 1);
    newMappings.splice(toIndex, 0, removed);
    setMappings(newMappings);
    onMappingChange(newMappings);
    onColumnReorder(newMappings);
  };

  const handleDragStart = (e: React.DragEvent, mapping: ColumnMapping) => {
    setDraggedItem(mapping);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, mapping: ColumnMapping) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(mapping);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetMapping: ColumnMapping) => {
    e.preventDefault();
    
    if (draggedItem && dragOverItem) {
      const fromIndex = mappings.findIndex(m => m === draggedItem);
      const toIndex = mappings.findIndex(m => m === targetMapping);
      
      if (fromIndex !== -1 && toIndex !== -1) {
        handleColumnReorder(fromIndex, toIndex);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleColumnAutoMap = () => {
    onColumnAutoMap();
    setShowMenu(false);
  };

  const handleColumnClear = () => {
    onColumnClear();
    setShowMenu(false);
  };

  const handleColumnReset = () => {
    onColumnReset();
    setShowMenu(false);
  };

  const handleColumnExport = () => {
    onColumnExport();
    setShowMenu(false);
  };

  const handleColumnImport = () => {
    onColumnImport();
    setShowMenu(false);
  };

  const handleColumnBackup = () => {
    onColumnBackup();
    setShowMenu(false);
  };

  const handleColumnRestore = () => {
    onColumnRestore();
    setShowMenu(false);
  };

  const handleColumnClone = () => {
    onColumnClone();
    setShowMenu(false);
  };

  const handleColumnDelete = () => {
    onColumnDelete();
    setShowMenu(false);
  };

  return (
    <section className={`import-section-wrapper schema-builder ${className}`}>
      {!createTable && (
        <div className="card-flat padding form-group">
          <label className="checkbox-group">
            <input
              type="checkbox"
              className="form-control"
              checked={truncateTable}
              onChange={handleTruncateTableChange}
            />
            Truncate the table before importing new data
          </label>
          
          <label className="checkbox-group">
            <input
              type="checkbox"
              className="form-control"
              checked={runAsUpsert}
              onChange={handleRunAsUpsertChange}
            />
            Import data as an Upsert (Be sure to map a primary key field!)
          </label>
        </div>
      )}

      {createTable && (
        <form className="card-flat form-group padding">
          {defaultSchema && (
            <div className="form-group">
              <label htmlFor="schema">Schema</label>
              <input
                type="text"
                id="schema"
                value={newTableSchema}
                onChange={handleNewTableSchemaChange}
                placeholder={defaultSchema}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="table">Table Name</label>
            <input
              type="text"
              id="table"
              value={newTableName}
              onChange={handleNewTableNameChange}
              placeholder="untitled_table"
            />
          </div>
        </form>
      )}

      <div className={`mapper-wrapper ${createTable ? 'mapper-wrapper--create' : ''}`}>
        <div className="mapper-header">
          <h3>Column Mapping</h3>
          <div className="mapper-actions">
            <button
              className="btn btn-flat btn-icon"
              onClick={handleMenuToggle}
              title="Column Actions"
            >
              <i className="material-icons">more_vert</i>
            </button>

            {showMenu && (
              <div className="mapper-menu">
                <div className="menu-item" onClick={handleColumnAutoMap}>
                  <i className="material-icons">auto_fix_high</i>
                  <span>Auto Map</span>
                </div>

                <div className="menu-item" onClick={handleColumnClear}>
                  <i className="material-icons">clear</i>
                  <span>Clear All</span>
                </div>

                <div className="menu-item" onClick={handleColumnReset}>
                  <i className="material-icons">refresh</i>
                  <span>Reset</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item" onClick={handleColumnExport}>
                  <i className="material-icons">export</i>
                  <span>Export Mapping</span>
                </div>

                <div className="menu-item" onClick={handleColumnImport}>
                  <i className="material-icons">import</i>
                  <span>Import Mapping</span>
                </div>

                <div className="menu-item" onClick={handleColumnBackup}>
                  <i className="material-icons">backup</i>
                  <span>Backup Mapping</span>
                </div>

                <div className="menu-item" onClick={handleColumnRestore}>
                  <i className="material-icons">restore</i>
                  <span>Restore Mapping</span>
                </div>

                <div className="menu-item" onClick={handleColumnClone}>
                  <i className="material-icons">content_copy</i>
                  <span>Clone Mapping</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item danger" onClick={handleColumnDelete}>
                  <i className="material-icons">delete</i>
                  <span>Delete Mapping</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary btn-fab"
              onClick={handleColumnAdd}
              title="Add Column"
            >
              <i className="material-icons">add</i>
            </button>
          </div>
        </div>

        <div className="mapper-table">
          <div className="mapper-table-header">
            <div className="mapper-column">Source Column</div>
            <div className="mapper-column">Target Column</div>
            <div className="mapper-column">Data Type</div>
            <div className="mapper-column">Nullable</div>
            <div className="mapper-column">Primary Key</div>
            <div className="mapper-column">Unique</div>
            <div className="mapper-column">Default Value</div>
            <div className="mapper-column">Comment</div>
            <div className="mapper-column">Actions</div>
          </div>

          <div className="mapper-table-body">
            {mappings.map((mapping, index) => (
              <div
                key={index}
                className={`mapper-row ${draggedItem === mapping ? 'dragging' : ''} ${dragOverItem === mapping ? 'drag-over' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, mapping)}
                onDragOver={(e) => handleDragOver(e, mapping)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, mapping)}
              >
                <div className="mapper-column">
                  <select
                    value={mapping.sourceColumn}
                    onChange={(e) => handleMappingChange(index, 'sourceColumn', e.target.value)}
                  >
                    <option value="">Select Source Column</option>
                    {sourceColumns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mapper-column">
                  <input
                    type="text"
                    value={mapping.targetColumn}
                    onChange={(e) => handleMappingChange(index, 'targetColumn', e.target.value)}
                    placeholder="Target column name"
                  />
                </div>

                <div className="mapper-column">
                  <select
                    value={mapping.dataType}
                    onChange={(e) => handleMappingChange(index, 'dataType', e.target.value)}
                  >
                    {dataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mapper-column">
                  <input
                    type="checkbox"
                    checked={mapping.isNullable}
                    onChange={(e) => handleMappingChange(index, 'isNullable', e.target.checked)}
                  />
                </div>

                <div className="mapper-column">
                  <input
                    type="checkbox"
                    checked={mapping.isPrimaryKey}
                    onChange={(e) => handleMappingChange(index, 'isPrimaryKey', e.target.checked)}
                  />
                </div>

                <div className="mapper-column">
                  <input
                    type="checkbox"
                    checked={mapping.isUnique}
                    onChange={(e) => handleMappingChange(index, 'isUnique', e.target.checked)}
                  />
                </div>

                <div className="mapper-column">
                  <input
                    type="text"
                    value={mapping.defaultValue || ''}
                    onChange={(e) => handleMappingChange(index, 'defaultValue', e.target.value)}
                    placeholder="Default value"
                  />
                </div>

                <div className="mapper-column">
                  <input
                    type="text"
                    value={mapping.comment || ''}
                    onChange={(e) => handleMappingChange(index, 'comment', e.target.value)}
                    placeholder="Column comment"
                  />
                </div>

                <div className="mapper-column">
                  <div className="mapper-actions">
                    <button
                      className="btn btn-flat btn-icon"
                      onClick={() => handleColumnRemove(index)}
                      title="Remove Column"
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {mappings.length === 0 && (
          <div className="no-mappings">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>No column mappings</strong>
                <p>Add column mappings to define how source data should be imported.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImportMapper;
