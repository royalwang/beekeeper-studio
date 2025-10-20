import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';

interface CredentialBlob {
  id: string;
  credential: { email: string };
  error?: { message: string } | null;
}

interface AccountStatusButtonProps {
  onRefresh?: () => void;
  onReauth?: (blob: CredentialBlob) => void;
  onLogout?: (blob: CredentialBlob) => void;
}

const StatusBadge: React.FC<{ errors: any[]; display: boolean }> = ({ errors, display }) => {
  if (!display) return null;
  const hasError = errors.length > 0;
  return (
    <span className={`status-badge ${hasError ? 'error' : 'ok'}`} />
  );
};

const AccountStatusButton: React.FC<AccountStatusButtonProps> = ({ onRefresh, onReauth, onLogout }) => {
  const dispatch = useDispatch();
  const credentials: CredentialBlob[] = useSelector((s: RootState) => (s.credentials?.credentials as any) || []);
  const [open, setOpen] = useState(false);

  const title = useMemo(() => 'Account Status', []);

  const workspaceText = (blob: CredentialBlob) => {
    return 'Connected';
  };

  const refresh = () => {
    onRefresh?.();
  };

  const login = () => {
    // open add account flow
    // @ts-ignore placeholder
    dispatch({ type: 'credentials/login' });
  };

  const reauth = (blob: CredentialBlob) => {
    onReauth?.(blob);
  };

  const logout = (blob: CredentialBlob) => {
    onLogout?.(blob);
  };

  return (
    <div className="account-status-button">
      <a className="nav-item account" title={title} onClick={(e) => { e.preventDefault(); setOpen(true); }} href="#">
        <span className="avatar">
          <i className="material-icons-outlined">account_circle</i>
          <StatusBadge errors={credentials.map(c => c.error).filter(e => !!e)} display={!!credentials.length} />
        </span>
      </a>

      {open && (
        <div className="beekeeper-dialog vue-dialog account-status-modal">
          <div className="dialog-content">
            <div className="dialog-c-title">Connected Accounts</div>
            <div className="list-group">
              <div className="list-body">
                {credentials.map((blob) => (
                  <div key={blob.id} className="list-item account">
                    <a className="list-item-btn">
                      <div className="content expand">
                        <div className="title">{blob.credential.email}</div>
                        <div className="subtitle">
                          {blob.error ? (
                            <span className="text-danger">{blob.error.message}</span>
                          ) : (
                            <span>{workspaceText(blob)}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <button className="actions-btn btn btn-link btn-fab" title="actions">
                          <i className="material-icons">more_horiz</i>
                        </button>
                        <div className="menu-inline">
                          <div><a href="https://app.beekeeperstudio.io">Account Dashboard</a></div>
                          <div><a href="#" onClick={(e) => { e.preventDefault(); refresh(); }}>Refresh</a></div>
                          <div><a href="#" onClick={(e) => { e.preventDefault(); reauth(blob); }}>Re-authenticate</a></div>
                          <div><a href="#" onClick={(e) => { e.preventDefault(); logout(blob); }}>Log out</a></div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="vue-dialog-buttons">
            <button className="btn btn-flat" type="button" onClick={() => setOpen(false)}>Close</button>
            <button className="btn btn-primary" type="button" onClick={login}>Add Account</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatusButton;
