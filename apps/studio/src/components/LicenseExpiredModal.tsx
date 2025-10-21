import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AppEvent } from '../common/AppEvent';

interface LicenseStatus {
  isTrial: boolean;
  isCommunity: boolean;
}

interface LicenseExpiredModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const LicenseExpiredModal: React.FC<LicenseExpiredModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleClose = useCallback(() => {
    setModalVisible(false);
    onClose?.();
  }, [onClose]);

  const handleDowngrade = useCallback(() => {
    // Mock downgrade to free edition
    console.log('Downgrading to free edition');
    handleClose();
  }, [handleClose]);

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
    const handleLicenseExpired = (event: CustomEvent) => {
      const status: LicenseStatus = event.detail;
      if (!status.isTrial && status.isCommunity) {
        setModalVisible(true);
      }
    };

    window.addEventListener(AppEvent.licenseValidDateExpired, handleLicenseExpired as EventListener);

    return () => {
      window.removeEventListener(AppEvent.licenseValidDateExpired, handleLicenseExpired as EventListener);
    };
  }, []);

  if (!isVisible && !modalVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">Your license has ended</div>
        <div>Your license has ended</div>
      </div>
      <div className="vue-dialog-buttons">
        <button 
          className="btn btn-flat" 
          type="button" 
          onClick={handleDowngrade}
        >
          Downgrade to limited free edition
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

export default LicenseExpiredModal;
