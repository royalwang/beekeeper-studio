import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';

const UtilDiedModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const handleDisconnect = () => {
    dispatch({ type: 'disconnect' });
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    const handleUtilDied = () => {
      setIsVisible(true);
    };

    // Mock implementation - in a real app, this would listen to the main process
    // window.main.onUtilDied(handleUtilDied);
    
    // For now, we'll simulate the event
    const timer = setTimeout(() => {
      // Simulate util died event after 5 seconds for testing
      // handleUtilDied();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">
          Utility Process Crashed
        </div>
        <div>
          Looks like the utility process has crashed! We've automatically restarted it, but you may need to reconnect to your database if you were previously connected. If this persists, please report it on our{' '}
          <a 
            className="text-primary" 
            href="https://github.com/beekeeper-studio/beekeeper-studio/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
          >
            issue tracker
          </a>.
        </div>
      </div>
      <div className="vue-dialog-buttons">
        <button 
          className="btn btn-flat"
          style={{ marginRight: '0.5rem' }}
          type="button"
          onClick={handleClose}
        >
          Close
        </button>
        <button 
          className="btn btn-primary"
          type="button"
          onClick={handleDisconnect}
          autoFocus
        >
          Disconnect
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default UtilDiedModal;
