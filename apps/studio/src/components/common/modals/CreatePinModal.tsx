import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import ErrorAlert from '../ErrorAlert';
import { useAppSelector } from '../../../hooks';

interface CreatePinModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onCreatePin: (pin: string) => Promise<void>;
  onCancel?: () => void;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onCreatePin,
  onCancel,
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinInputRef = useRef<HTMLInputElement>(null);
  const confirmPinInputRef = useRef<HTMLInputElement>(null);

  const minPinLength = useAppSelector((state) => state.settings.security?.minPinLength || 4);

  useEffect(() => {
    if (isOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isOpen]);

  const validation = {
    isValid: pin.length >= minPinLength && pin === confirmPin,
    message: pin.length < minPinLength
      ? `PIN must be at least ${minPinLength} characters long`
      : pin !== confirmPin
      ? 'PINs do not match'
      : '',
  };

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const toggleConfirmPinVisibility = () => {
    setShowConfirmPin(!showConfirmPin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setErrorMessage(null);

    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreatePin(pin);
      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create PIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setConfirmPin('');
    setShowPin(false);
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
      className="vue-dialog beekeeper-modal create-pin-modal"
      name={modalName}
      clickToClose={false}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title has-icon">
            <i className="material-icons">lock</i>
            Create your PIN
          </div>
          
          <div className="description">
            <p>
              Create a secure PIN to protect your database connections. This PIN will be required whenever you connect to any database.
            </p>
          </div>

          {errorMessage && <ErrorAlert error={errorMessage} />}
          
          {!validation.isValid && attemptedSubmit && (
            <ErrorAlert
              error={validation.message}
              title="Please fix the following errors"
            />
          )}

          <div className="form-group form-group-password">
            <label htmlFor="input-pin">PIN</label>
            <input
              ref={pinInputRef}
              id="input-pin"
              name="pin"
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={`Enter at least ${minPinLength} characters`}
              disabled={isSubmitting}
            />
            <i
              className="material-icons password-icon"
              onClick={togglePinVisibility}
              title={showPin ? 'Hide PIN' : 'Show PIN'}
            >
              {showPin ? 'visibility_off' : 'visibility'}
            </i>
          </div>

          <div className="form-group form-group-password">
            <label htmlFor="input-confirm-pin">Confirm PIN</label>
            <input
              ref={confirmPinInputRef}
              id="input-confirm-pin"
              name="confirmPin"
              type={showConfirmPin ? 'text' : 'password'}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm your PIN"
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
              <li>Can be updated later in settings</li>
            </ul>
          </div>

          <div className="security-notice">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>Security Notice:</strong> Your PIN is used to encrypt sensitive connection data. 
                Make sure to choose a strong PIN and keep it secure. If you forget your PIN, 
                you may need to reconfigure your database connections.
              </div>
            </div>
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
            disabled={!validation.isValid || isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create PIN'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default CreatePinModal;
