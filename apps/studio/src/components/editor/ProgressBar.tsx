import React from 'react';

const ProgressBar: React.FC = () => {
  return (
    <div className="progress-bar">
      {/* Progress bar content will be implemented here */}
      <div className="progress-content">
        <div className="progress-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default ProgressBar;
