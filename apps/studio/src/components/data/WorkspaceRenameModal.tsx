import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import ErrorAlert from '../common/ErrorAlert';
import { AppEvent } from '../../common/AppEvent';

interface Workspace {
  id: string;
  name: string;
}

interface Client {
  options: {
    email: string;
  };
}

interface WorkspaceRenameModalProps {
  isVisible?: boolean;
  onClose?: () => void;
}

const WorkspaceRenameModal: React.FC<WorkspaceRenameModalProps> = ({
  isVisible = false,
  onClose
}) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [account, setAccount] = useState('');
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

  const handleOpen = useCallback((data: { workspace: Workspace; client: Client }) => {
    setWorkspace(data.workspace);
    setWorkspaceName(data.workspace.name);
    setClient(data.client);
    setAccount(data.client.options.email);
    setError(null);
  }, []);

  const handleClose = useCallback(() => {
    setWorkspace(null);
    setWorkspaceName('');
    setClient(null);
    setAccount('');
    setError(null);
    onClose?.();
  }, [onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workspace || !client) return;

    setLoading(true);
    setError(null);

    try {
      await dispatch({
        type: 'credentials/renameWorkspace',
        payload: {
          client,
          workspace,
          name: workspaceName,
        }
      });
      handleClose();
    } catch (ex) {
      setError('Failed to rename workspace');
    } finally {
      setLoading(false);
    }
  }, [workspace, client, workspaceName, dispatch, handleClose]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceName(e.target.value);
  }, []);

  useEffect(() => {
    const handlePromptRenameWorkspace = (event: CustomEvent) => {
      handleOpen(event.detail);
    };

    window.addEventListener(AppEvent.promptRenameWorkspace, handlePromptRenameWorkspace as EventListener);

    return () => {
      window.removeEventListener(AppEvent.promptRenameWorkspace, handlePromptRenameWorkspace as EventListener);
    };
  }, [handleOpen]);

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
            Rename Workspace
          </div>
          {error && <ErrorAlert error={error} />}
          <div className="form-group">
            <label htmlFor="account">Account</label>
            <input 
              name="account" 
              id="account" 
              value={account} 
              disabled 
            />
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
              disabled={loading} 
              type="submit"
            >
              {loading ? "..." : "Rename Workspace"}
            </button>
          </span>
        </div>
      </form>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default WorkspaceRenameModal;
