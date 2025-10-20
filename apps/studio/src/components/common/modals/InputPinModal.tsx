import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from './Modal';
import ErrorAlert from '../ErrorAlert';
import ExternalLink from '../ExternalLink';

interface InputPinModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onPinSubmit: (pin: string) => Promise<void>;
  onCancel?: () => void;
  onForgotPin?: () => void;
}

const InputPinModal: React.FC<InputPinModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onPinSubmit,
  onCancel,
  onForgotPin,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isOpen]);

  const togglePinVisibility = () => {
    setShowPin(!showPin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await onPinSubmit(pin);
      handleClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid PIN');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setShowPin(false);
    setErrorMessage(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleCancel = () => {
    handleClose();
    onCancel?.();
  };

  const handleForgotPin = () => {
    onForgotPin?.();
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className="vue-dialog beekeeper-modal input-pin-modal"
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title has-icon">
            <i className="material-icons">lock_open</i>
            Please input your PIN
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>
          
          <div className="description">
            <p>Enter your PIN to connect to the database.</p>
          </div>
          
          {errorMessage && <ErrorAlert error={errorMessage} />}
          
          <div className="form-group form-group-password">
            <label htmlFor="input-pin">PIN</label>
            <input
              ref={pinInputRef}
              id="input-pin"
              name="pin"
              type={showPin ? 'text' : 'password'}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter your PIN"
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

          <small style={{ marginTop: '8px', display: 'block' }}>
            <ExternalLink
              href="https://docs.beekeeperstudio.io/user_guide/configuration#forgot-pin"
              style={{ textDecoration: 'underline' }}
            >
              Forgot your PIN?
            </ExternalLink>
          </small>
        </div>

        <div className="vue-dialog-buttons">
          <button
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
            disabled={!pin.trim() || isSubmitting}
          >
            {isSubmitting ? 'Connecting...' : 'Connect'}
          </button>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default InputPinModal;
