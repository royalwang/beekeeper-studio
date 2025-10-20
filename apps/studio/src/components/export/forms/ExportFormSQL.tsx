import React, { useState, useEffect } from 'react';

interface ExportFormSQLProps {
  value: ExportSQLOptions;
  onChange: (options: ExportSQLOptions) => void;
  className?: string;
}

interface ExportSQLOptions {
  createTable: boolean;
  schema: boolean;
  includeData?: boolean;
  includeIndexes?: boolean;
  includeConstraints?: boolean;
  includeTriggers?: boolean;
  includeViews?: boolean;
  includeProcedures?: boolean;
  includeFunctions?: boolean;
  includeEvents?: boolean;
  includeComments?: boolean;
  tableName?: string;
  schemaName?: string;
  insertType?: 'INSERT' | 'INSERT IGNORE' | 'REPLACE' | 'ON DUPLICATE KEY UPDATE';
  batchSize?: number;
  maxRows?: number;
  encoding?: string;
  lineEnding?: string;
  quoteIdentifiers?: boolean;
  useTransactions?: boolean;
  addDropStatements?: boolean;
  addIfNotExists?: boolean;
  addIfExists?: boolean;
  customFields?: Record<string, any>;
}

const ExportFormSQL: React.FC<ExportFormSQLProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [options, setOptions] = useState<ExportSQLOptions>({
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
    ...value,
  });

  useEffect(() => {
    setOptions(prev => ({ ...prev, ...value }));
  }, [value]);

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  const handleOptionChange = (field: keyof ExportSQLOptions, newValue: any) => {
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

  const insertTypeOptions = [
    { value: 'INSERT', label: 'INSERT' },
    { value: 'INSERT IGNORE', label: 'INSERT IGNORE' },
    { value: 'REPLACE', label: 'REPLACE' },
    { value: 'ON DUPLICATE KEY UPDATE', label: 'ON DUPLICATE KEY UPDATE' },
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

  return (
    <div className={`export-form-sql ${className}`}>
      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.schema}
            onChange={(e) => handleOptionChange('schema', e.target.checked)}
            className="form-control"
          />
          <span>Include Table Schema (If Applicable)</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.createTable}
            onChange={(e) => handleOptionChange('createTable', e.target.checked)}
            className="form-control"
          />
          <span>Create Table Before Inserting</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeData || false}
            onChange={(e) => handleOptionChange('includeData', e.target.checked)}
            className="form-control"
          />
          <span>Include Data</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeIndexes || false}
            onChange={(e) => handleOptionChange('includeIndexes', e.target.checked)}
            className="form-control"
          />
          <span>Include Indexes</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeConstraints || false}
            onChange={(e) => handleOptionChange('includeConstraints', e.target.checked)}
            className="form-control"
          />
          <span>Include Constraints</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeTriggers || false}
            onChange={(e) => handleOptionChange('includeTriggers', e.target.checked)}
            className="form-control"
          />
          <span>Include Triggers</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeViews || false}
            onChange={(e) => handleOptionChange('includeViews', e.target.checked)}
            className="form-control"
          />
          <span>Include Views</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeProcedures || false}
            onChange={(e) => handleOptionChange('includeProcedures', e.target.checked)}
            className="form-control"
          />
          <span>Include Stored Procedures</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeFunctions || false}
            onChange={(e) => handleOptionChange('includeFunctions', e.target.checked)}
            className="form-control"
          />
          <span>Include Functions</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeEvents || false}
            onChange={(e) => handleOptionChange('includeEvents', e.target.checked)}
            className="form-control"
          />
          <span>Include Events</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.includeComments || false}
            onChange={(e) => handleOptionChange('includeComments', e.target.checked)}
            className="form-control"
          />
          <span>Include Comments</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="tableName">Table Name</label>
        <input
          id="tableName"
          type="text"
          value={options.tableName || ''}
          onChange={(e) => handleOptionChange('tableName', e.target.value)}
          className="form-control"
          placeholder="Leave empty for all tables"
        />
      </div>

      <div className="form-group">
        <label htmlFor="schemaName">Schema Name</label>
        <input
          id="schemaName"
          type="text"
          value={options.schemaName || ''}
          onChange={(e) => handleOptionChange('schemaName', e.target.value)}
          className="form-control"
          placeholder="Leave empty for default schema"
        />
      </div>

      <div className="form-group">
        <label htmlFor="insertType">Insert Type</label>
        <select
          id="insertType"
          value={options.insertType || 'INSERT'}
          onChange={(e) => handleOptionChange('insertType', e.target.value)}
          className="form-control"
        >
          {insertTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="batchSize">Batch Size</label>
        <input
          id="batchSize"
          type="number"
          value={options.batchSize || 1000}
          onChange={(e) => handleOptionChange('batchSize', parseInt(e.target.value) || 1000)}
          className="form-control"
          min="1"
          max="10000"
        />
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

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.quoteIdentifiers || false}
            onChange={(e) => handleOptionChange('quoteIdentifiers', e.target.checked)}
            className="form-control"
          />
          <span>Quote Identifiers</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.useTransactions || false}
            onChange={(e) => handleOptionChange('useTransactions', e.target.checked)}
            className="form-control"
          />
          <span>Use Transactions</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addDropStatements || false}
            onChange={(e) => handleOptionChange('addDropStatements', e.target.checked)}
            className="form-control"
          />
          <span>Add DROP Statements</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addIfNotExists || false}
            onChange={(e) => handleOptionChange('addIfNotExists', e.target.checked)}
            className="form-control"
          />
          <span>Add IF NOT EXISTS</span>
        </label>
      </div>

      <div className="form-group row">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.addIfExists || false}
            onChange={(e) => handleOptionChange('addIfExists', e.target.checked)}
            className="form-control"
          />
          <span>Add IF EXISTS</span>
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
            <strong>SQL Export Information:</strong>
            <ul>
              <li>Create Table: {options.createTable ? 'Yes' : 'No'}</li>
              <li>Include Schema: {options.schema ? 'Yes' : 'No'}</li>
              <li>Include Data: {options.includeData ? 'Yes' : 'No'}</li>
              <li>Include Indexes: {options.includeIndexes ? 'Yes' : 'No'}</li>
              <li>Include Constraints: {options.includeConstraints ? 'Yes' : 'No'}</li>
              <li>Insert Type: {options.insertType}</li>
              <li>Batch Size: {options.batchSize}</li>
              <li>Max Rows: {options.maxRows || 'All'}</li>
              <li>Encoding: {options.encoding}</li>
              <li>Use Transactions: {options.useTransactions ? 'Yes' : 'No'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFormSQL;
