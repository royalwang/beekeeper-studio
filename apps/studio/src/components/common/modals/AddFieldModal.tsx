import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import Select from 'react-select';

interface AddFieldModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onAddField: (fieldName: string, typeHint: string) => Promise<void>;
  onCancel?: () => void;
  columnTypes?: Array<{ value: string; label: string }>;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onAddField,
  onCancel,
  columnTypes = [
    { value: 'string', label: 'String' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
    { value: 'datetime', label: 'DateTime' },
    { value: 'text', label: 'Text' },
    { value: 'json', label: 'JSON' },
    { value: 'uuid', label: 'UUID' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
  ],
}) => {
  const [fieldName, setFieldName] = useState('');
  const [typeHint, setTypeHint] = useState<{ value: string; label: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldInputRef = useRef<HTMLInputElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && fieldInputRef.current) {
      fieldInputRef.current.focus();
    }
  }, [isOpen]);

  const canSubmit = fieldName.trim() && typeHint;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onAddField(fieldName.trim(), typeHint!.value);
      handleClose();
    } catch (error) {
      console.error('Failed to add field:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFieldName('');
    setTypeHint(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className="vue-dialog beekeeper-modal"
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title">
            Add Field
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="field-name">Field Name</label>
            <input
              ref={fieldInputRef}
              type="text"
              id="field-name"
              name="field-name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter field name"
              disabled={isSubmitting}
            />
            <small className="form-text text-muted">
              Choose a descriptive name for the field
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="type-hint">Type Hint</label>
            <div className="data-select-wrap">
              <Select
                value={typeHint}
                onChange={setTypeHint}
                options={columnTypes}
                placeholder="Select a type hint..."
                className="dropdown-search"
                classNamePrefix="react-select"
                isDisabled={isSubmitting}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
            <small className="form-text text-muted">
              Select the data type for this field
            </small>
          </div>

          <div className="field-info">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>Field Information:</strong>
                <ul>
                  <li>Field names should be descriptive and follow naming conventions</li>
                  <li>Type hints help with data validation and formatting</li>
                  <li>Fields can be modified after creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="vue-dialog-buttons">
          <button
            ref={cancelBtnRef}
            className="btn btn-flat btn-cancel"
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default AddFieldModal;
