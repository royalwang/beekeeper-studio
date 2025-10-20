import React from 'react';

interface ErrorItem {
  message?: string;
  marker?: {
    line: number;
    ch: number;
  };
  toString?: () => string;
}

interface ErrorAlertProps {
  error?: ErrorItem | ErrorItem[] | string | null;
  title?: string;
  closable?: boolean;
  helpText?: string;
  helpLink?: string;
  onClose?: () => void;
  onErrorClick?: (error: ErrorItem) => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({
  error,
  title = "There was a problem",
  closable = false,
  helpText,
  helpLink,
  onClose,
  onErrorClick,
  className = '',
}) => {
  if (!error) {
    return null;
  }

  const normalizeErrors = (err: ErrorItem | ErrorItem[] | string): ErrorItem[] => {
    if (typeof err === 'string') {
      return [{ message: err }];
    }
    if (Array.isArray(err)) {
      return err;
    }
    return [err];
  };

  const errors = normalizeErrors(error);

  const handleErrorClick = (errorItem: ErrorItem) => {
    onErrorClick?.(errorItem);
    
    // Copy error message to clipboard
    const errorText = errorItem.message || errorItem.toString?.() || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText).catch(console.error);
    }
  };

  const getErrorMessage = (errorItem: ErrorItem): string => {
    const message = errorItem.message || errorItem.toString?.() || '';
    const marker = errorItem.marker ? ` - line ${errorItem.marker.line}, ch ${errorItem.marker.ch}` : '';
    const help = helpText ? ` - ${helpText}` : '';
    return `${message}${marker}${help}`;
  };

  return (
    <div className={`error-alert alert text-danger ${className}`}>
      {closable && (
        <button
          className="close-button"
          onClick={onClose}
          title="Close error"
        >
          <i className="material-icons">close</i>
        </button>
      )}
      
      <div className="alert-title">
        <i className="material-icons">error_outline</i>
        <b className="error-title">{title}</b>
      </div>
      
      <div className="alert-body">
        <ul className="error-list">
          {errors.map((errorItem, idx) => (
            <li
              key={idx}
              className="error-item"
              onClick={() => handleErrorClick(errorItem)}
              title="Click to copy"
            >
              {getErrorMessage(errorItem)}
            </li>
          ))}
        </ul>
        
        {helpLink && (
          <div className="help-links">
            <a
              href={helpLink}
              target="_blank"
              rel="noopener noreferrer"
              title="More information about this error"
            >
              Learn more about this error
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorAlert;
