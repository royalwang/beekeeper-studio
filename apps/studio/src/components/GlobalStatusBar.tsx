import React from 'react';

interface GlobalStatusBarProps {
  connectionButtonWidth: number;
  connectionButtonIconWidth: number;
}

const GlobalStatusBar: React.FC<GlobalStatusBarProps> = ({ 
  connectionButtonWidth, 
  connectionButtonIconWidth 
}) => {
  return (
    <div className="global-status-bar">
      {/* Global status bar content will be implemented here */}
      <div className="status-content">
        <span>Ready</span>
      </div>
    </div>
  );
};

export default GlobalStatusBar;
