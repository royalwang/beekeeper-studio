import React, { useCallback } from 'react';

interface FilePickerProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options?: any;
  buttonText?: string;
  defaultPath?: string;
  showHiddenFiles?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  save?: boolean;
  inputId?: string;
  editable?: boolean;
  showCreateButton?: boolean;
  actions?: React.ReactNode[];
}

const FilePicker: React.FC<FilePickerProps> = ({ 
  value, 
  onChange, 
  options = {},
  buttonText = 'Choose File',
  defaultPath = '',
  showHiddenFiles = false,
  multiple = false,
  disabled = false,
  save = false,
  inputId = 'file-picker',
  editable = false,
  showCreateButton = false,
  actions = []
}) => {
  const getInputValue = useCallback(() => {
    if (Array.isArray(value)) {
      if (value.length > 1) {
        return `${value[0]} (${value.length} files)`;
      }
      return value[0] || '';
    }
    return value || '';
  }, [value]);

  const openFilePickerDialog = useCallback(async (dialogOptions: any = {}) => {
    if (disabled) {
      return;
    }

    const dialogConfig = {
      properties: ['openFile'] as string[]
    };

    if (defaultPath.length > 0) {
      dialogConfig.defaultPath = defaultPath;
    }

    if (showHiddenFiles) {
      dialogConfig.properties.push('showHiddenFiles');
    }

    if (multiple) {
      dialogConfig.properties.push('multiSelections');
    }

    try {
      // Mock implementation - in a real app, this would use Electron's dialog API
      // For now, we'll simulate the file picker behavior
      console.log('Opening file picker with config:', dialogConfig);
      
      // Simulate file selection
      const mockFiles = save 
        ? ['/path/to/save/file.txt']
        : multiple 
          ? ['/path/to/file1.txt', '/path/to/file2.txt']
          : ['/path/to/selected/file.txt'];
      
      if (multiple) {
        onChange(mockFiles);
      } else {
        onChange(mockFiles[0]);
      }
    } catch (error) {
      console.error('File picker error:', error);
    }
  }, [disabled, defaultPath, showHiddenFiles, multiple, save, onChange]);

  const handleInputClick = useCallback((e: React.MouseEvent) => {
    if (!editable) {
      e.preventDefault();
      e.stopPropagation();
      openFilePickerDialog();
    }
  }, [editable, openFilePickerDialog]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (editable) {
      onChange(e.target.value);
    }
  }, [editable, onChange]);

  const handleCreateClick = useCallback(() => {
    openFilePickerDialog({ save: true });
  }, [openFilePickerDialog]);

  const hasOtherActions = actions.length > 0;

  return (
    <div className="input-group">
      <input
        id={inputId}
        type="text"
        className={`form-control clickable ${editable ? '' : 'readonly'}`}
        placeholder="No file selected"
        title={getInputValue()}
        value={getInputValue()}
        disabled={disabled}
        readOnly={!editable}
        onClick={handleInputClick}
        onChange={handleInputChange}
      />
      <div 
        className={`input-group-append ${hasOtherActions || showCreateButton ? 'not-last' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openFilePickerDialog();
        }}
      >
        <button
          type="button"
          className={`btn btn-flat ${disabled ? 'disabled' : ''}`}
          disabled={disabled}
        >
          {buttonText}
        </button>
      </div>
      {showCreateButton && (
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-flat"
            onClick={handleCreateClick}
          >
            Create
          </button>
        </div>
      )}
      {actions}
    </div>
  );
};

export default FilePicker;
