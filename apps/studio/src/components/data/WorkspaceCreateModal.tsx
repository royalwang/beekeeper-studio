import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import ErrorAlert from '../common/ErrorAlert';
import { AppEvent } from '../../common/AppEvent';

interface Credential {
  id: string;
  credential: {
    email: string;
  };
}

interface WorkspaceCreateModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const WorkspaceCreateModal: React.FC<WorkspaceCreateModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [selectedBlobId, setSelectedBlobId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const credentials = useSelector((state: any) => state.credentials?.credentials || []);

  const handleFocus = useCallback(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleClose = useCallback(() => {
    setWorkspaceName('');
    setSelectedBlobId('');
    setError(null);
    onClose?.();
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspaceName.trim() || !selectedBlobId) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch({
        type: 'credentials/createWorkspace',
        payload: {
          blobId: selectedBlobId,
          name: workspaceName,
        }
      });
      handleClose();
    } catch (ex) {
      setError('Failed to create workspace');
    } finally {
      setLoading(false);
    }
  }, [workspaceName, selectedBlobId, dispatch, handleClose]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  }, []);

  const handleBlobIdChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBlobId(e.target.value);
  }, []);

  useEffect(() => {
    if (credentials.length > 0 && !selectedBlobId) {
      setSelectedBlobId(credentials[0].id);
    }
  }, [credentials, selectedBlobId]);

  useEffect(() => {
    if (isVisible) {
      handleFocus();
    }
  }, [isVisible, handleFocus]);

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal create-workspace-modal">
      <form onSubmit={handleSubmit}>
        <div className="dialog-content">
          <div className="dialog-c-title">
            New Workspace
          </div>
          {error && <ErrorAlert error={error} />}
          <div className="form-group">
            <label htmlFor="account">Account</label>
            <select 
              name="account" 
              id="account" 
              value={selectedBlobId}
              onChange={handleBlobIdChange}
              disabled={credentials.length === 1}
            >
              {credentials.map((cred: Credential) => (
                <option key={cred.id} value={cred.id}>
                  {cred.credential.email}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="workspace-name">Workspace Name</label>
            <input 
              id="workspace-name" 
              name="workspace-name" 
              value={workspaceName}
              onChange={handleNameChange}
              type="text" 
              ref={nameInputRef}
              placeholder="e.g. Matthew's Workspace"
            />
          </div>
        </div>
        <div className="vue-dialog-buttons flex-between">
          <span className="left" />
          <span className="right">
            <button 
              className="btn btn-flat" 
              type="button" 
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              disabled={loading || !workspaceName.trim() || !selectedBlobId} 
              type="submit"
            >
              {loading ? "..." : "Create Workspace"}
            </button>
          </span>
        </div>
      </form>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default WorkspaceCreateModal;
