import React from 'react';
import ConnectionButton from './sidebar/core/ConnectionButton';

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
      <div
        className="connection-button-wrapper"
        style={{
          '--connection-button-icon-width': `${connectionButtonIconWidth}px`,
          width: `${connectionButtonWidth}px`,
        } as React.CSSProperties}
      >
        <ConnectionButton />
      </div>
      <div id="global-status-bar" />
    </div>
  );
};

export default GlobalStatusBar;
