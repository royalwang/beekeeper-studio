import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';
import ErrorAlert from '../common/ErrorAlert';

interface TableSchemaProps {
  table: any;
  editable?: boolean;
  onRefreshColumns: () => void;
  onAddColumn: () => void;
  onEditColumn: (column: any) => void;
  onDeleteColumn: (column: any) => void;
  onColumnReorder: (columns: any[]) => void;
  error?: string | null;
  notice?: string | null;
  className?: string;
  children?: React.ReactNode;
}

const TableSchema: React.FC<TableSchemaProps> = ({
  table,
  editable = false,
  onRefreshColumns,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onColumnReorder,
  error,
  notice,
  className = '',
  children,
}) => {
  const tableSchemaRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const hotkeys = {
    'ctrl+r': onRefreshColumns,
    'meta+r': onRefreshColumns,
    'f5': onRefreshColumns,
    'ctrl+n': onAddColumn,
    'meta+n': onAddColumn,
  };

  useEffect(() => {
    if (tableSchemaRef.current && table?.columns) {
      const tableInstance = new Tabulator(tableSchemaRef.current, {
        data: table.columns,
        layout: 'fitColumns',
        height: 400,
        pagination: 'local',
        paginationSize: 50,
        paginationSizeSelector: [10, 25, 50, 100],
        movableColumns: true,
        resizableRows: true,
        selectable: true,
        clipboard: true,
        clipboardCopyConfig: {
          columnHeaders: true,
          columnGroups: true,
        },
        columns: generateColumns(),
        rowFormatter: (row) => {
          const element = row.getElement();
          if (element) {
            element.style.borderBottom = '1px solid #e0e0e0';
          }
        },
        cellEdited: (cell) => {
          const column = cell.getRow().getData();
          onEditColumn(column);
        },
        rowMoved: (row) => {
          const columns = tabulator?.getData() || [];
          onColumnReorder(columns);
        },
      });

      setTabulator(tableInstance);

      return () => {
        tableInstance.destroy();
      };
    }
  }, [table?.columns]);

  const generateColumns = () => {
    return [
      {
        title: 'Column Name',
        field: 'columnName',
        width: 200,
        minWidth: 150,
        resizable: true,
        editor: editable ? 'input' : false,
        validator: 'required',
        formatter: (cell: any) => {
          const value = cell.getValue();
          return `<span class="column-name">${value}</span>`;
        },
      },
      {
        title: 'Data Type',
        field: 'dataType',
        width: 150,
        minWidth: 100,
        resizable: true,
        editor: editable ? 'input' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return `<span class="data-type">${value}</span>`;
        },
      },
      {
        title: 'Nullable',
        field: 'isNullable',
        width: 100,
        minWidth: 80,
        resizable: true,
        editor: editable ? 'tickCross' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? '<span class="nullable">Yes</span>' : '<span class="not-nullable">No</span>';
        },
      },
      {
        title: 'Default Value',
        field: 'defaultValue',
        width: 150,
        minWidth: 100,
        resizable: true,
        editor: editable ? 'input' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? `<span class="default-value">${value}</span>` : '<span class="no-default">NULL</span>';
        },
      },
      {
        title: 'Primary Key',
        field: 'isPrimaryKey',
        width: 100,
        minWidth: 80,
        resizable: true,
        editor: editable ? 'tickCross' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? '<span class="primary-key">Yes</span>' : '<span class="not-primary">No</span>';
        },
      },
      {
        title: 'Auto Increment',
        field: 'isAutoIncrement',
        width: 120,
        minWidth: 100,
        resizable: true,
        editor: editable ? 'tickCross' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? '<span class="auto-increment">Yes</span>' : '<span class="not-auto">No</span>';
        },
      },
      {
        title: 'Unique',
        field: 'isUnique',
        width: 100,
        minWidth: 80,
        resizable: true,
        editor: editable ? 'tickCross' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? '<span class="unique">Yes</span>' : '<span class="not-unique">No</span>';
        },
      },
      {
        title: 'Indexed',
        field: 'isIndexed',
        width: 100,
        minWidth: 80,
        resizable: true,
        editor: editable ? 'tickCross' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? '<span class="indexed">Yes</span>' : '<span class="not-indexed">No</span>';
        },
      },
      {
        title: 'Comment',
        field: 'comment',
        width: 200,
        minWidth: 150,
        resizable: true,
        editor: editable ? 'input' : false,
        formatter: (cell: any) => {
          const value = cell.getValue();
          return value ? `<span class="comment">${value}</span>` : '<span class="no-comment">-</span>';
        },
      },
      {
        title: 'Actions',
        field: 'actions',
        width: 100,
        minWidth: 80,
        resizable: false,
        formatter: (cell: any) => {
          if (!editable) return '';
          const row = cell.getRow();
          const data = row.getData();
          return `
            <div class="column-actions">
              <button class="btn btn-flat btn-icon" onclick="editColumn('${data.columnName}')" title="Edit Column">
                <i class="material-icons">edit</i>
              </button>
              <button class="btn btn-flat btn-icon" onclick="deleteColumn('${data.columnName}')" title="Delete Column">
                <i class="material-icons">delete</i>
              </button>
            </div>
          `;
        },
      },
    ];
  };

  const handleRefreshColumns = async () => {
    setIsLoading(true);
    try {
      await onRefreshColumns();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddColumn = () => {
    onAddColumn();
  };

  const handleEditColumn = (columnName: string) => {
    const column = table.columns.find((col: any) => col.columnName === columnName);
    if (column) {
      onEditColumn(column);
    }
  };

  const handleDeleteColumn = (columnName: string) => {
    const column = table.columns.find((col: any) => col.columnName === columnName);
    if (column) {
      onDeleteColumn(column);
    }
  };

  const handleExportSchema = () => {
    if (tabulator) {
      tabulator.download('csv', `table-schema-${table.name}.csv`);
    }
  };

  const handlePrintSchema = () => {
    window.print();
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
            {children}
            <span className="expand" />
            <div className="actions">
              <button
                onClick={handleRefreshColumns}
                className="btn btn-link btn-fab"
                title="Refresh Columns (Ctrl+R or F5)"
                disabled={isLoading}
              >
                <i className="material-icons">refresh</i>
              </button>
              
              {editable && (
                <button
                  onClick={handleAddColumn}
                  className="btn btn-primary btn-fab"
                  title="Add Column (Ctrl+N)"
                >
                  <i className="material-icons">add</i>
                </button>
              )}

              <button
                onClick={handleExportSchema}
                className="btn btn-flat btn-fab"
                title="Export Schema"
                disabled={!table?.columns?.length}
              >
                <i className="material-icons">download</i>
              </button>

              <button
                onClick={handlePrintSchema}
                className="btn btn-flat btn-fab"
                title="Print Schema"
                disabled={!table?.columns?.length}
              >
                <i className="material-icons">print</i>
              </button>
            </div>
          </div>

          <div ref={tableSchemaRef} className="tabulator-container" />

          {table?.columns?.length > 0 && (
            <div className="columns-loading-disclaimer">
              <p>Columns loading.</p>
              <p>This may take a few minutes depending on column count.</p>
            </div>
          )}

          {!table?.columns?.length && (
            <div className="no-columns">
              <div className="alert alert-info">
                <i className="material-icons">info</i>
                <div>
                  <strong>No columns found</strong>
                  <p>This table doesn't have any columns or the schema information is not available.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableSchema;
