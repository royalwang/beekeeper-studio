import React, { useState, useEffect, useRef } from 'react';

interface ExportFormCSVProps {
  value: ExportCSVOptions;
  onChange: (options: ExportCSVOptions) => void;
  className?: string;
}

interface ExportCSVOptions {
  header: boolean;
  delimiter: string;
  quoteCharacter?: string;
  escapeCharacter?: string;
  lineEnding?: string;
  encoding?: string;
  includeNulls?: boolean;
  nullValue?: string;
  dateFormat?: string;
  numberFormat?: string;
  booleanFormat?: string;
  trimWhitespace?: boolean;
  escapeQuotes?: boolean;
  doubleQuote?: boolean;
  skipEmptyLines?: boolean;
  maxRows?: number;
  chunkSize?: number;
}

const ExportFormCSV: React.FC<ExportFormCSVProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [options, setOptions] = useState<ExportCSVOptions>({
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
    maxRows: 0,
    chunkSize: 1000,
    ...value,
  });

  const paramInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOptions(prev => ({ ...prev, ...value }));
  }, [value]);

  useEffect(() => {
    onChange(options);
  }, [options, onChange]);

  useEffect(() => {
    if (paramInputRef.current) {
      paramInputRef.current.focus();
    }
  }, []);

  const handleOptionChange = (field: keyof ExportCSVOptions, newValue: any) => {
    setOptions(prev => ({ ...prev, [field]: newValue }));
  };

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

  const lineEndingOptions = [
    { value: '\n', label: 'Unix (LF)' },
    { value: '\r\n', label: 'Windows (CRLF)' },
    { value: '\r', label: 'Mac (CR)' },
  ];

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'utf-16', label: 'UTF-16' },
    { value: 'latin1', label: 'Latin-1' },
    { value: 'ascii', label: 'ASCII' },
  ];

  const dateFormatOptions = [
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD HH:mm:ss', label: 'YYYY-MM-DD HH:mm:ss' },
    { value: 'ISO', label: 'ISO 8601' },
  ];

  const numberFormatOptions = [
    { value: 'auto', label: 'Auto' },
    { value: 'decimal', label: 'Decimal' },
    { value: 'scientific', label: 'Scientific' },
    { value: 'currency', label: 'Currency' },
  ];

  const booleanFormatOptions = [
    { value: 'true/false', label: 'true/false' },
    { value: '1/0', label: '1/0' },
    { value: 'yes/no', label: 'yes/no' },
    { value: 'Y/N', label: 'Y/N' },
  ];

  return (
    <div className={`export-form-csv ${className}`}>
      <div className="form-group">
        <label htmlFor="delimiter">Field Delimiter</label>
        <select
          id="delimiter"
          value={options.delimiter}
          onChange={(e) => handleOptionChange('delimiter', e.target.value)}
          className="form-control"
        >
          {delimiterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          ref={paramInputRef}
          type="text"
          value={options.delimiter}
          onChange={(e) => handleOptionChange('delimiter', e.target.value)}
          className="form-control"
          placeholder="Custom delimiter"
        />
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.header}
            onChange={(e) => handleOptionChange('header', e.target.checked)}
            className="form-control"
          />
          <span>Include Header</span>
        </label>
      </div>

      <div className="form-group">
        <label htmlFor="quoteCharacter">Quote Character</label>
        <select
          id="quoteCharacter"
          value={options.quoteCharacter || ''}
          onChange={(e) => handleOptionChange('quoteCharacter', e.target.value)}
          className="form-control"
        >
          {quoteOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="escapeCharacter">Escape Character</label>
        <input
          id="escapeCharacter"
          type="text"
          value={options.escapeCharacter || ''}
          onChange={(e) => handleOptionChange('escapeCharacter', e.target.value)}
          className="form-control"
          placeholder="Escape character"
        />
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

      {options.includeNulls && (
        <div className="form-group">
          <label htmlFor="nullValue">NULL Value Representation</label>
          <input
            id="nullValue"
            type="text"
            value={options.nullValue || ''}
            onChange={(e) => handleOptionChange('nullValue', e.target.value)}
            className="form-control"
            placeholder="Empty string"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="dateFormat">Date Format</label>
        <select
          id="dateFormat"
          value={options.dateFormat || 'YYYY-MM-DD'}
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
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.trimWhitespace || false}
            onChange={(e) => handleOptionChange('trimWhitespace', e.target.checked)}
            className="form-control"
          />
          <span>Trim whitespace</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.escapeQuotes || false}
            onChange={(e) => handleOptionChange('escapeQuotes', e.target.checked)}
            className="form-control"
          />
          <span>Escape quotes</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.doubleQuote || false}
            onChange={(e) => handleOptionChange('doubleQuote', e.target.checked)}
            className="form-control"
          />
          <span>Double quote</span>
        </label>
      </div>

      <div className="form-group">
        <label className="checkbox-group">
          <input
            type="checkbox"
            checked={options.skipEmptyLines || false}
            onChange={(e) => handleOptionChange('skipEmptyLines', e.target.checked)}
            className="form-control"
          />
          <span>Skip empty lines</span>
        </label>
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

      <div className="export-info">
        <div className="alert alert-info">
          <i className="material-icons">info</i>
          <div>
            <strong>CSV Export Information:</strong>
            <ul>
              <li>Delimiter: {options.delimiter}</li>
              <li>Quote Character: {options.quoteCharacter || 'None'}</li>
              <li>Line Ending: {options.lineEnding === '\n' ? 'Unix (LF)' : options.lineEnding === '\r\n' ? 'Windows (CRLF)' : 'Mac (CR)'}</li>
              <li>Encoding: {options.encoding}</li>
              <li>Header: {options.header ? 'Yes' : 'No'}</li>
              <li>Max Rows: {options.maxRows || 'All'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportFormCSV;
