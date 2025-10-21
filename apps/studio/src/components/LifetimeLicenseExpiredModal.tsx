import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { AppEvent } from '../common/AppEvent';

interface LifetimeLicenseExpiredModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const LifetimeLicenseExpiredModal: React.FC<LifetimeLicenseExpiredModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const maxAllowedVersion = useSelector((state: any) => {
    const version = state.licenses?.status?.maxAllowedVersion;
    if (version) {
      return `${version.major}.${version.minor}.${version.patch}`;
    }
    return '1.0.0';
  });

  const handleClose = useCallback(() => {
    setModalVisible(false);
    onClose?.();
  }, [onClose]);

  const handlePurchase = useCallback(() => {
    // Mock purchase license
    console.log('Opening license modal');
    handleClose();
    // In a real app, this would trigger the license modal
    // window.dispatchEvent(new CustomEvent(AppEvent.enterLicense));
  }, [handleClose]);

  const handleLearnMore = useCallback(() => {
    // Open learn more link
    window.open(
      'https://docs.beekeeperstudio.io/docs/upgrading-from-the-community-edition',
      '_blank',
      'noopener,noreferrer'
    );
  }, []);

  useEffect(() => {
    const handleLicenseSupportExpired = (event: CustomEvent) => {
      setModalVisible(true);
    };

    window.addEventListener(AppEvent.licenseSupportDateExpired, handleLicenseSupportExpired as EventListener);

    return () => {
      window.removeEventListener(AppEvent.licenseSupportDateExpired, handleLicenseSupportExpired as EventListener);
    };
  }, []);

  if (!isVisible && !modalVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">Your license has ended</div>
        <div>
          Your license has ended. But you can continue using all features using
          Beekeeper Studio version {maxAllowedVersion} or later.
        </div>
      </div>
      <div className="vue-dialog-buttons">
        <button 
          className="btn btn-flat" 
          type="button" 
          onClick={handleClose}
        >
          Close
        </button>
        <a
          href="https://docs.beekeeperstudio.io/docs/upgrading-from-the-community-edition"
          className="btn btn-flat"
          onClick={handleLearnMore}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
        <button 
          className="btn btn-flat" 
          type="button" 
          onClick={handlePurchase}
        >
          Purchase a license
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default LifetimeLicenseExpiredModal;
