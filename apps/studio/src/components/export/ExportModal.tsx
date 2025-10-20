import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../common/modals/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ExportFormCSV from './forms/ExportFormCSV';
import ExportFormJSON from './forms/ExportFormJSON';
import ExportFormSQL from './forms/ExportFormSQL';
import ExportFormJSONLine from './forms/ExportFormJSONLine';

interface ExportModalProps {
  table?: any;
  query?: string;
  queryName?: string;
  filters?: any[];
  onExport: (options: ExportOptions) => Promise<void>;
  onClosed: () => void;
  className?: string;
}

interface ExportOptions {
  format: 'csv' | 'json' | 'sql' | 'jsonl';
  fileName: string;
  includeHeaders: boolean;
  csvOptions?: any;
  jsonOptions?: any;
  sqlOptions?: any;
  jsonlOptions?: any;
  maxRows?: number;
  chunkSize?: number;
  encoding?: string;
  lineEnding?: string;
  compression?: boolean;
  validateData?: boolean;
  includeMetadata?: boolean;
  customFields?: Record<string, any>;
}

const ExportModal: React.FC<ExportModalProps> = ({
  table,
  query,
  queryName,
  filters,
  onExport,
  onClosed,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [format, setFormat] = useState<'csv' | 'json' | 'sql' | 'jsonl'>('csv');
  const [fileName, setFileName] = useState('');
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [maxRows, setMaxRows] = useState(0);
  const [chunkSize, setChunkSize] = useState(1000);
  const [encoding, setEncoding] = useState('utf-8');
  const [lineEnding, setLineEnding] = useState('\n');
  const [compression, setCompression] = useState(false);
  const [validateData, setValidateData] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [customFields, setCustomFields] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const [csvOptions, setCsvOptions] = useState({
    header: true,
    delimiter: ',',
    quoteCharacter: '"',
    escapeCharacter: '\\',
    lineEnding: '\n',
    encoding: 'utf-8',
    includeNulls: true,
    nullValue: '',
    dateFormat: 'YYYY-MM-DD',
    numberFormat: 'auto',
    booleanFormat: 'true/false',
    trimWhitespace: false,
    escapeQuotes: true,
    doubleQuote: true,
    skipEmptyLines: false,
  });

  const [jsonOptions, setJsonOptions] = useState({
    prettyprint: false,
    indentSize: 2,
    includeNulls: true,
    dateFormat: 'ISO',
    numberFormat: 'auto',
    booleanFormat: 'true/false',
    arrayFormat: 'array',
    keyFormat: 'original',
    encoding: 'utf-8',
    maxRows: 0,
    chunkSize: 1000,
    includeMetadata: false,
    metadataFields: ['exportedAt', 'rowCount', 'source'],
    customFields: {},
  });

  const [sqlOptions, setSqlOptions] = useState({
    createTable: false,
    schema: false,
    includeData: true,
    includeIndexes: true,
    includeConstraints: true,
    includeTriggers: false,
    includeViews: false,
    includeProcedures: false,
    includeFunctions: false,
    includeEvents: false,
    includeComments: true,
    tableName: '',
    schemaName: '',
    insertType: 'INSERT',
    batchSize: 1000,
    maxRows: 0,
    encoding: 'utf-8',
    lineEnding: '\n',
    quoteIdentifiers: true,
    useTransactions: true,
    addDropStatements: false,
    addIfNotExists: true,
    addIfExists: true,
    customFields: {},
  });

  const [jsonlOptions, setJsonlOptions] = useState({
    includeNulls: true,
    dateFormat: 'ISO',
    numberFormat: 'auto',
    booleanFormat: 'true/false',
    keyFormat: 'original',
    encoding: 'utf-8',
    maxRows: 0,
    chunkSize: 1000,
    includeMetadata: false,
    metadataFields: ['exportedAt', 'rowCount', 'source'],
    customFields: {},
    lineEnding: '\n',
    addLineNumbers: false,
    addTimestamps: false,
    addRowIds: false,
    compressOutput: false,
    validateJSON: true,
  });

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const formatOptions = [
    { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
    { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
    { value: 'sql', label: 'SQL', description: 'SQL statements' },
    { value: 'jsonl', label: 'JSONL', description: 'JSON Lines' },
  ];

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'utf-16', label: 'UTF-16' },
    { value: 'latin1', label: 'Latin-1' },
    { value: 'ascii', label: 'ASCII' },
  ];

  const lineEndingOptions = [
    { value: '\n', label: 'Unix (LF)' },
    { value: '\r\n', label: 'Windows (CRLF)' },
    { value: '\r', label: 'Mac (CR)' },
  ];

  useEffect(() => {
    if (table) {
      setFileName(`${table.name}_export`);
    } else if (queryName) {
      setFileName(`${queryName}_export`);
    } else {
      setFileName('export');
    }
  }, [table, queryName]);

  const handleClose = () => {
    setIsOpen(false);
    onClosed();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileName.trim()) {
      setError('File name is required');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      const exportOptions: ExportOptions = {
        format,
        fileName: fileName.trim(),
        includeHeaders,
        maxRows,
        chunkSize,
        encoding,
        lineEnding,
        compression,
        validateData,
        includeMetadata,
        customFields,
        csvOptions: format === 'csv' ? csvOptions : undefined,
        jsonOptions: format === 'json' ? jsonOptions : undefined,
        sqlOptions: format === 'sql' ? sqlOptions : undefined,
        jsonlOptions: format === 'jsonl' ? jsonlOptions : undefined,
      };

      await onExport(exportOptions);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    }
  };

  const getFilterTooltip = () => {
    if (!filters || filters.length === 0) return '';
    return `Applied ${filters.length} filter(s)`;
  };

  const getExportDescription = () => {
    if (table) {
      return 'This will export table rows directly to a file.';
    } else {
      return 'This will run your query and save the results directly to a file.';
    }
  };

  const getBackgroundInfo = () => {
    if (table) {
      return 'For tables with many rows, this will run in the background, allowing you to continue to do other work.';
    } else {
      return 'For queries with many results, this will run in the background, allowing you to continue to do other work.';
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className={`vue-dialog beekeeper-modal export-modal ${className}`}
      name="export-modal"
      height="auto"
      scrollable={true}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title flex flex-middle">
            <div>
              Export
              <span className="text-primary truncate">
                {table ? table.name : queryName}
              </span>
              {filters && filters.length > 0 && (
                <span className="text-light" title={getFilterTooltip()}>
                  (Filtered)
                </span>
              )}
              <span className="badge badge-info">Beta</span>
            </div>
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>

          <p>{getExportDescription()}</p>
          <p>You can choose the format and file name.</p>
          <p>{getBackgroundInfo()}</p>

          {error && (
            <div className="alert alert-danger">
              <i className="material-icons">error_outline</i>
              <div>Error: {error}</div>
            </div>
          )}

          <div className="modal-form export-form">
            <div className="flex">
              <div className="form-group">
                <label htmlFor="format">Format</label>
                <select
                  id="format"
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="form-control"
                >
                  {formatOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="fileName">File Name</label>
                <input
                  id="fileName"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="form-control"
                  placeholder="Enter file name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={includeHeaders}
                  onChange={(e) => setIncludeHeaders(e.target.checked)}
                  className="form-control"
                />
                <span>Include Headers</span>
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="maxRows">Max Rows (0 = all)</label>
              <input
                id="maxRows"
                type="number"
                value={maxRows}
                onChange={(e) => setMaxRows(parseInt(e.target.value) || 0)}
                className="form-control"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="chunkSize">Chunk Size</label>
              <input
                id="chunkSize"
                type="number"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value) || 1000)}
                className="form-control"
                min="1"
                max="10000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="encoding">File Encoding</label>
              <select
                id="encoding"
                value={encoding}
                onChange={(e) => setEncoding(e.target.value)}
                className="form-control"
              >
                {encodingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lineEnding">Line Ending</label>
              <select
                id="lineEnding"
                value={lineEnding}
                onChange={(e) => setLineEnding(e.target.value)}
                className="form-control"
              >
                {lineEndingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={compression}
                  onChange={(e) => setCompression(e.target.checked)}
                  className="form-control"
                />
                <span>Compress Output</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={validateData}
                  onChange={(e) => setValidateData(e.target.checked)}
                  className="form-control"
                />
                <span>Validate Data</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="form-control"
                />
                <span>Include Metadata</span>
              </label>
            </div>

            {format === 'csv' && (
              <ExportFormCSV
                value={csvOptions}
                onChange={setCsvOptions}
              />
            )}

            {format === 'json' && (
              <ExportFormJSON
                value={jsonOptions}
                onChange={setJsonOptions}
              />
            )}

            {format === 'sql' && (
              <ExportFormSQL
                value={sqlOptions}
                onChange={setSqlOptions}
              />
            )}

            {format === 'jsonl' && (
              <ExportFormJSONLine
                value={jsonlOptions}
                onChange={setJsonlOptions}
              />
            )}
          </div>
        </div>

        <div className="vue-dialog-buttons">
          <button
            type="button"
            className="btn btn-flat"
            onClick={handleClose}
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isExporting || !fileName.trim()}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default ExportModal;