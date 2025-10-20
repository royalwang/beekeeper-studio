import React, { useState, useRef, useEffect } from 'react';
import ColorPicker from '../common/form/ColorPicker';

interface SaveConnectionFormProps {
  config: any;
  onConfigChange: (config: any) => void;
  onSave: () => void;
  onCancel?: () => void;
  canCancel?: boolean;
  isSaving?: boolean;
  className?: string;
}

const SaveConnectionForm: React.FC<SaveConnectionFormProps> = ({
  config,
  onConfigChange,
  onSave,
  onCancel,
  canCancel = true,
  isSaving = false,
  className = '',
}) => {
  const [connectionName, setConnectionName] = useState(config.name || '');
  const [rememberPassword, setRememberPassword] = useState(config.rememberPassword || false);
  const [labelColor, setLabelColor] = useState(config.labelColor || 'default');

  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const newConfig = {
      ...config,
      name: connectionName,
      rememberPassword,
      labelColor,
    };
    onConfigChange(newConfig);
  }, [connectionName, rememberPassword, labelColor]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (connectionName.trim()) {
      onSave();
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleSave(e);
    }
  };

  return (
    <div className={`save-connection expand ${className}`}>
      <h3 className="dialog-c-title">Save Connection</h3>
      
      <div className="form-group">
        <input
          ref={nameInputRef}
          className="form-control"
          type="text"
          value={connectionName}
          onChange={(e) => setConnectionName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Connection Name"
          disabled={isSaving}
        />
      </div>

      <div className="row flex-middle">
        <label className="checkbox-group" htmlFor="rememberPassword">
          <input
            className="form-control"
            id="rememberPassword"
            type="checkbox"
            name="rememberPassword"
            checked={rememberPassword}
            onChange={(e) => setRememberPassword(e.target.checked)}
            disabled={isSaving}
          />
          <span>Save Passwords</span>
          <i
            className="material-icons"
            title="Passwords are encrypted when saved"
          >
            help_outlined
          </i>
        </label>
        <span className="expand" />
        <ColorPicker
          value={labelColor}
          onChange={setLabelColor}
          name="labelColor"
        />
      </div>

      <div className="save-actions">
        {canCancel && (
          <button
            className="btn btn-flat"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!connectionName.trim() || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Connection'}
        </button>
      </div>

      <div className="connection-info">
        <div className="info-item">
          <strong>Connection Type:</strong> {config.connectionType || 'Unknown'}
        </div>
        {config.host && (
          <div className="info-item">
            <strong>Host:</strong> {config.host}
          </div>
        )}
        {config.port && (
          <div className="info-item">
            <strong>Port:</strong> {config.port}
          </div>
        )}
        {config.defaultDatabase && (
          <div className="info-item">
            <strong>Database:</strong> {config.defaultDatabase}
          </div>
        )}
        {config.username && (
          <div className="info-item">
            <strong>Username:</strong> {config.username}
          </div>
        )}
      </div>

      <div className="security-notice">
        <div className="alert alert-info">
          <i className="material-icons">info</i>
          <div>
            <strong>Security Notice:</strong> Connection details are stored locally and encrypted. 
            {rememberPassword ? ' Passwords will be saved and encrypted.' : ' Passwords will not be saved.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveConnectionForm;
