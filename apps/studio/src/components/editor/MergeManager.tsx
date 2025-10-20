import React, { useState } from 'react';

interface MergeManagerProps {
  originalText: string;
  query: any;
  unsavedText: string;
  onChange: (text: string) => void;
  onMergeAccepted: () => void;
}

const MergeManager: React.FC<MergeManagerProps> = ({
  originalText,
  query,
  unsavedText,
  onChange,
  onMergeAccepted,
}) => {
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedText, setSelectedText] = useState('');

  const hasChanges = unsavedText !== originalText;
  const hasRemoteChanges = query.text !== originalText;

  const handleAcceptRemote = () => {
    onChange(query.text);
    onMergeAccepted();
    setShowMergeDialog(false);
  };

  const handleKeepLocal = () => {
    onMergeAccepted();
    setShowMergeDialog(false);
  };

  const handleMerge = () => {
    // Simple merge - in real implementation, this would be more sophisticated
    const mergedText = `${query.text}\n\n-- Local changes:\n${unsavedText}`;
    onChange(mergedText);
    onMergeAccepted();
    setShowMergeDialog(false);
  };

  if (!hasChanges && !hasRemoteChanges) {
    return null;
  }

  return (
    <div className="merge-manager">
      {hasRemoteChanges && (
        <div className="merge-notification">
          <div className="alert alert-warning">
            <i className="material-icons">sync_problem</i>
            <div className="alert-body">
              <strong>Remote changes detected!</strong>
              <p>This query has been modified by someone else.</p>
            </div>
            <div className="alert-actions">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setShowMergeDialog(true)}
              >
                Review Changes
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleAcceptRemote}
              >
                Accept Remote
              </button>
            </div>
          </div>
        </div>
      )}

      {showMergeDialog && (
        <div className="merge-dialog-overlay">
          <div className="merge-dialog">
            <div className="dialog-header">
              <h3>Merge Conflicts</h3>
              <button
                className="close-btn"
                onClick={() => setShowMergeDialog(false)}
              >
                <i className="material-icons">close</i>
              </button>
            </div>
            
            <div className="dialog-content">
              <div className="merge-comparison">
                <div className="version-panel">
                  <h4>Remote Version</h4>
                  <pre className="code-preview">{query.text}</pre>
                </div>
                
                <div className="version-panel">
                  <h4>Local Version</h4>
                  <pre className="code-preview">{unsavedText}</pre>
                </div>
              </div>
            </div>
            
            <div className="dialog-actions">
              <button
                className="btn btn-secondary"
                onClick={handleKeepLocal}
              >
                Keep Local
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleAcceptRemote}
              >
                Accept Remote
              </button>
              <button
                className="btn btn-primary"
                onClick={handleMerge}
              >
                Merge Both
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergeManager;
