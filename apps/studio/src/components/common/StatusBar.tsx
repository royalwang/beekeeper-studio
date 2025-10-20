import React from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface StatusBarProps {
  mode?: string;
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
  mode,
  active = true,
  children,
  className = '',
}) => {
  const connectionColor = useSelector((state: RootState) => state.global.connectionColor);

  const getClasses = (): string => {
    const classes = ['statusbar'];
    
    if (mode) {
      classes.push(mode);
      classes.push(connectionColor);
    } else {
      classes.push(connectionColor);
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  if (!active) {
    return null;
  }

  const statusBarElement = (
    <footer className={getClasses()}>
      {children}
    </footer>
  );

  // Render to portal
  const portalTarget = document.getElementById('global-status-bar') || document.body;
  return createPortal(statusBarElement, portalTarget);
};

export default StatusBar;
