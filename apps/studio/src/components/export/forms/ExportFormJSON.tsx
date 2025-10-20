import React, { useState, useEffect } from 'react';

interface ExportFormJSONProps {
  value: ExportJSONOptions;
  onChange: (options: ExportJSONOptions) => void;
  className?: string;
}

interface ExportJSONOptions {
  prettyprint: boolean;
  indentSize?: number;
  includeNulls?: boolean;
  dateFormat?: string;
  numberFormat?: string;
  booleanFormat?: string;
  arrayFormat?: 'array' | 'object';
  keyFormat?: 'camelCase' | 'snake_case' | 'kebab-case' | 'PascalCase' | 'original';
  encoding?: string;
  maxRows?: number;
  chunkSize?: number;
  includeMetadata?: boolean;
  metadataFields?: string[];
  customFields?: Record<string, any>;
}

const ExportFormJSON: React.FC<ExportFormJSONProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [options, setOptions] = useState<ExportJSONOptions>({
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
    ...value,
  });

  useEffect(() => {
    setOptions(prev => ({ ...prev, ...value }));
  }, [value]);

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  const handleOptionChange = (field: keyof ExportJSONOptions, newValue: any) => {
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

  const arrayFormatOptions = [
    { value: 'array', label: 'Array' },
    { value: 'object', label: 'Object with indices' },
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

  const metadataFieldOptions = [
    { value: 'exportedAt', label: 'Export Date' },
    { value: 'rowCount', label: 'Row Count' },
    { value: 'source', label: 'Source' },
    { value: 'version', label: 'Version' },
    { value: 'generator', label: 'Generator' },
    { value: 'schema', label: 'Schema' },
  ];

  return (
    <div className={`export-form-json ${className}`}>
      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.prettyprint}
            onChange={(e) => handleOptionChange('prettyprint', e.target.checked)}
            className="form-control"
          />
          <span>Pretty-print</span>
        </label>
      </div>

      {options.prettyprint && (
        <div className="form-group">
          <label htmlFor="indentSize">Indent Size</label>
          <input
            id="indentSize"
            type="number"
            value={options.indentSize || 2}
            onChange={(e) => handleOptionChange('indentSize', parseInt(e.target.value) || 2)}
            className="form-control"
            min="1"
            max="8"
          />
        </div>
      )}

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
        <label htmlFor="arrayFormat">Array Format</label>
        <select
          id="arrayFormat"
          value={options.arrayFormat || 'array'}
          onChange={(e) => handleOptionChange('arrayFormat', e.target.value)}
          className="form-control"
        >
          {arrayFormatOptions.map((option) => (
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
            <strong>JSON Export Information:</strong>
            <ul>
              <li>Pretty Print: {options.prettyprint ? 'Yes' : 'No'}</li>
              {options.prettyprint && <li>Indent Size: {options.indentSize}</li>}
              <li>Date Format: {options.dateFormat}</li>
              <li>Number Format: {options.numberFormat}</li>
              <li>Boolean Format: {options.booleanFormat}</li>
              <li>Array Format: {options.arrayFormat}</li>
              <li>Key Format: {options.keyFormat}</li>
              <li>Encoding: {options.encoding}</li>
              <li>Max Rows: {options.maxRows || 'All'}</li>
              <li>Include Metadata: {options.includeMetadata ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFormJSON;
