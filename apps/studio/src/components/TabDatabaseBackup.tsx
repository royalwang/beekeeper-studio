import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Stepper from './stepper/Stepper';
import BackupSettings from './backup/BackupSettings';
import { DialectTitles } from '@shared/lib/dialects/models';

interface TabDatabaseBackupProps {
  tab: any;
  active: boolean;
  isRestore?: boolean;
  onClose?: () => void;
}

const TabDatabaseBackup: React.FC<TabDatabaseBackupProps> = ({
  tab,
  active,
  isRestore = false,
  onClose
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [backupRunning, setBackupRunning] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usedConfig = useSelector((state: any) => state.connection?.usedConfig);
  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);

  const dialect = usedConfig?.connectionType || '';
  const dialectTitle = DialectTitles[dialect] || dialect;

  const isSupported = useCallback(() => {
    // Mock implementation - in a real app, this would check if the dialect supports backup/restore
    const supportedDialects = ['mysql', 'postgresql', 'sqlite'];
    return supportedDialects.includes(dialect);
  }, [dialect]);

  const steps = [
    {
      id: 'settings',
      title: isRestore ? 'Restore Settings' : 'Backup Settings',
      component: BackupSettings,
    },
  ];

  const loadData = useCallback(async () => {
    setDataLoaded(false);
    setError(null);

    try {
      // Mock data loading
      console.log('Loading backup/restore data for:', dialect);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDataLoaded(true);
    } catch (err) {
      setError('Failed to load backup data');
    }
  }, [dialect]);

  const runBackup = useCallback(async () => {
    setBackupRunning(true);
    setError(null);

    try {
      // Mock backup/restore process
      console.log(`Running ${isRestore ? 'restore' : 'backup'} for:`, dialect);
      
      // Simulate backup/restore process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setBackupSuccess(true);
    } catch (err) {
      setError(`${isRestore ? 'Restore' : 'Backup'} failed`);
    } finally {
      setBackupRunning(false);
    }
  }, [dialect, isRestore]);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleFocusCloseTab = useCallback(() => {
    // Focus close button when modal opens
    const closeButton = document.querySelector('.close-tab-btn');
    if (closeButton) {
      (closeButton as HTMLElement).focus();
    }
  }, []);

  useEffect(() => {
    if (active) {
      loadData();
    }
  }, [active, loadData]);

  if (!isSupported()) {
    return (
      <div className="tabcontent">
        <div className="not-supported">
          <div className="card-flat padding">
            <h3 className="card-title">
              Beekeeper does not currently support {isRestore ? 'restore' : 'backups'} for {dialectTitle} ☹️
            </h3>
          </div>
        </div>
      </div>
    );
  }

  if (isCommunity) {
    return (
      <div className="tab-upsell-wrapper">
        <div className="upsell-content">
          <h3>Upgrade Required</h3>
          <p>Database {isRestore ? 'restore' : 'backup'} is available in the Pro version.</p>
        </div>
      </div>
    );
  }

  if (!dataLoaded) {
    return (
      <div className="tabcontent">
        <div className="loading-wrapper">
          <div className="progress-bar">
            <div className="progress-content">
              <div className="progress-spinner">
                <div className="spinner"></div>
              </div>
              <p>Loading {isRestore ? 'restore' : 'backup'} options...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!backupRunning) {
    return (
      <div className="tabcontent">
        <div className="backup-stepper-wrapper">
          <Stepper
            steps={steps}
            wrapperClass={isRestore ? 'restore-stepper' : 'backup-stepper'}
            onFinished={runBackup}
          />
        </div>
      </div>
    );
  }

  if (backupSuccess) {
    return (
      <div className="tabcontent">
        <div className="backup-tab-progress">
          <div className="vue-dialog beekeeper-modal relative job-status success">
            <div className="dialog-content">
              <div className="outer-circle">
                <div className="inner-circle">
                  <i className="material-icons">check</i>
                </div>
              </div>
              <div>{isRestore ? 'Restore' : 'Backup'} Successful!!</div>
              <button
                className="btn btn-primary primary-action close-tab-btn"
                onClick={handleClose}
                onFocus={handleFocusCloseTab}
              >
                Close Tab
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tabcontent">
      <div className="backup-tab-progress">
        <div className="backup-progress-wrapper">
          <div className="progress-spinner">
            <div className="spinner"></div>
          </div>
          <div className="progress-text">
            {isRestore ? 'Restoring' : 'Backing up'} database...
          </div>
          {error && (
            <div className="alert alert-danger">
              <i className="material-icons">error</i>
              <div>{error}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabDatabaseBackup;
