import React, { useState, useEffect } from 'react';

interface ExportFormJSONLineProps {
  value: ExportJSONLineOptions;
  onChange: (options: ExportJSONLineOptions) => void;
  className?: string;
}

interface ExportJSONLineOptions {
  includeNulls?: boolean;
  dateFormat?: string;
  numberFormat?: string;
  booleanFormat?: string;
  keyFormat?: 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'original';
  encoding?: string;
  maxRows?: number;
  chunkSize?: number;
  includeMetadata?: boolean;
  metadataFields?: string[];
  customFields?: Record<string, any>;
  lineEnding?: string;
  addLineNumbers?: boolean;
  addTimestamps?: boolean;
  addRowIds?: boolean;
  compressOutput?: boolean;
  validateJSON?: boolean;
}

const ExportFormJSONLine: React.FC<ExportFormJSONLineProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [options, setOptions] = useState<ExportJSONLineOptions>({
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
    ...value,
  });

  useEffect(() => {
    setOptions(prev => ({ ...prev, ...value }));
  }, [value]);

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  const handleOptionChange = (field: keyof ExportJSONLineOptions, newValue: any) => {
    setOptions(prev => ({ ...prev, [field]: newValue }));
  };

  const handleCustomFieldChange = (key: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      customFields: { ...prev.customFields, [key]: value },
    }));
  };

  const handleAddCustomField = () => {
    const key = prompt('Enter custom field key:');
    if (key) {
      handleCustomFieldChange(key, '');
    }
  };

  const handleRemoveCustomField = (key: string) => {
    setOptions(prev => {
      const newCustomFields = { ...prev.customFields };
      delete newCustomFields[key];
      return { ...prev, customFields: newCustomFields };
    });
  };

  const dateFormatOptions = [
    { value: 'ISO', label: 'ISO 8601' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'timestamp', label: 'Unix Timestamp' },
    { value: 'epoch', label: 'Epoch Milliseconds' },
  ];

  const numberFormatOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'decimal', label: 'Decimal' },
  ];

  const booleanFormatOptions = [
    { value: 'true/false', label: 'true/false' },
    { value: '1/0', label: '1/0' },
    { value: 'yes/no', label: 'yes/no' },
    { value: 'Y/N', label: 'Y/N' },
    { value: 'on/off', label: 'on/off' },
  ];

  const keyFormatOptions = [
    { value: 'original', label: 'Original' },
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'kebab-case', label: 'kebab-case' },
    { value: 'PascalCase', label: 'PascalCase' },
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

  const metadataFieldOptions = [
    { value: 'exportedAt', label: 'Export Date' },
    { value: 'rowCount', label: 'Row Count' },
    { value: 'source', label: 'Source' },
    { value: 'version', label: 'Version' },
    { value: 'generator', label: 'Generator' },
    { value: 'schema', label: 'Schema' },
    { value: 'lineNumber', label: 'Line Number' },
    { value: 'timestamp', label: 'Timestamp' },
    { value: 'rowId', label: 'Row ID' },
  ];

  return (
    <div className={`export-form-jsonline ${className}`}>
      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeNulls || false}
            onChange={(e) => handleOptionChange('includeNulls', e.target.checked)}
            className="form-control"
          />
          <span>Include NULL values</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="dateFormat">Date Format</label>
        <select
          id="dateFormat"
          value={options.dateFormat || 'ISO'}
          onChange={(e) => handleOptionChange('dateFormat', e.target.value)}
          className="form-control"
        >
          {dateFormatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="numberFormat">Number Format</label>
        <select
          id="numberFormat"
          value={options.numberFormat || 'auto'}
          onChange={(e) => handleOptionChange('numberFormat', e.target.value)}
          className="form-control"
        >
          {numberFormatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="booleanFormat">Boolean Format</label>
        <select
          id="booleanFormat"
          value={options.booleanFormat || 'true/false'}
          onChange={(e) => handleOptionChange('booleanFormat', e.target.value)}
          className="form-control"
        >
          {booleanFormatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="keyFormat">Key Format</label>
        <select
          id="keyFormat"
          value={options.keyFormat || 'original'}
          onChange={(e) => handleOptionChange('keyFormat', e.target.value)}
          className="form-control"
        >
          {keyFormatOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="encoding">File Encoding</label>
        <select
          id="encoding"
          value={options.encoding || 'utf-8'}
          onChange={(e) => handleOptionChange('encoding', e.target.value)}
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
          value={options.lineEnding || '\n'}
          onChange={(e) => handleOptionChange('lineEnding', e.target.value)}
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
        <label htmlFor="maxRows">Max Rows (0 = all)</label>
        <input
          id="maxRows"
          type="number"
          value={options.maxRows || 0}
          onChange={(e) => handleOptionChange('maxRows', parseInt(e.target.value) || 0)}
          className="form-control"
          min="0"
        />
      </div>

      <div className="form-group">
        <label htmlFor="chunkSize">Chunk Size</label>
        <input
          id="chunkSize"
          type="number"
          value={options.chunkSize || 1000}
          onChange={(e) => handleOptionChange('chunkSize', parseInt(e.target.value) || 1000)}
          className="form-control"
          min="1"
          max="10000"
        />
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeMetadata || false}
            onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
            className="form-control"
          />
          <span>Include metadata</span>
        </label>
      </div>

      {options.includeMetadata && (
        <div className="form-group">
          <label>Metadata Fields</label>
          <div className="checkbox-list">
            {metadataFieldOptions.map((option) => (
              <label key={option.value} className="checkbox-group">
                <input
                  type="checkbox"
                  checked={options.metadataFields?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentFields = options.metadataFields || [];
                    const newFields = e.target.checked
                      ? [...currentFields, option.value]
                      : currentFields.filter(field => field !== option.value);
                    handleOptionChange('metadataFields', newFields);
                  }}
                  className="form-control"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addLineNumbers || false}
            onChange={(e) => handleOptionChange('addLineNumbers', e.target.checked)}
            className="form-control"
          />
          <span>Add line numbers</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addTimestamps || false}
            onChange={(e) => handleOptionChange('addTimestamps', e.target.checked)}
            className="form-control"
          />
          <span>Add timestamps</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addRowIds || false}
            onChange={(e) => handleOptionChange('addRowIds', e.target.checked)}
            className="form-control"
          />
          <span>Add row IDs</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.compressOutput || false}
            onChange={(e) => handleOptionChange('compressOutput', e.target.checked)}
            className="form-control"
          />
          <span>Compress output</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.validateJSON || false}
            onChange={(e) => handleOptionChange('validateJSON', e.target.checked)}
            className="form-control"
          />
          <span>Validate JSON</span>
        </label>
      </div>

      <div className="form-group">
        <label>Custom Fields</label>
        <div className="custom-fields">
          {Object.entries(options.customFields || {}).map(([key, value]) => (
            <div key={key} className="custom-field">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (newValue !== key) {
                    const newCustomFields = { ...options.customFields };
                    delete newCustomFields[key];
                    newCustomFields[newValue] = value;
                    handleOptionChange('customFields', newCustomFields);
                  }
                }}
                className="form-control"
                placeholder="Field key"
              />
              <input
                type="text"
                value={String(value)}
                onChange={(e) => handleCustomFieldChange(key, e.target.value)}
                className="form-control"
                placeholder="Field value"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomField(key)}
                className="btn btn-flat btn-icon"
                title="Remove field"
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCustomField}
            className="btn btn-flat"
          >
            <i className="material-icons">add</i>
            Add Custom Field
          </button>
        </div>
      </div>

      <div className="export-info">
        <div className="alert alert-info">
          <i className="material-icons">info</i>
          <div>
            <strong>JSONL Export Information:</strong>
            <ul>
              <li>Date Format: {options.dateFormat}</li>
              <li>Number Format: {options.numberFormat}</li>
              <li>Boolean Format: {options.booleanFormat}</li>
              <li>Key Format: {options.keyFormat}</li>
              <li>Encoding: {options.encoding}</li>
              <li>Line Ending: {options.lineEnding === '\n' ? 'Unix (LF)' : options.lineEnding === '\r\n' ? 'Windows (CRLF)' : 'Mac (CR)'}</li>
              <li>Max Rows: {options.maxRows || 'All'}</li>
              <li>Include Metadata: {options.includeMetadata ? 'Yes' : 'No'}</li>
              <li>Add Line Numbers: {options.addLineNumbers ? 'Yes' : 'No'}</li>
              <li>Add Timestamps: {options.addTimestamps ? 'Yes' : 'No'}</li>
              <li>Add Row IDs: {options.addRowIds ? 'Yes' : 'No'}</li>
              <li>Compress Output: {options.compressOutput ? 'Yes' : 'No'}</li>
              <li>Validate JSON: {options.validateJSON ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFormJSONLine;
