import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ErrorAlert from '../common/ErrorAlert';
import StatusBar from '../common/StatusBar';
import TextEditor from '../common/texteditor/TextEditor';
import { isMac } from '@shared/lib/utils/platform';

interface TableSchemaValidationProps {
  table: any;
  onRefresh: () => void;
  onReset: () => void;
  onApply: (payload: { validationLevel: string; validationAction: string; schemaJSON: string }) => void;
  isDirty?: boolean;
  className?: string;
}

const TableSchemaValidation: React.FC<TableSchemaValidationProps> = ({
  table,
  onRefresh,
  onReset,
  onApply,
  isDirty = false,
  className = '',
}) => {
  const [error, setError] = useState<string | null>(null);
  const [validationLevel, setValidationLevel] = useState<'off' | 'moderate' | 'strict'>('moderate');
  const [validationAction, setValidationAction] = useState<'error' | 'warn'>('error');
  const [schemaJSON, setSchemaJSON] = useState<string>('{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "properties": {}\n}');

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const dialect = activeConnection?.dialect || 'sqlite';

  useEffect(() => {
    // Placeholder: load current validation
  }, [table]);

  const ctrlOrCmd = (k: string) => (isMac ? `⌘${k}` : `Ctrl+${k}`);

  const resetForm = () => {
    onReset();
  };

  const applyChanges = () => {
    onApply({ validationLevel, validationAction, schemaJSON });
  };

  return (
    <div className={`table-info-table table-schema-validation ${className || ''}`}>
      <div className="table-info-table-wrap">
        <div className="center-wrap">
          {error && <ErrorAlert error={error} />}

          <div className="table-subheader">
            <div className="table-title">
              <h2>Schema Validation</h2>
            </div>
            <span className="expand" />
            <div className="actions">
              <button className="btn btn-link btn-fab" title={`${ctrlOrCmd('r')} or F5`} onClick={onRefresh}>
                <i className="material-icons">refresh</i>
              </button>
            </div>
          </div>

          <div className="validation-settings">
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="validation-level">Validation Level</label>
                <select id="validation-level" className="form-control" value={validationLevel} onChange={(e) => setValidationLevel(e.target.value as any)}>
                  <option value="off">Off (No validation)</option>
                  <option value="moderate">Moderate (Apply to inserts and updates)</option>
                  <option value="strict">Strict (Apply to all operations)</option>
                </select>
                <small className="form-text text-muted">
                  Controls how strictly MongoDB applies validation rules to existing documents during updates
                </small>
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="validation-action">Validation Action</label>
                <select id="validation-action" className="form-control" value={validationAction} onChange={(e) => setValidationAction(e.target.value as any)}>
                  <option value="error">Error (Reject invalid documents)</option>
                  <option value="warn">Warn (Allow invalid documents, but log warnings)</option>
                </select>
                <small className="form-text text-muted">
                  Controls whether MongoDB rejects invalid documents or just logs warnings
                </small>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="schema-editor">JSON Schema</label>
              <div className="schema-editor">
                <TextEditor
                  value={schemaJSON}
                  mode="application/json"
                  lineNumbers
                  onChange={setSchemaJSON}
                  height="300px"
                />
              </div>
              <small className="form-text text-muted">
                MongoDB uses JSON Schema to validate document structure
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="expand" />

      <StatusBar className="tabulator-footer" active={true}>
        <div className="flex flex-middle statusbar-actions">
          {isDirty && (
            <>
              <button className="btn btn-flat reset" onClick={resetForm}>Reset</button>
              <div className="pending-changes">
                <button className="btn btn-primary" onClick={applyChanges}>Apply</button>
                <button className="btn btn-primary" onClick={() => navigator.clipboard.writeText(schemaJSON)}>
                  <i className="material-icons">arrow_drop_down</i>
                </button>
              </div>
            </>
          )}
        </div>
      </StatusBar>
    </div>
  );
};

export default TableSchemaValidation;
