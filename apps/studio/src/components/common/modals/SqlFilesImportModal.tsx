import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import FilePicker from '../form/FilePicker';

interface SqlFilesImportModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onImportFiles: (files: File[]) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const SqlFilesImportModal: React.FC<SqlFilesImportModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onImportFiles,
  onCancel,
  className = '',
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && filePickerRef.current) {
      filePickerRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsImporting(true);
    setError(null);

    try {
      await onImportFiles(files);
      handleClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to import SQL files');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setFiles([]);
    setIsImporting(false);
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && files.length > 0) {
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
      className={`vue-dialog beekeeper-modal sql-files-import-modal ${className}`}
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <div onKeyDown={handleKeyDown}>
        <div className="dialog-content">
          <div className="dialog-c-title">
            Import SQL Files into Saved Queries
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>

          <div className="message">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                This will make a copy of your .sql files and add them to your Beekeeper
                Studio saved queries. Any changes to the original .sql files will not be
                reflected in Beekeeper Studio.
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">
              <i className="material-icons">error_outline</i>
              <div>{error}</div>
            </div>
          )}

          <div className="file-picker-wrapper" ref={filePickerRef} tabIndex={0}>
            <FilePicker
              value={files.map(f => f.name).join(', ')}
              onChange={(value) => {
                // Handle file selection
                console.log('Files selected:', value);
              }}
              buttonText="Choose Files"
              options={{
                properties: ['openFile', 'multiSelections'],
                filters: [
                  { name: 'SQL files (*.sql)', extensions: ['sql'] },
                  { name: 'All files', extensions: ['*'] },
                ],
              }}
            />
            
            {files.length > 0 && (
              <div className="selected-files">
                <h4>Selected Files ({files.length}):</h4>
                <ul>
                  {files.map((file, index) => (
                    <li key={index} className="file-item">
                      <i className="material-icons">description</i>
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="import-info">
            <div className="alert alert-warning">
              <i className="material-icons">warning</i>
              <div>
                <strong>Import Information:</strong>
                <ul>
                  <li>Only .sql files are recommended</li>
                  <li>Files will be copied to Beekeeper Studio</li>
                  <li>Original files will remain unchanged</li>
                  <li>Large files may take time to process</li>
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
            disabled={isImporting}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleSubmit}
            disabled={files.length === 0 || isImporting}
          >
            {isImporting ? 'Importing...' : `Import ${files.length} Files`}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default SqlFilesImportModal;
