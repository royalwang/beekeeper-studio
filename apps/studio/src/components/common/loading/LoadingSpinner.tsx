import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 15, 
  className = '',
  color = '#007bff'
}) => {
  const spinnerStyle: React.CSSProperties = {
    '--size': `${size}px`,
    '--color': color,
  } as React.CSSProperties;

  return (
    <div
      className={`spinner ${className}`}
      style={spinnerStyle}
    >
      <div />
      <div />
      <div />
    </div>
  );
};

export default LoadingSpinner;
