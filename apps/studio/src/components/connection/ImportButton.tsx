import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../common/modals/Modal';

interface ImportButtonProps {
  onImport: (url: string) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  buttonText?: string;
}

const ImportButton: React.FC<ImportButtonProps> = ({
  onImport,
  children,
  className = '',
  buttonText = 'Import',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const importInputRef = useRef<HTMLInputElement>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setUrl('');
    setImportError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUrl('');
    setImportError(null);
    setIsImporting(false);
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);
    setIsImporting(true);

    try {
      await onImport(url);
      handleCloseModal();
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import from URL');
    } finally {
      setIsImporting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleImport(e);
    }
  };

  return (
    <div className={`import-button ${className}`}>
      <button
        className="btn btn-link btn-small"
        onClick={handleOpenModal}
        type="button"
      >
        {children}
      </button>

      {isModalOpen && createPortal(
        <Modal
          className="vue-dialog beekeeper-modal import-modal"
          name="import-modal"
          height="auto"
          scrollable={true}
          onOpened={() => {
            if (importInputRef.current) {
              importInputRef.current.select();
            }
          }}
        >
          <form onSubmit={handleImport}>
            <div className="dialog-content">
              <div className="dialog-c-title">
                Import from URL
              </div>
              
              {importError && (
                <div className="alert alert-danger">
                  <i className="material-icons">error_outline</i>
                  <div>{importError}</div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="url">Paste URL</label>
                <input
                  ref={importInputRef}
                  className="form-control"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com/connection.json"
                  disabled={isImporting}
                />
                <small className="form-text text-muted">
                  Paste a URL to import connection configuration
                </small>
              </div>

              <div className="import-info">
                <div className="alert alert-info">
                  <i className="material-icons">info</i>
                  <div>
                    <strong>Import Information:</strong>
                    <ul>
                      <li>Supported formats: JSON, YAML</li>
                      <li>Connection details will be validated</li>
                      <li>Passwords may need to be re-entered</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="vue-dialog-buttons">
              <button
                className="btn btn-flat"
                type="button"
                onClick={handleCloseModal}
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!url.trim() || isImporting}
              >
                {isImporting ? 'Importing...' : buttonText}
              </button>
            </div>
          </form>
        </Modal>,
        document.body
      )}
    </div>
  );
};

export default ImportButton;
