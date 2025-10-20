import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import ErrorAlert from '../ErrorAlert';

interface RenameDatabaseElementModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  onCancel?: () => void;
  elementType: string;
  currentName: string;
  className?: string;
}

const RenameDatabaseElementModal: React.FC<RenameDatabaseElementModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onRename,
  onCancel,
  elementType,
  currentName,
  className = '',
}) => {
  const [elementNewName, setElementNewName] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setElementNewName(currentName);
      setErrors(null);
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.select();
      }
    }
  }, [isOpen, currentName]);

  const handleRename = async () => {
    if (!elementNewName.trim() || elementNewName.trim() === currentName) {
      return;
    }

    setLoading(true);
    setErrors(null);

    try {
      await onRename(elementNewName.trim());
      handleClose();
    } catch (error) {
      setErrors(error instanceof Error ? error.message : 'Failed to rename element');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setElementNewName(currentName);
    setLoading(false);
    setErrors(null);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && elementNewName.trim() && elementNewName.trim() !== currentName) {
      e.preventDefault();
      handleRename();
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
      className={`vue-dialog beekeeper-modal ${className}`}
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <div onKeyDown={handleKeyDown}>
        <div className="dialog-content">
          <div className="dialog-c-title">
            Rename {elementType.toLowerCase()}
          </div>

          <div className="alert alert-warning">
            <i className="material-icons">warning</i>
            <span>
              Be cautious when renaming database object, as it may disrupt related queries, functions, procedures, or other objects that reference it.
            </span>
          </div>

          {errors && (
            <ErrorAlert
              error={errors}
              title={`Failed to rename ${elementType.toLowerCase()}`}
            />
          )}

          <div className="form-group">
            <label htmlFor="element-name">Name</label>
            <input
              ref={nameInputRef}
              id="element-name"
              name="name"
              type="text"
              value={elementNewName}
              onChange={(e) => setElementNewName(e.target.value)}
              placeholder={`Enter new ${elementType.toLowerCase()} name`}
              disabled={loading}
            />
            <small className="form-text text-muted">
              Current name: <strong>{currentName}</strong>
            </small>
          </div>

          <div className="rename-info">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>Rename Information:</strong>
                <ul>
                  <li>Names should follow database naming conventions</li>
                  <li>Avoid special characters and reserved words</li>
                  <li>Changes will affect all references to this object</li>
                  <li>Consider backing up your database before renaming</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="vue-dialog-buttons">
          <button
            className="btn btn-flat"
            type="button"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleRename}
            disabled={loading || !elementNewName.trim() || elementNewName.trim() === currentName}
          >
            {loading ? 'Renaming...' : 'Apply'}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default RenameDatabaseElementModal;