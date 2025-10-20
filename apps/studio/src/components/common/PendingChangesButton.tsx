import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useHotkeys } from 'react-hotkeys-hook';

interface PendingChangesButtonProps {
  onSubmitApply: () => void;
  onSubmitSql?: () => void;
  labelApply?: string;
  labelSql?: string;
  className?: string;
  disabled?: boolean;
}

const PendingChangesButton: React.FC<PendingChangesButtonProps> = ({
  onSubmitApply,
  onSubmitSql,
  labelApply = 'Apply',
  labelSql = 'Copy to SQL',
  className = '',
  disabled = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const dialect = useSelector((state: RootState) => state.connection?.dialect || '');

  // Hotkeys
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    if (!disabled) {
      onSubmitApply();
    }
  });

  useHotkeys('ctrl+shift+s', (e) => {
    e.preventDefault();
    if (!disabled && onSubmitSql) {
      onSubmitSql();
    }
  });

  const handleApply = () => {
    onSubmitApply();
    setShowMenu(false);
  };

  const handleSql = () => {
    onSubmitSql?.();
    setShowMenu(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  React.useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={`pending-changes-button ${className}`}>
      <div className="button-group">
        <button
          className="btn btn-primary"
          onClick={handleApply}
          disabled={disabled}
          style={{ margin: 0 }}
        >
          <span>{labelApply}</span>
        </button>

        {dialect !== 'mongodb' && (
          <div className="dropdown-menu" ref={menuRef}>
            <button
              ref={buttonRef}
              className="btn btn-primary dropdown-toggle"
              onClick={handleMenuToggle}
              disabled={disabled}
              style={{ margin: 0 }}
            >
              <i className="material-icons">arrow_drop_down</i>
            </button>

            {showMenu && (
              <div className="dropdown-content">
                <button
                  className="dropdown-item"
                  onClick={handleApply}
                  disabled={disabled}
                >
                  <span className="label">{labelApply}</span>
                  <span className="shortcut">Ctrl+S</span>
                </button>
                
                {onSubmitSql && (
                  <button
                    className="dropdown-item"
                    onClick={handleSql}
                    disabled={disabled}
                  >
                    <span className="label">{labelSql}</span>
                    <span className="shortcut">Ctrl+Shift+S</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingChangesButton;
