import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Tabulator } from 'tabulator-tables';
import 'tabulator-tables/dist/css/tabulator.min.css';

interface ImportPreviewProps {
  stepperProps: {
    tabId: string | null;
    importStarted: boolean;
    timer: NodeJS.Timeout | null;
    importError: string | null;
  };
  tableName: string;
  importOptions: any;
  columnsImportedCount: number;
  columnsIgnoredCount: number;
  previewData: any[];
  onImportStart: () => void;
  onImportComplete: () => void;
  onImportError: (error: string) => void;
  className?: string;
}

const ImportPreview: React.FC<ImportPreviewProps> = ({
  stepperProps,
  tableName,
  importOptions,
  columnsImportedCount,
  columnsIgnoredCount,
  previewData,
  onImportStart,
  onImportComplete,
  onImportError,
  className = '',
}) => {
  const tabulatorRef = useRef<HTMLDivElement>(null);
  const [tabulator, setTabulator] = useState<Tabulator | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  useEffect(() => {
    if (tabulatorRef.current && previewData.length > 0) {
      const table = new Tabulator(tabulatorRef.current, {
        data: previewData,
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
        columns: generateColumns(previewData[0] || {}),
        rowFormatter: (row) => {
          const element = row.getElement();
          if (element) {
            element.style.borderBottom = '1px solid #e0e0e0';
          }
        },
        cellEdited: (cell) => {
          // Handle cell editing if needed
          console.log('Cell edited:', cell.getField(), cell.getValue());
        },
      });

      setTabulator(table);

      return () => {
        table.destroy();
      };
    }
  }, [previewData]);

  const generateColumns = (sampleRow: any) => {
    return Object.keys(sampleRow).map((key) => ({
      title: key,
      field: key,
      width: 150,
      minWidth: 100,
      resizable: true,
      editor: 'input',
      validator: 'required',
      formatter: (cell: any) => {
        const value = cell.getValue();
        if (value === null || value === undefined) {
          return '<span class="null-value">NULL</span>';
        }
        if (typeof value === 'string' && value.length > 100) {
          return `<span title="${value}">${value.substring(0, 100)}...</span>`;
        }
        return value;
      },
    }));
  };

  const handleImportStart = async () => {
    setIsLoading(true);
    try {
      await onImportStart();
    } catch (error) {
      onImportError(error instanceof Error ? error.message : 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPreview = () => {
    if (tabulator) {
      tabulator.download('csv', `import-preview-${tableName}.csv`);
    }
  };

  const handleRefreshPreview = () => {
    // Refresh preview data
    window.location.reload();
  };

  return (
    <section className={`import-table-wrapper ${className}`}>
      <div className="import-section-wrapper">
        <div className="card-flat padding">
          <h3>Table</h3>
          <p>{tableName}</p>
        </div>
        
        <div className="preview-column-stats">
          <div className="card-flat padding">
            <h3>Columns Mapped</h3>
            <p>{columnsImportedCount}</p>
          </div>
          
          {!importOptions?.createNewTable && (
            <div className="card-flat padding">
              <h3>Columns Ignored</h3>
              <p>{columnsIgnoredCount}</p>
            </div>
          )}
        </div>
      </div>

      <div className="preview-controls">
        <div className="preview-actions">
          <button
            className="btn btn-flat"
            onClick={handleRefreshPreview}
            disabled={isLoading}
          >
            <i className="material-icons">refresh</i>
            Refresh Preview
          </button>
          
          <button
            className="btn btn-flat"
            onClick={handleExportPreview}
            disabled={!tabulator || previewData.length === 0}
          >
            <i className="material-icons">download</i>
            Export Preview
          </button>
        </div>

        <div className="preview-info">
          <div className="alert alert-info">
            <i className="material-icons">info</i>
            <div>
              <strong>Preview Information:</strong>
              <ul>
                <li>Showing first {previewData.length} rows</li>
                <li>Total columns: {columnsImportedCount + columnsIgnoredCount}</li>
                <li>Mapped columns: {columnsImportedCount}</li>
                {!importOptions?.createNewTable && (
                  <li>Ignored columns: {columnsIgnoredCount}</li>
                )}
                <li>Target table: {tableName}</li>
                <li>Database: {activeConnection?.name || 'Unknown'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-table-container">
        <div ref={tabulatorRef} className="tabulator-container" />
      </div>

      {stepperProps.importError && (
        <div className="import-error">
          <div className="alert alert-danger">
            <i className="material-icons">error_outline</i>
            <div>
              <strong>Import Error:</strong>
              <p>{stepperProps.importError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="import-actions">
        <button
          className="btn btn-primary"
          onClick={handleImportStart}
          disabled={isLoading || stepperProps.importStarted || previewData.length === 0}
        >
          {isLoading ? (
            <>
              <i className="material-icons">hourglass_empty</i>
              Starting Import...
            </>
          ) : (
            <>
              <i className="material-icons">play_arrow</i>
              Start Import
            </>
          )}
        </button>
      </div>
    </section>
  );
};

export default ImportPreview;
