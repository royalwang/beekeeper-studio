import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { AppEvent } from '../common/AppEvent';

interface UpgradeRequiredModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const UpgradeRequiredModal: React.FC<UpgradeRequiredModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const showModal = (modalMessage: string) => {
    if (isCommunity) {
      setMessage(modalMessage);
    }
  };

  const handleClose = () => {
    setMessage(null);
    onClose?.();
  };

  useEffect(() => {
    const handleUpgradeModal = (event: CustomEvent) => {
      showModal(event.detail);
    };

    window.addEventListener(AppEvent.upgradeModal, handleUpgradeModal as EventListener);

    return () => {
      window.removeEventListener(AppEvent.upgradeModal, handleUpgradeModal as EventListener);
    };
  }, []);

  if (!isVisible && !message) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal upgrade-modal">
      <div className="dialog-content">
        <h3 className="dialog-c-title has-icon">
          <i className="material-icons">stars</i> 
          <span>Upgrade Beekeeper Studio</span>
        </h3>

        <a
          className="close-btn btn btn-fab"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClose();
          }}
        >
          <i className="material-icons">clear</i>
        </a>
        
        <div className="checkbox-wrapper">
          <p className="text-muted">
            <strong>{message && `${message}.`}</strong> Upgrade to get exclusive features:
          </p>
          <div className="row">
            <div className="col s6">
              <ul className="check-list">
                <li>Run queries directly to file</li>
                <li>Export multiple tables</li>
                <li>Backup & restore</li>
                <li>Magic formatting</li>
                <li>More than 2 table filters</li>
              </ul>
            </div>
            <div className="col s6">
              <ul className="check-list">
                <li title="Oracle, Cassandra, BigQuery, and more">
                  More database engines
                </li>
                <li>Cloud sync</li>
                <li>Read-only mode</li>
                <li>SQLite Extensions</li>
                <li>Import from file</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="vue-dialog-buttons">
          {/* UpsellButtons component would go here */}
          <div className="upsell-buttons">
            <button className="btn btn-primary">Upgrade Now</button>
            <button className="btn btn-flat" onClick={handleClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default UpgradeRequiredModal;
