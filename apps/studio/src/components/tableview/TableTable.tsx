import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import EditorModal from './EditorModal';
import RowFilterBuilder from './RowFilterBuilder';
import ColumnFilterModal from './ColumnFilterModal';

interface TableTableProps {
  table?: any;
  editable?: boolean;
  active?: boolean;
}

const TableTable: React.FC<TableTableProps> = ({ 
  table, 
  editable = true, 
  active = false 
}) => {
  const dispatch = useDispatch();
  const [initialized, setInitialized] = useState(false);
  const [tableFilters, setTableFilters] = useState<any[]>([]);
  const [pendingChangesCount, setPendingChangesCount] = useState(0);
  const [columnFilterModalName, setColumnFilterModalName] = useState<string | null>(null);
  const [columnsWithFilterAndOrder, setColumnsWithFilterAndOrder] = useState<any[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  
  const tableViewWrapperRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const editorModalRef = useRef<any>(null);

  const statusbarMode = useSelector((state: RootState) => state.global.statusbarMode);

  useEffect(() => {
    setInitialized(true);
    if (table) {
      setIsEmpty(!table.data || table.data.length === 0);
      setColumnsWithFilterAndOrder(table.columns || []);
    }
  }, [table]);

  const keymap = {
    'general.refreshTable': () => refreshTable(),
    'general.addRow': () => addRow(),
    'general.deleteRow': () => deleteRow(),
    'general.duplicateRow': () => duplicateRow(),
  };

  const handleRowFilterBuilderInput = (filters: any[]) => {
    setTableFilters(filters);
  };

  const triggerFilter = () => {
    // Apply filters to table data
    console.log('Applying filters:', tableFilters);
  };

  const onSaveEditorModal = (data: any) => {
    // Handle save from editor modal
    console.log('Saving data:', data);
    setPendingChangesCount(prev => prev + 1);
  };

  const applyColumnChanges = (changes: any) => {
    // Apply column filter and order changes
    console.log('Applying column changes:', changes);
    setColumnsWithFilterAndOrder(changes);
  };

  const refreshTable = () => {
    // Refresh table data
    console.log('Refreshing table');
  };

  const addRow = () => {
    if (!editable) return;
    console.log('Adding new row');
  };

  const deleteRow = () => {
    if (!editable) return;
    console.log('Deleting selected row');
  };

  const duplicateRow = () => {
    if (!editable) return;
    console.log('Duplicating selected row');
  };

  const openProperties = () => {
    console.log('Opening table properties');
  };

  const openColumnFilter = () => {
    setColumnFilterModalName('columnFilter');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'r':
          e.preventDefault();
          refreshTable();
          break;
        case 'n':
          e.preventDefault();
          addRow();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          deleteRow();
          break;
        case 'd':
          e.preventDefault();
          duplicateRow();
          break;
      }
    }
  };

  if (!table && initialized) {
    return (
      <div className="tabletable tabcontent flex-col">
        <div className="no-content">
          <div className="empty-state">
            <i className="material-icons">table_chart</i>
            <h3>No Table Selected</h3>
            <p>Select a table from the sidebar to view its data.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`tabletable tabcontent flex-col ${!editable ? 'view-only' : ''}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <EditorModal
        ref={editorModalRef}
        onSave={onSaveEditorModal}
      />

      {table && (
        <>
          {table.columns && table.columns.length > 0 && (
            <RowFilterBuilder
              columns={table.columns}
              reactiveFilters={tableFilters}
              onInput={handleRowFilterBuilderInput}
              onSubmit={triggerFilter}
            />
          )}

          {isEmpty && (
            <div className="empty-placeholder">
              <div className="empty-state">
                <i className="material-icons">table_chart</i>
                <h3>No Data</h3>
                <p>This table is empty.</p>
                {editable && (
                  <button className="btn btn-primary" onClick={addRow}>
                    <i className="material-icons">add</i>
                    Add First Row
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="table-view-wrapper" ref={tableViewWrapperRef}>
            <div ref={tableRef} className="spreadsheet-table">
              {table.data && table.data.length > 0 ? (
                <div className="data-table">
                  <table className="table">
                    <thead>
                      <tr>
                        {table.columns.map((column: any, index: number) => (
                          <th key={index} className="column-header">
                            <div className="header-content">
                              <span className="column-name">{column.name}</span>
                              <span className="column-type">{column.type}</span>
                            </div>
                          </th>
                        ))}
                        {editable && (
                          <th className="actions-header">
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={addRow}
                              title="Add Row (Ctrl+N)"
                            >
                              <i className="material-icons">add</i>
                            </button>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {table.data.slice(0, 100).map((row: any, rowIndex: number) => (
                        <tr key={rowIndex} className="data-row">
                          {table.columns.map((column: any, colIndex: number) => (
                            <td key={colIndex} className="data-cell">
                              <span className="cell-value">
                                {row[column.name] !== null && row[column.name] !== undefined
                                  ? String(row[column.name])
                                  : <span className="null-value">NULL</span>
                                }
                              </span>
                            </td>
                          ))}
                          {editable && (
                            <td className="actions-cell">
                              <div className="row-actions">
                                <button
                                  className="btn btn-sm btn-secondary"
                                  onClick={() => duplicateRow()}
                                  title="Duplicate Row (Ctrl+D)"
                                >
                                  <i className="material-icons">content_copy</i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => deleteRow()}
                                  title="Delete Row (Delete)"
                                >
                                  <i className="material-icons">delete</i>
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {table.data.length > 100 && (
                    <div className="table-footer">
                      <p>Showing first 100 rows of {table.data.length} total rows</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-table">
                  <p>No data available</p>
                </div>
              )}
            </div>
          </div>

          <ColumnFilterModal
            modalName={columnFilterModalName}
            columnsWithFilterAndOrder={columnsWithFilterAndOrder}
            hasPendingChanges={pendingChangesCount > 0}
            onChange={applyColumnChanges}
            onClose={() => setColumnFilterModalName(null)}
          />
        </>
      )}

      <div className="statusbar" data-mode={statusbarMode} data-active={active}>
        <div className="truncate statusbar-info">
          <button
            className="btn btn-flat btn-icon end"
            onClick={openProperties}
            title="Table Properties"
          >
            <i className="material-icons">info</i>
          </button>
          
          <button
            className="btn btn-flat btn-icon"
            onClick={openColumnFilter}
            title="Column Filter"
          >
            <i className="material-icons">filter_list</i>
          </button>
          
          <span className="table-info">
            {table ? `${table.name} (${table.data?.length || 0} rows)` : 'No table selected'}
          </span>
          
          {pendingChangesCount > 0 && (
            <span className="pending-changes">
              {pendingChangesCount} unsaved changes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableTable;
