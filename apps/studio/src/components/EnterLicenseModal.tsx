import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import ErrorAlert from './common/ErrorAlert';
import LicenseInformation from './ultimate/LicenseInformation';
import { AppEvent } from '../common/AppEvent';

interface License {
  id: string;
  name: string;
  key: string;
  validUntil: Date;
  type: string;
}

interface EnterLicenseModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const EnterLicenseModal: React.FC<EnterLicenseModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [email, setEmail] = useState('');
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const license = useSelector((state: any) => state.license?.license);
  const licenseStatus = useSelector((state: any) => state.license?.status);
  const realLicenses = useSelector((state: any) => state.license?.realLicenses || []);
  const trialLicense = useSelector((state: any) => state.license?.trialLicense);
  const appVersion = useSelector((state: any) => state.config?.appVersion || '1.0.0');

  const handleClose = useCallback(() => {
    setEmail('');
    setKey('');
    setError(null);
    onClose?.();
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !key.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch({
        type: 'license/submitLicense',
        payload: {
          email: email.trim(),
          key: key.trim(),
        }
      });
      handleClose();
    } catch (ex) {
      setError('Failed to submit license');
    } finally {
      setLoading(false);
    }
  }, [email, key, dispatch, handleClose]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }, []);

  const handleKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKey(e.target.value);
  }, []);

  const timeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) {
      return `${days} days remaining`;
    } else {
      return 'Expired';
    }
  }, []);

  useEffect(() => {
    const handleLicenseModal = () => {
      // This would be triggered by the app event
      console.log('License modal opened');
    };

    window.addEventListener(AppEvent.openLicenseModal, handleLicenseModal as EventListener);

    return () => {
      window.removeEventListener(AppEvent.openLicenseModal, handleLicenseModal as EventListener);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title">
            License Key Management
          </div>
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
          
          {license && (
            <div className="existing-licenses">
              <p>Current license information</p>
              <div className="dialog-c-subtitle">
                <LicenseInformation 
                  license={license} 
                  licenseStatus={licenseStatus} 
                />
              </div>
            </div>
          )}
          
          {!license && (
            <div>
              <div className="alert alert-info">
                <i className="material-icons-outlined">info</i>
                <span>
                  Entering a license will unlock premium features such as Oracle, DuckDB, and ClickHouse connections,
                  JSON view, multi-table features, and more.{' '}
                  <a
                    href="https://docs.beekeeperstudio.io/support/upgrading-from-the-community-edition/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>.
                </span>
              </div>
              <p>You don't have any licenses registered with the application at the moment. Register a new license below.</p>
              {trialLicense && (
                <p className="text-muted small">
                  Free trial expiry: {timeAgo(trialLicense.validUntil)}, on{' '}
                  {trialLicense.validUntil.toLocaleDateString()}
                </p>
              )}
              {error && <ErrorAlert error={error} />}
              <div className="form-group">
                <label htmlFor="email">License Name</label>
                <input 
                  type="text" 
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="key">License Key</label>
                <input 
                  type="text" 
                  id="key"
                  value={key}
                  onChange={handleKeyChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="vue-dialog-buttons flex flex-middle">
          <span className="app-version small text-muted">
            Current app version: {appVersion}
          </span>
          <span className="expand" />
          <span>
            <a 
              href="https://beekeeperstudio.io/pricing" 
              className="btn btn-flat"
              target="_blank"
              rel="noopener noreferrer"
            >
              Buy a new license
            </a>
            {!realLicenses?.length && (
              <button 
                type="submit" 
                className="btn btn-primary mt-2"
                disabled={loading || !email.trim() || !key.trim()}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            )}
          </span>
        </div>
      </form>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default EnterLicenseModal;
