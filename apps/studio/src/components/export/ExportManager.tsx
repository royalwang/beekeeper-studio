import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ExportModal from './ExportModal';
import ExportNotification from './ExportNotification';

interface ExportTriggerOptions {
  table?: any;
  query?: string;
  queryName?: string;
  filters?: any[];
}

interface ExportManagerProps {
  onExportStart: (options: ExportTriggerOptions) => Promise<void>;
  onExportCancel: (exportId: string) => Promise<void>;
  onExportComplete: (exportId: string) => void;
  onExportError: (exportId: string, error: string) => void;
  onExportProgress: (exportId: string, progress: number) => void;
  onExportDetails: (exportId: string) => void;
  onExportLogs: (exportId: string) => void;
  onExportSettings: (exportId: string) => void;
  onExportBackup: (exportId: string) => void;
  onExportRestore: (exportId: string) => void;
  onExportExport: (exportId: string) => void;
  onExportImport: (exportId: string) => void;
  onExportClone: (exportId: string) => void;
  onExportDelete: (exportId: string) => void;
  className?: string;
}

const ExportManager: React.FC<ExportManagerProps> = ({
  onExportStart,
  onExportCancel,
  onExportComplete,
  onExportError,
  onExportProgress,
  onExportDetails,
  onExportLogs,
  onExportSettings,
  onExportBackup,
  onExportRestore,
  onExportExport,
  onExportImport,
  onExportClone,
  onExportDelete,
  className = '',
}) => {
  const [pendingExport, setPendingExport] = useState<ExportTriggerOptions | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const exports = useSelector((state: RootState) => state.export.exports || []);
  const activeConnection = useSelector((state: RootState) => state.connections.activeConnection);

  useEffect(() => {
    if (pendingExport) {
      setShowExportModal(true);
    } else {
      setShowExportModal(false);
    }
  }, [pendingExport]);

  const handleExportStart = async (options: ExportTriggerOptions) => {
    try {
      await onExportStart(options);
      setPendingExport(null);
      setShowExportModal(false);
    } catch (error) {
      console.error('Failed to start export:', error);
    }
  };

  const handleExportCancel = async (exportId: string) => {
    try {
      await onExportCancel(exportId);
    } catch (error) {
      console.error('Failed to cancel export:', error);
    }
  };

  const handleExportComplete = (exportId: string) => {
    onExportComplete(exportId);
  };

  const handleExportError = (exportId: string, error: string) => {
    onExportError(exportId, error);
  };

  const handleExportProgress = (exportId: string, progress: number) => {
    onExportProgress(exportId, progress);
  };

  const handleExportDetails = (exportId: string) => {
    onExportDetails(exportId);
  };

  const handleExportLogs = (exportId: string) => {
    onExportLogs(exportId);
  };

  const handleExportSettings = (exportId: string) => {
    onExportSettings(exportId);
  };

  const handleExportBackup = (exportId: string) => {
    onExportBackup(exportId);
  };

  const handleExportRestore = (exportId: string) => {
    onExportRestore(exportId);
  };

  const handleExportExport = (exportId: string) => {
    onExportExport(exportId);
  };

  const handleExportImport = (exportId: string) => {
    onExportImport(exportId);
  };

  const handleExportClone = (exportId: string) => {
    onExportClone(exportId);
  };

  const handleExportDelete = (exportId: string) => {
    onExportDelete(exportId);
  };

  const handleDeadModal = () => {
    setPendingExport(null);
    setShowExportModal(false);
  };

  const handleHideNotification = () => {
    // Handle notification hiding if needed
  };

  const triggerExport = (options: ExportTriggerOptions) => {
    setPendingExport(options);
  };

  const getActiveExports = () => {
    return exports.filter(exp => exp.status === 'running' || exp.status === 'pending');
  };

  const getCompletedExports = () => {
    return exports.filter(exp => exp.status === 'completed' || exp.status === 'failed');
  };

  const getExportStats = () => {
    const active = getActiveExports().length;
    const completed = getCompletedExports().length;
    const total = exports.length;
    
    return { active, completed, total };
  };

  const stats = getExportStats();

  return (
    <div className={`export-manager ${className}`}>
      {showExportModal && pendingExport && (
        <ExportModal
          table={pendingExport.table}
          query={pendingExport.query}
          queryName={pendingExport.queryName}
          filters={pendingExport.filters}
          onExport={handleExportStart}
          onClosed={handleDeadModal}
        />
      )}

      {getActiveExports().map((exportItem) => (
        <ExportNotification
          key={exportItem.id}
          exporter={exportItem}
          exportId={exportItem.id}
          onCancelExport={handleExportCancel}
          onHideNotification={handleHideNotification}
          onShowExportDetails={handleExportDetails}
          onShowExportLogs={handleExportLogs}
          onShowExportSettings={handleExportSettings}
          onShowExportBackup={handleExportBackup}
          onShowExportRestore={handleExportRestore}
          onShowExportExport={handleExportExport}
          onShowExportImport={handleExportImport}
          onShowExportClone={handleExportClone}
          onShowExportDelete={handleExportDelete}
        />
      ))}

      {exports.length > 0 && (
        <div className="export-stats">
          <div className="stats-header">
            <h3>Export Statistics</h3>
            <div className="stats-summary">
              <span className="stat-item">
                <i className="material-icons">sync</i>
                Active: {stats.active}
              </span>
              <span className="stat-item">
                <i className="material-icons">check_circle</i>
                Completed: {stats.completed}
              </span>
              <span className="stat-item">
                <i className="material-icons">list</i>
                Total: {stats.total}
              </span>
            </div>
          </div>

          <div className="export-list">
            {exports.map((exportItem) => (
              <div key={exportItem.id} className="export-item">
                <div className="export-info">
                  <div className="export-name">
                    <i className="material-icons">
                      {exportItem.status === 'completed' ? 'check_circle' :
                       exportItem.status === 'failed' ? 'error' :
                       exportItem.status === 'running' ? 'sync' : 'hourglass_empty'}
                    </i>
                    {exportItem.name || 'Unnamed Export'}
                  </div>
                  <div className="export-details">
                    <span className="export-status">{exportItem.status}</span>
                    <span className="export-date">
                      {new Date(exportItem.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="export-actions">
                  <button
                    className="btn btn-flat btn-icon"
                    onClick={() => handleExportDetails(exportItem.id)}
                    title="View Details"
                  >
                    <i className="material-icons">info</i>
                  </button>

                  {exportItem.status === 'running' && (
                    <button
                      className="btn btn-flat btn-icon"
                      onClick={() => handleExportCancel(exportItem.id)}
                      title="Cancel Export"
                    >
                      <i className="material-icons">cancel</i>
                    </button>
                  )}

                  <button
                    className="btn btn-flat btn-icon"
                    onClick={() => handleExportDelete(exportItem.id)}
                    title="Delete Export"
                  >
                    <i className="material-icons">delete</i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {exports.length === 0 && (
        <div className="no-exports">
          <div className="alert alert-info">
            <i className="material-icons">info</i>
            <div>
              <strong>No exports</strong>
              <p>Start an export to see it here.</p>
            </div>
          </div>
        </div>
      )}

      {activeConnection && (
        <div className="connection-info">
          <div className="connection-status">
            <i className="material-icons">link</i>
            <span>Connected to: {activeConnection.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportManager;