import React, { useState, useEffect } from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: any;
  queryName?: string;
  filters?: any;
  onExport?: (exportData: any) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  table,
  queryName,
  filters,
  onExport,
}) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [fileName, setFileName] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
    { value: 'xlsx', label: 'Excel', description: 'Microsoft Excel format' },
    { value: 'sql', label: 'SQL', description: 'SQL INSERT statements' },
  ];

  useEffect(() => {
    if (isOpen) {
      // Generate default filename
      const defaultName = table ? table.name : queryName || 'export';
      setFileName(`${defaultName}_${new Date().toISOString().split('T')[0]}`);
    }
  }, [isOpen, table, queryName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      setError('Please enter a file name');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const exportData = {
        format: exportFormat,
        fileName: fileName.trim(),
        includeHeaders,
        table: table?.name,
        query: queryName,
        filters,
      };

      onExport?.(exportData);
      
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const filterTooltip = filters ? 'Export will include applied filters' : '';

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content export-modal">
        <form onSubmit={handleSubmit}>
          <div className="dialog-content">
            <div className="dialog-c-title flex flex-middle">
              <div>
                Export
                <span className="text-primary truncate">
                  {table ? table.name : queryName}
                </span>
                {filters && (
                  <span className="text-light" title={filterTooltip}>
                    (Filtered)
                  </span>
                )}
                <span className="badge badge-info">Beta</span>
              </div>
            </div>

            <p>
              This will {table ? 'export table rows' : 'run your query and save the results'} directly to a file.
            </p>
            <p>You can choose the format and file name.</p>
            <p>
              For {table ? 'tables with many' : 'queries with many results'} rows, this will run in the background,
              allowing you to continue to do other work.
            </p>

            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={onClose}
            >
              <i className="material-icons">clear</i>
            </button>

            {error && (
              <div className="alert alert-danger">
                <i className="material-icons">error_outline</i>
                <div>Error: {error}</div>
              </div>
            )}

            <div className="modal-form export-form">
              <div className="flex">
                <div className="form-group col s6">
                  <label htmlFor="exportFormat">Format</label>
                  <select
                    id="exportFormat"
                    className="form-control"
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    {exportFormats.map((format) => (
                      <option key={format.value} value={format.value}>
                        {format.label} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col s6">
                  <label htmlFor="fileName">File Name</label>
                  <input
                    id="fileName"
                    type="text"
                    className="form-control"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="export_file"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={includeHeaders}
                    onChange={(e) => setIncludeHeaders(e.target.checked)}
                  />
                  Include column headers
                </label>
              </div>

              {exportFormat === 'csv' && (
                <div className="csv-options">
                  <h4>CSV Options</h4>
                  <div className="form-group">
                    <label htmlFor="delimiter">Delimiter</label>
                    <select
                      id="delimiter"
                      className="form-control"
                      defaultValue=","
                    >
                      <option value=",">Comma (,)</option>
                      <option value=";">Semicolon (;)</option>
                      <option value="\t">Tab</option>
                      <option value="|">Pipe (|)</option>
                    </select>
                  </div>
                </div>
              )}

              {exportFormat === 'json' && (
                <div className="json-options">
                  <h4>JSON Options</h4>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Pretty print (formatted)
                    </label>
                  </div>
                </div>
              )}

              {exportFormat === 'xlsx' && (
                <div className="xlsx-options">
                  <h4>Excel Options</h4>
                  <div className="form-group">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Auto-fit columns
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isExporting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <i className="material-icons spinning">hourglass_empty</i>
                    Exporting...
                  </>
                ) : (
                  <>
                    <i className="material-icons">download</i>
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportModal;
