import React from 'react';

interface ProgressBarProps {
  message?: string;
  canCancel?: boolean;
  onCancel?: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  message = 'loading...',
  canCancel = true,
  onCancel
}) => {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="progress-bar">
      <div className="flex-col layout-center">
        <span>{message}</span>
        {canCancel && (
          <a
            onClick={handleCancel}
            title="Cancel Query Execution (Esc)"
            className="cancel-query btn btn-flat"
          >
            Cancel
          </a>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;
