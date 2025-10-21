import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppEvent } from '../common/AppEvent';

interface LostConnectionModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const LostConnectionModal: React.FC<LostConnectionModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [connError, setConnError] = useState<string>('');
  const disconnectButtonRef = useRef<HTMLButtonElement>(null);

  const dispatch = useDispatch();
  const connectionError = useSelector((state: any) => state.connection?.error);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    onClose?.();
  }, [onClose]);

  const handleDisconnect = useCallback(() => {
    dispatch({ type: 'connection/disconnect' });
    handleClose();
  }, [dispatch, handleClose]);

  const handleReconnect = useCallback(() => {
    dispatch({ type: 'connection/reconnect' });
    handleClose();
  }, [dispatch, handleClose]);

  const handleBeforeClose = useCallback(() => {
    // Handle any cleanup before closing
    console.log('Lost connection modal closing');
  }, []);

  useEffect(() => {
    const handleConnectionLost = (event: CustomEvent) => {
      const error = event.detail;
      setConnError(error || 'Connection lost');
      setModalVisible(true);
    };

    window.addEventListener(AppEvent.connectionLost, handleConnectionLost as EventListener);

    return () => {
      window.removeEventListener(AppEvent.connectionLost, handleConnectionLost as EventListener);
    };
  }, []);

  useEffect(() => {
    if (connectionError) {
      setConnError(connectionError);
      setModalVisible(true);
    }
  }, [connectionError]);

  useEffect(() => {
    if (modalVisible && disconnectButtonRef.current) {
      disconnectButtonRef.current.focus();
    }
  }, [modalVisible]);

  if (!isVisible && !modalVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">
          Lost Connection
        </div>
        <div>
          {connError} Would you like to reconnect?
        </div>
      </div>
      <div className="vue-dialog-buttons">
        <button 
          className="btn btn-flat" 
          type="button"
          onClick={handleDisconnect}
          autoFocus
          ref={disconnectButtonRef}
        >
          Disconnect
        </button>
        <button 
          className="btn btn-primary" 
          type="button"
          onClick={handleReconnect}
        >
          Reconnect
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default LostConnectionModal;
