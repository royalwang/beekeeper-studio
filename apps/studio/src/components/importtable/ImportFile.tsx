import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import FilePicker from '../common/form/FilePicker';
import ToggleFormArea from '../common/ToggleFormArea';

interface ImportFileProps {
  onFileSelect: (file: File) => void;
  onFileConfigChange: (config: ImportFileConfig) => void;
  onFileValidate: (file: File) => Promise<string | null>;
  onFilePreview: (file: File, config: ImportFileConfig) => Promise<any[]>;
  className?: string;
}

interface ImportFileConfig {
  fileName: string | null;
  trimWhitespaces: boolean;
  isAutodetect: boolean;
  columnDelimiter: string;
  rowDelimiter: string;
  quoteCharacter: string;
  escapeCharacter: string;
  hasHeader: boolean;
  encoding: string;
  skipEmptyLines: boolean;
  skipComments: boolean;
  commentCharacter: string;
  maxRows: number;
  chunkSize: number;
}

const ImportFile: React.FC<ImportFileProps> = ({
  onFileSelect,
  onFileConfigChange,
  onFileValidate,
  onFilePreview,
  className = '',
}) => {
  const [config, setConfig] = useState<ImportFileConfig>({
    fileName: null,
    trimWhitespaces: true,
    isAutodetect: true,
    columnDelimiter: ',',
    rowDelimiter: '\n',
    quoteCharacter: '"',
    escapeCharacter: '\\',
    hasHeader: true,
    encoding: 'utf-8',
    skipEmptyLines: true,
    skipComments: false,
    commentCharacter: '#',
    maxRows: 1000,
    chunkSize: 100,
  });

  const [file, setFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  const filePickerOptions = {
    filters: [
      { name: 'CSV files (*.csv)', extensions: ['csv'] },
      { name: 'Excel files (*.xlsx)', extensions: ['xlsx'] },
      { name: 'JSON files (*.json)', extensions: ['json'] },
      { name: 'JSONL files (*.jsonl)', extensions: ['jsonl'] },
      { name: 'All files', extensions: ['*'] },
    ],
    properties: ['openFile'],
  };

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'utf-16', label: 'UTF-16' },
    { value: 'latin1', label: 'Latin-1' },
    { value: 'ascii', label: 'ASCII' },
  ];

  const delimiterOptions = [
    { value: ',', label: 'Comma (,)' },
    { value: ';', label: 'Semicolon (;)' },
    { value: '\t', label: 'Tab' },
    { value: '|', label: 'Pipe (|)' },
    { value: ' ', label: 'Space' },
  ];

  const quoteOptions = [
    { value: '"', label: 'Double Quote (")' },
    { value: "'", label: 'Single Quote (\')' },
    { value: '', label: 'None' },
  ];

  useEffect(() => {
    onFileConfigChange(config);
  }, [config, onFileConfigChange]);

  const handleFileSelect = async (fileName: string) => {
    if (!fileName) {
      setFile(null);
      setConfig(prev => ({ ...prev, fileName: null }));
      setValidationError(null);
      setPreviewData([]);
      return;
    }

    try {
      // In a real implementation, you would read the file here
      const fileObj = new File([], fileName); // Placeholder
      setFile(fileObj);
      setConfig(prev => ({ ...prev, fileName }));
      
      setIsLoading(true);
      setValidationError(null);

      const error = await onFileValidate(fileObj);
      if (error) {
        setValidationError(error);
      } else {
        const preview = await onFilePreview(fileObj, config);
        setPreviewData(preview);
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfigChange = (field: keyof ImportFileConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleAutodetectToggle = () => {
    const newAutodetect = !config.isAutodetect;
    setConfig(prev => ({ ...prev, isAutodetect: newAutodetect }));
    
    if (newAutodetect && file) {
      // Auto-detect file format
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.csv')) {
        setConfig(prev => ({
          ...prev,
          columnDelimiter: ',',
          quoteCharacter: '"',
          hasHeader: true,
        }));
      } else if (fileName.endsWith('.tsv') || fileName.endsWith('.txt')) {
        setConfig(prev => ({
          ...prev,
          columnDelimiter: '\t',
          quoteCharacter: '"',
          hasHeader: true,
        }));
      } else if (fileName.endsWith('.json') || fileName.endsWith('.jsonl')) {
        setConfig(prev => ({
          ...prev,
          columnDelimiter: '',
          quoteCharacter: '',
          hasHeader: false,
        }));
      }
    }
  };

  const handlePreviewRefresh = async () => {
    if (file) {
      setIsLoading(true);
      try {
        const preview = await onFilePreview(file, config);
        setPreviewData(preview);
      } catch (error) {
        setValidationError(error instanceof Error ? error.message : 'Failed to preview file');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileExport = () => {
    if (file) {
      // Export file configuration
      const configData = JSON.stringify(config, null, 2);
      const blob = new Blob([configData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}.config.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleFileImport = () => {
    // Import file configuration
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const configData = JSON.parse(e.target?.result as string);
            setConfig(prev => ({ ...prev, ...configData }));
          } catch (error) {
            setValidationError('Invalid configuration file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className={`import mini-wrap ${className}`}>
      <form className="import-section-wrapper card-flat padding">
        <h3 className="card-title">Choose file</h3>
        
        <div className="form-group">
          <label htmlFor="fileName">Select File To Import (.csv, .xlsx, .json, .jsonl only)</label>
          <FilePicker
            value={config.fileName || ''}
            onChange={handleFileSelect}
            options={filePickerOptions}
            className="file-picker-wrapper"
          />
        </div>

        {config.fileName && (
          <section>
            <div className="form-group">
              <label className="checkbox-group">
                <input
                  type="checkbox"
                  checked={config.trimWhitespaces}
                  onChange={(e) => handleConfigChange('trimWhitespaces', e.target.checked)}
                  className="form-control"
                />
                Automatically Trim Whitespace
              </label>
            </div>

            <ToggleFormArea
              title="Auto Detect Separators"
              hideToggle={true}
              expanded={!config.isAutodetect}
              headerContent={
                <button
                  type="button"
                  className="switch"
                  onClick={handleAutodetectToggle}
                  data-toggled={config.isAutodetect}
                >
                  <span className="switch-handle" />
                </button>
              }
            >
              <div className="row gutter">
                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="columnDelimiter">Column Separator</label>
                    <select
                      id="columnDelimiter"
                      value={config.columnDelimiter}
                      onChange={(e) => handleConfigChange('columnDelimiter', e.target.value)}
                      disabled={config.isAutodetect}
                    >
                      {delimiterOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="rowDelimiter">Row Separator</label>
                    <input
                      id="rowDelimiter"
                      type="text"
                      value={config.rowDelimiter}
                      onChange={(e) => handleConfigChange('rowDelimiter', e.target.value)}
                      disabled={config.isAutodetect}
                    />
                  </div>
                </div>
              </div>

              <div className="row gutter">
                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="quoteCharacter">Quote Character</label>
                    <select
                      id="quoteCharacter"
                      value={config.quoteCharacter}
                      onChange={(e) => handleConfigChange('quoteCharacter', e.target.value)}
                      disabled={config.isAutodetect}
                    >
                      {quoteOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="escapeCharacter">Escape Character</label>
                    <input
                      id="escapeCharacter"
                      type="text"
                      value={config.escapeCharacter}
                      onChange={(e) => handleConfigChange('escapeCharacter', e.target.value)}
                      disabled={config.isAutodetect}
                    />
                  </div>
                </div>
              </div>

              <div className="row gutter">
                <div className="col s6">
                  <div className="form-group">
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={config.hasHeader}
                        onChange={(e) => handleConfigChange('hasHeader', e.target.checked)}
                        disabled={config.isAutodetect}
                      />
                      First row contains headers
                    </label>
                  </div>
                </div>

                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="encoding">File Encoding</label>
                    <select
                      id="encoding"
                      value={config.encoding}
                      onChange={(e) => handleConfigChange('encoding', e.target.value)}
                    >
                      {encodingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row gutter">
                <div className="col s6">
                  <div className="form-group">
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={config.skipEmptyLines}
                        onChange={(e) => handleConfigChange('skipEmptyLines', e.target.checked)}
                      />
                      Skip empty lines
                    </label>
                  </div>
                </div>

                <div className="col s6">
                  <div className="form-group">
                    <label className="checkbox-group">
                      <input
                        type="checkbox"
                        checked={config.skipComments}
                        onChange={(e) => handleConfigChange('skipComments', e.target.checked)}
                      />
                      Skip comment lines
                    </label>
                  </div>
                </div>
              </div>

              {config.skipComments && (
                <div className="form-group">
                  <label htmlFor="commentCharacter">Comment Character</label>
                  <input
                    id="commentCharacter"
                    type="text"
                    value={config.commentCharacter}
                    onChange={(e) => handleConfigChange('commentCharacter', e.target.value)}
                  />
                </div>
              )}

              <div className="row gutter">
                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="maxRows">Max Rows to Preview</label>
                    <input
                      id="maxRows"
                      type="number"
                      value={config.maxRows}
                      onChange={(e) => handleConfigChange('maxRows', parseInt(e.target.value))}
                      min="1"
                      max="10000"
                    />
                  </div>
                </div>

                <div className="col s6">
                  <div className="form-group">
                    <label htmlFor="chunkSize">Chunk Size</label>
                    <input
                      id="chunkSize"
                      type="number"
                      value={config.chunkSize}
                      onChange={(e) => handleConfigChange('chunkSize', parseInt(e.target.value))}
                      min="1"
                      max="1000"
                    />
                  </div>
                </div>
              </div>
            </ToggleFormArea>

            {validationError && (
              <div className="alert alert-danger">
                <i className="material-icons">error_outline</i>
                <div>{validationError}</div>
              </div>
            )}

            {previewData.length > 0 && (
              <div className="preview-section">
                <div className="preview-header">
                  <h4>File Preview ({previewData.length} rows)</h4>
                  <div className="preview-actions">
                    <button
                      type="button"
                      className="btn btn-flat"
                      onClick={handlePreviewRefresh}
                      disabled={isLoading}
                    >
                      <i className="material-icons">refresh</i>
                      Refresh
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-flat"
                      onClick={handleFileExport}
                    >
                      <i className="material-icons">download</i>
                      Export Config
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-flat"
                      onClick={handleFileImport}
                    >
                      <i className="material-icons">upload</i>
                      Import Config
                    </button>
                  </div>
                </div>

                <div className="preview-table">
                  <table>
                    <thead>
                      <tr>
                        {Object.keys(previewData[0] || {}).map((key) => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, cellIndex) => (
                            <td key={cellIndex}>{String(value)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        )}
      </form>
    </div>
  );
};

export default ImportFile;
