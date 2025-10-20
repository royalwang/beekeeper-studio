import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import ErrorAlert from '../ErrorAlert';
import { useAppSelector } from '../../../hooks';

interface UpdatePinModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePin: (oldPin: string, newPin: string) => Promise<void>;
  onCancel?: () => void;
}

const UpdatePinModal: React.FC<UpdatePinModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onUpdatePin,
  onCancel,
}) => {
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const oldPinInputRef = useRef<HTMLInputElement>(null);
  const newPinInputRef = useRef<HTMLInputElement>(null);
  const confirmPinInputRef = useRef<HTMLInputElement>(null);

  const minPinLength = useAppSelector((state) => state.settings.security?.minPinLength || 4);

  useEffect(() => {
    if (isOpen && oldPinInputRef.current) {
      oldPinInputRef.current.focus();
    }
  }, [isOpen]);

  const valid = newPin.length >= minPinLength && newPin === confirmPin;

  const toggleOldPinVisibility = () => {
    setShowOldPin(!showOldPin);
  };

  const toggleNewPinVisibility = () => {
    setShowNewPin(!showNewPin);
  };

  const toggleConfirmPinVisibility = () => {
    setShowConfirmPin(!showConfirmPin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setErrorMessage(null);

    if (!valid) {
      return;
    }

    if (!oldPin) {
      setErrorMessage('Please enter your current PIN');
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdatePin(oldPin, newPin);
      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to update PIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOldPin('');
    setNewPin('');
    setConfirmPin('');
    setShowOldPin(false);
    setShowNewPin(false);
    setShowConfirmPin(false);
    setErrorMessage(null);
    setAttemptedSubmit(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className="vue-dialog beekeeper-modal update-pin-modal"
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title has-icon">
            <i className="material-icons">edit</i>
            Update your PIN
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>
          
          <div className="description">
            <p>
              Enter your current PIN and choose a new one. Your new PIN will be required for all future database connections.
            </p>
          </div>

          {errorMessage && <ErrorAlert error={errorMessage} />}
          
          {!valid && attemptedSubmit && (
            <ErrorAlert
              error={`New PIN must be at least ${minPinLength} characters long`}
              title="Please fix the following errors"
            />
          )}

          <div className="form-group form-group-password">
            <label htmlFor="input-old-pin">Current PIN</label>
            <input
              ref={oldPinInputRef}
              id="input-old-pin"
              name="oldPin"
              type={showOldPin ? 'text' : 'password'}
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              placeholder="Enter your current PIN"
              disabled={isSubmitting}
            />
            <i
              className="material-icons password-icon"
              onClick={toggleOldPinVisibility}
              title={showOldPin ? 'Hide current PIN' : 'Show current PIN'}
            >
              {showOldPin ? 'visibility_off' : 'visibility'}
            </i>
          </div>

          <div className="form-group form-group-password">
            <label htmlFor="input-new-pin">New PIN</label>
            <input
              ref={newPinInputRef}
              id="input-new-pin"
              name="newPin"
              type={showNewPin ? 'text' : 'password'}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Enter your new PIN"
              disabled={isSubmitting}
            />
            <i
              className="material-icons password-icon"
              onClick={toggleNewPinVisibility}
              title={showNewPin ? 'Hide new PIN' : 'Show new PIN'}
            >
              {showNewPin ? 'visibility_off' : 'visibility'}
            </i>
          </div>

          <div className="form-group form-group-password">
            <label htmlFor="input-confirm-pin">Confirm New PIN</label>
            <input
              ref={confirmPinInputRef}
              id="input-confirm-pin"
              name="confirmPin"
              type={showConfirmPin ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm your new PIN"
              disabled={isSubmitting}
            />
            <i
              className="material-icons password-icon"
              onClick={toggleConfirmPinVisibility}
              title={showConfirmPin ? 'Hide confirm PIN' : 'Show confirm PIN'}
            >
              {showConfirmPin ? 'visibility_off' : 'visibility'}
            </i>
          </div>

          <div className="pin-requirements">
            <h4>PIN Requirements:</h4>
            <ul>
              <li>At least {minPinLength} characters long</li>
              <li>Must match confirmation</li>
              <li>Will be required for all database connections</li>
            </ul>
          </div>
        </div>

        <div className="vue-dialog-buttons">
          <button
            type="button"
            className="btn btn-flat"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!valid || isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update PIN'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default UpdatePinModal;
