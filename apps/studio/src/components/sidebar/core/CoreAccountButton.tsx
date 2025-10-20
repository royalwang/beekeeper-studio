import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import StatusBadge from '../connection/StatusBadge';

interface CoreAccountButtonProps {
  onManageWorkspace: () => void;
  onInviteUsers: () => void;
  onReAuthenticate: () => void;
  onShowAccountSettings: () => void;
  onShowAccountInfo: () => void;
  onShowAccountLogs: () => void;
  onShowAccountBackup: () => void;
  onShowAccountRestore: () => void;
  onShowAccountExport: () => void;
  onShowAccountImport: () => void;
  onShowAccountClone: () => void;
  onShowAccountDelete: () => void;
  className?: string;
}

const CoreAccountButton: React.FC<CoreAccountButtonProps> = ({
  onManageWorkspace,
  onInviteUsers,
  onReAuthenticate,
  onShowAccountSettings,
  onShowAccountInfo,
  onShowAccountLogs,
  onShowAccountBackup,
  onShowAccountRestore,
  onShowAccountExport,
  onShowAccountImport,
  onShowAccountClone,
  onShowAccountDelete,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const workspace = useSelector((state: RootState) => state.workspace.currentWorkspace);
  const pollError = useSelector((state: RootState) => state.workspace.pollError);
  const user = useSelector((state: RootState) => state.auth.user);

  const title = workspace?.name || user?.name || 'Account';
  const isOwner = workspace?.level === 'team' && workspace?.isOwner;

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

  const handleManageWorkspace = () => {
    onManageWorkspace();
    setShowMenu(false);
  };

  const handleInviteUsers = () => {
    onInviteUsers();
    setShowMenu(false);
  };

  const handleReAuthenticate = () => {
    onReAuthenticate();
    setShowMenu(false);
  };

  const handleShowAccountSettings = () => {
    onShowAccountSettings();
    setShowMenu(false);
  };

  const handleShowAccountInfo = () => {
    onShowAccountInfo();
    setShowMenu(false);
  };

  const handleShowAccountLogs = () => {
    onShowAccountLogs();
    setShowMenu(false);
  };

  const handleShowAccountBackup = () => {
    onShowAccountBackup();
    setShowMenu(false);
  };

  const handleShowAccountRestore = () => {
    onShowAccountRestore();
    setShowMenu(false);
  };

  const handleShowAccountExport = () => {
    onShowAccountExport();
    setShowMenu(false);
  };

  const handleShowAccountImport = () => {
    onShowAccountImport();
    setShowMenu(false);
  };

  const handleShowAccountClone = () => {
    onShowAccountClone();
    setShowMenu(false);
  };

  const handleShowAccountDelete = () => {
    onShowAccountDelete();
    setShowMenu(false);
  };

  return (
    <div className={`core-account-button ${className}`}>
      <div className="nav-item account">
        <button
          className="account-button"
          onClick={handleMenuToggle}
          title={title}
          type="button"
        >
          <span className="avatar">
            <i className="material-icons-outlined">account_circle</i>
            <StatusBadge
              errors={pollError ? [pollError] : []}
              display={true}
            />
          </span>
        </button>

        {showMenu && (
          <div className="account-menu" ref={menuRef}>
            <div className="menu-header">
              <div className="menu-title">{title}</div>
              <div className="menu-subtitle">
                {workspace?.level === 'team' ? 'Team Workspace' : 'Personal Workspace'}
              </div>
            </div>

            <div className="menu-divider" />

            <div className="menu-item disabled">
              <i className="material-icons">person</i>
              <span>{title}</span>
            </div>

            <div className="menu-item" onClick={handleManageWorkspace}>
              <i className="material-icons">settings</i>
              <span>Manage Workspace</span>
            </div>

            {isOwner && (
              <div className="menu-item" onClick={handleInviteUsers}>
                <i className="material-icons">person_add</i>
                <span>Add Users</span>
              </div>
            )}

            {pollError && (
              <div className="menu-item" onClick={handleReAuthenticate}>
                <i className="material-icons">login</i>
                <span>Log In Again</span>
              </div>
            )}

            <div className="menu-divider" />

            <div className="menu-item" onClick={handleShowAccountSettings}>
              <i className="material-icons">settings</i>
              <span>Account Settings</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountInfo}>
              <i className="material-icons">info</i>
              <span>Account Info</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountLogs}>
              <i className="material-icons">description</i>
              <span>Account Logs</span>
            </div>

            <div className="menu-divider" />

            <div className="menu-item" onClick={handleShowAccountBackup}>
              <i className="material-icons">backup</i>
              <span>Backup Account</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountRestore}>
              <i className="material-icons">restore</i>
              <span>Restore Account</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountExport}>
              <i className="material-icons">export</i>
              <span>Export Account</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountImport}>
              <i className="material-icons">import</i>
              <span>Import Account</span>
            </div>

            <div className="menu-item" onClick={handleShowAccountClone}>
              <i className="material-icons">content_copy</i>
              <span>Clone Account</span>
            </div>

            <div className="menu-divider" />

            <div className="menu-item danger" onClick={handleShowAccountDelete}>
              <i className="material-icons">delete</i>
              <span>Delete Account</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreAccountButton;
