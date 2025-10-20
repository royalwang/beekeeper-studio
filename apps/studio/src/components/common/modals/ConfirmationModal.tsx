import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmationModalProps {
  id: string;
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose?: () => void;
  className?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  autoFocus?: 'confirm' | 'cancel';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id,
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  className = '',
  confirmButtonClass = 'btn btn-primary',
  cancelButtonClass = 'btn btn-flat',
  autoFocus = 'cancel',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the appropriate button
      const focusButton = autoFocus === 'confirm' ? confirmBtnRef.current : cancelBtnRef.current;
      if (focusButton) {
        focusButton.focus();
      }

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancel();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, autoFocus]);

  const handleConfirm = () => {
    onConfirm();
    onClose?.();
  };

  const handleCancel = () => {
    onCancel();
    onClose?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  const modalElement = (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={`vue-dialog beekeeper-modal confirmation-modal ${className}`}
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-message`}
      >
        <div className="dialog-content">
          <div className="dialog-c-title" id={`${id}-title`}>
            {title}
          </div>
          <div id={`${id}-message`} className="dialog-message">
            {message}
          </div>
        </div>
        
        <div className="vue-dialog-buttons">
          <button
            ref={cancelBtnRef}
            type="button"
            className={cancelButtonClass}
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            className={confirmButtonClass}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  // Render to portal
  const portalTarget = document.getElementById('modals') || document.body;
  return createPortal(modalElement, portalTarget);
};

export default ConfirmationModal;
