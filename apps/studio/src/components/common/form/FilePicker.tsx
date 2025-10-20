import React from 'react';

interface FilePickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: any;
  buttonText?: string;
  actions?: React.ReactNode[];
}

const FilePicker: React.FC<FilePickerProps> = ({ 
  value, 
  onChange, 
  options, 
  buttonText = 'Choose File',
  actions = []
}) => {
  const handleFileSelect = () => {
    // File picker logic will be implemented here
    // For now, just a placeholder
    console.log('File picker clicked');
  };

  return (
    <div className="file-picker">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={value || ''}
          readOnly
          placeholder="No file selected"
        />
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleFileSelect}
          >
            {buttonText}
          </button>
        </div>
        {actions}
      </div>
    </div>
  );
};

export default FilePicker;
