import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import LoadingSpinner from '../loading/LoadingSpinner';

interface LoadingSSOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  modalName?: string;
  className?: string;
}

const LoadingSSOModal: React.FC<LoadingSSOModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  modalName = 'sso-loading-modal',
  className = '',
}) => {
  const [canceled, setCanceled] = useState(false);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCanceled(false);
      // Focus cancel button after modal opens
      setTimeout(() => {
        if (cancelBtnRef.current) {
          cancelBtnRef.current.focus();
        }
      }, 0);
    }
  }, [isOpen]);

  const handleCancel = () => {
    setCanceled(true);
    onCancel();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className={`vue-dialog beekeeper-modal wait-sso-modal ${className}`}
      name={modalName}
      clickToClose={false}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <div>
        <div className="dialog-content">
          <div className="dialog-c-title">
            Waiting for authentication
            <LoadingSpinner />
          </div>
          
          <div className="sso-info">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>SSO Authentication:</strong>
                <p>
                  Please complete the authentication process in your browser. 
                  This window will close automatically once authentication is successful.
                </p>
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
            disabled={canceled}
          >
            {canceled ? 'Canceling...' : 'Cancel'}
          </button>
        </div>
      </div>
    </Modal>,
    document.body
  );
};

export default LoadingSSOModal;
