import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';

interface CreateCollectionModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateCollection: (collectionName: string) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onCreateCollection,
  onCancel,
  className = '',
}) => {
  const [collectionName, setCollectionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const collectionInputRef = useRef<HTMLInputElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && collectionInputRef.current) {
      collectionInputRef.current.focus();
    }
  }, [isOpen]);

  const canSubmit = collectionName.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      await onCreateCollection(collectionName.trim());
      handleClose();
    } catch (error) {
      console.error('Failed to create collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCollectionName('');
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
      handleSubmit();
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
      <div>
        <div className="dialog-content">
          <div className="dialog-c-title">
            Create Collection
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="collection-name">Collection Name</label>
            <input
              ref={collectionInputRef}
              type="text"
              id="collection-name"
              name="collection-name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter collection name"
              disabled={isSubmitting}
            />
            <small className="form-text text-muted">
              Choose a descriptive name for the collection
            </small>
          </div>

          <div className="collection-info">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>Collection Information:</strong>
                <ul>
                  <li>Collections help organize your database objects</li>
                  <li>Names should be descriptive and follow naming conventions</li>
                  <li>Collections can be modified after creation</li>
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
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default CreateCollectionModal;
