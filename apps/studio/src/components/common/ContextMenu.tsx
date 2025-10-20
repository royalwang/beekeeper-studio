import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ContextOption {
  name: string;
  action: (item: any, event: React.MouseEvent) => void;
  class?: string | ((item: any) => string);
  icon?: string;
  shortcut?: string;
  type?: 'divider' | 'item';
  ultimate?: boolean;
  disabled?: boolean;
}

interface ContextMenuProps {
  id: string;
  options: ContextOption[];
  event?: React.MouseEvent;
  item?: any;
  onClose?: () => void;
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  id,
  options,
  event,
  item,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLUListElement>(null);
  
  const isCommunity = useSelector((state: RootState) => state.settings.isCommunity);

  useEffect(() => {
    if (event) {
      const { clientX, clientY } = event;
      setPosition({ x: clientX, y: clientY });
      setIsVisible(true);
    }
  }, [event]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      
      // Adjust position if menu goes off screen
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let newX = position.x;
        let newY = position.y;
        
        if (position.x + rect.width > viewportWidth) {
          newX = viewportWidth - rect.width - 10;
        }
        
        if (position.y + rect.height > viewportHeight) {
          newY = viewportHeight - rect.height - 10;
        }
        
        if (newX !== position.x || newY !== position.y) {
          setPosition({ x: newX, y: newY });
        }
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isVisible, position]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const optionClicked = (option: ContextOption, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (option.disabled) {
      return;
    }
    
    if (option.ultimate && isCommunity) {
      // Show upgrade modal or message
      console.log('This feature requires Ultimate license');
      return;
    }
    
    option.action(item, event);
    handleClose();
  };

  const getOptionClass = (option: ContextOption): string => {
    if (option.type === 'divider') {
      return 'vue-simple-context-menu__divider';
    }
    
    let className = 'vue-simple-context-menu__item';
    
    if (typeof option.class === 'function') {
      className += ` ${option.class(item)}`;
    } else if (typeof option.class === 'string') {
      className += ` ${option.class}`;
    }
    
    if (option.disabled) {
      className += ' disabled';
    }
    
    return className;
  };

  if (!isVisible || !options.length) {
    return null;
  }

  const menuElement = (
    <ul
      ref={menuRef}
      className={`vue-simple-context-menu ${className}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
      }}
    >
      {options.map((option, index) => (
        <li
          key={index}
          className={getOptionClass(option)}
          onClick={(e) => optionClicked(option, e)}
        >
          <span dangerouslySetInnerHTML={{ __html: option.name }} />
          <div className="expand" />
          <span>
            {option.shortcut && (
              <span 
                className="shortcut"
                dangerouslySetInnerHTML={{ __html: option.shortcut }}
              />
            )}
            {option.icon && (
              <i className="material-icons menu-icon">{option.icon}</i>
            )}
            {option.ultimate && isCommunity && (
              <i className="material-icons menu-icon">stars</i>
            )}
          </span>
        </li>
      ))}
    </ul>
  );

  // Render to portal
  const portalTarget = document.getElementById('menus') || document.body;
  return createPortal(menuElement, portalTarget);
};

export default ContextMenu;
