import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ExportNotificationProps {
  exporter: any;
  exportId: string;
  onCancelExport: (exportId: string) => Promise<void>;
  onHideNotification: () => void;
  onShowExportDetails: (exportId: string) => void;
  onShowExportLogs: (exportId: string) => void;
  onShowExportSettings: (exportId: string) => void;
  onShowExportBackup: (exportId: string) => void;
  onShowExportRestore: (exportId: string) => void;
  onShowExportExport: (exportId: string) => void;
  onShowExportImport: (exportId: string) => void;
  onShowExportClone: (exportId: string) => void;
  onShowExportDelete: (exportId: string) => void;
  className?: string;
}

const ExportNotification: React.FC<ExportNotificationProps> = ({
  exporter,
  exportId,
  onCancelExport,
  onHideNotification,
  onShowExportDetails,
  onShowExportLogs,
  onShowExportSettings,
  onShowExportBackup,
  onShowExportRestore,
  onShowExportExport,
  onShowExportImport,
  onShowExportClone,
  onShowExportDelete,
  className = '',
}) => {
  const [percentComplete, setPercentComplete] = useState(0);
  const [exportName, setExportName] = useState<string | null>(null);
  const [countExported, setCountExported] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);
  const exportStatus = useSelector((state: RootState) => state.export.status);

  useEffect(() => {
    if (exportId && exporter) {
      setExportName(exporter.name || 'Unknown Export');
      setPercentComplete(exporter.percentComplete || 0);
      setCountExported(exporter.countExported || null);
    }
  }, [exportId, exporter]);

  useEffect(() => {
    if (exportStatus && exportStatus.id === exportId) {
      setPercentComplete(exportStatus.percentComplete || 0);
      setCountExported(exportStatus.countExported || null);
    }
  }, [exportStatus, exportId]);

  const handleCancelExport = async () => {
    if (!exportId || isCancelling) {
      return;
    }

    setIsCancelling(true);
    try {
      await onCancelExport(exportId);
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to cancel export:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleHideNotification = () => {
    setIsVisible(false);
    onHideNotification();
  };

  const handleShowExportDetails = () => {
    onShowExportDetails(exportId);
    setShowMenu(false);
  };

  const handleShowExportLogs = () => {
    onShowExportLogs(exportId);
    setShowMenu(false);
  };

  const handleShowExportSettings = () => {
    onShowExportSettings(exportId);
    setShowMenu(false);
  };

  const handleShowExportBackup = () => {
    onShowExportBackup(exportId);
    setShowMenu(false);
  };

  const handleShowExportRestore = () => {
    onShowExportRestore(exportId);
    setShowMenu(false);
  };

  const handleShowExportExport = () => {
    onShowExportExport(exportId);
    setShowMenu(false);
  };

  const handleShowExportImport = () => {
    onShowExportImport(exportId);
    setShowMenu(false);
  };

  const handleShowExportClone = () => {
    onShowExportClone(exportId);
    setShowMenu(false);
  };

  const handleShowExportDelete = () => {
    onShowExportDelete(exportId);
    setShowMenu(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getNotificationText = () => {
    if (percentComplete > 0) {
      return `(${percentComplete}%) Exporting table '${exportName}'`;
    } else if (countExported !== null) {
      return `(${countExported} rows) Exporting query '${exportName}'`;
    } else {
      return `Exporting '${exportName}'`;
    }
  };

  const getProgressBarWidth = () => {
    return Math.min(100, Math.max(0, percentComplete));
  };

  const getStatusIcon = () => {
    if (isCancelling) {
      return 'hourglass_empty';
    } else if (percentComplete === 100) {
      return 'check_circle';
    } else if (percentComplete > 0) {
      return 'sync';
    } else {
      return 'play_arrow';
    }
  };

  const getStatusColor = () => {
    if (isCancelling) {
      return 'warning';
    } else if (percentComplete === 100) {
      return 'success';
    } else if (percentComplete > 0) {
      return 'info';
    } else {
      return 'primary';
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      ref={notificationRef}
      className={`export-notification ${getStatusColor()} ${className}`}
    >
      <div className="notification-content">
        <div className="notification-header">
          <div className="notification-icon">
            <i className="material-icons">{getStatusIcon()}</i>
          </div>
          
          <div className="notification-text">
            <div className="notification-title">
              {getNotificationText()}
            </div>
            
            {exportName && (
              <div className="notification-subtitle">
                Export ID: {exportId}
              </div>
            )}
          </div>

          <div className="notification-actions">
            <button
              className="btn btn-flat btn-icon"
              onClick={handleMenuToggle}
              title="Export Actions"
            >
              <i className="material-icons">more_vert</i>
            </button>

            {showMenu && (
              <div className="export-menu" ref={menuRef}>
                <div className="menu-item" onClick={handleShowExportDetails}>
                  <i className="material-icons">info</i>
                  <span>Export Details</span>
                </div>

                <div className="menu-item" onClick={handleShowExportLogs}>
                  <i className="material-icons">description</i>
                  <span>Export Logs</span>
                </div>

                <div className="menu-item" onClick={handleShowExportSettings}>
                  <i className="material-icons">settings</i>
                  <span>Export Settings</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item" onClick={handleShowExportBackup}>
                  <i className="material-icons">backup</i>
                  <span>Backup Export</span>
                </div>

                <div className="menu-item" onClick={handleShowExportRestore}>
                  <i className="material-icons">restore</i>
                  <span>Restore Export</span>
                </div>

                <div className="menu-item" onClick={handleShowExportExport}>
                  <i className="material-icons">export</i>
                  <span>Export Export</span>
                </div>

                <div className="menu-item" onClick={handleShowExportImport}>
                  <i className="material-icons">import</i>
                  <span>Import Export</span>
                </div>

                <div className="menu-item" onClick={handleShowExportClone}>
                  <i className="material-icons">content_copy</i>
                  <span>Clone Export</span>
                </div>

                <div className="menu-divider" />

                <div className="menu-item danger" onClick={handleShowExportDelete}>
                  <i className="material-icons">delete</i>
                  <span>Delete Export</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-flat btn-icon"
              onClick={handleHideNotification}
              title="Hide Notification"
            >
              <i className="material-icons">close</i>
            </button>
          </div>
        </div>

        {percentComplete > 0 && (
          <div className="notification-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${getProgressBarWidth()}%` }}
              />
            </div>
            <div className="progress-text">
              {percentComplete}% Complete
            </div>
          </div>
        )}

        <div className="notification-footer">
          <div className="notification-buttons">
            <button
              className="btn btn-flat"
              onClick={handleCancelExport}
              disabled={isCancelling || percentComplete === 100}
            >
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </button>
            
            <button
              className="btn btn-primary"
              onClick={handleHideNotification}
            >
              Hide
            </button>
          </div>

          <div className="notification-info">
            {activeConnection && (
              <span className="connection-info">
                <i className="material-icons">link</i>
                {activeConnection.name}
              </span>
            )}
            
            {exportName && (
              <span className="export-info">
                <i className="material-icons">file_download</i>
                {exportName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportNotification;
