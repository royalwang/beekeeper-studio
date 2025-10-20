import React, { useState, useEffect, ReactNode } from 'react';

interface ToggleFormAreaProps {
  title: string;
  expanded?: boolean;
  initiallyExpanded?: boolean;
  hideToggle?: boolean;
  onExpanded?: (expanded: boolean) => void;
  children: ReactNode;
  headerSlot?: ReactNode;
  className?: string;
}

const ToggleFormArea: React.FC<ToggleFormAreaProps> = ({
  title,
  expanded,
  initiallyExpanded = false,
  hideToggle = false,
  onExpanded,
  children,
  headerSlot,
  className = '',
}) => {
  const [toggleContent, setToggleContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setToggleContent(!!expanded || !!initiallyExpanded);
  }, [expanded, initiallyExpanded]);

  useEffect(() => {
    if (expanded !== undefined) {
      setToggleContent(expanded);
      onExpanded?.(expanded);
    }
  }, [expanded, onExpanded]);

  const toggleContentHandler = () => {
    if (hideToggle) return;
    
    const newState = !toggleContent;
    setToggleContent(newState);
    onExpanded?.(newState);
  };

  const toggleIcon = toggleContent ? 'keyboard_arrow_down' : 'keyboard_arrow_right';

  const beforeEnter = (el: HTMLElement) => {
    setIsAnimating(true);
    el.style.height = '0';
    el.style.opacity = '0';
  };

  const enter = (el: HTMLElement) => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
    
    setTimeout(() => {
      el.style.height = 'auto';
      setIsAnimating(false);
    }, 300);
  };

  const beforeLeave = (el: HTMLElement) => {
    setIsAnimating(true);
    el.style.height = el.scrollHeight + 'px';
    el.style.opacity = '1';
  };

  const leave = (el: HTMLElement) => {
    el.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    el.style.height = '0';
    el.style.opacity = '0';
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`advanced-connection-settings ${className}`}>
      <div className="flex flex-middle">
        {!hideToggle && (
          <button
            className="btn btn-link btn-fab"
            onClick={toggleContentHandler}
            disabled={isAnimating}
          >
            <i className={`material-icons ${toggleContent ? 'expanded' : ''}`}>
              {toggleIcon}
            </i>
          </button>
        )}
        
        <h4 className="advanced-heading flex">
          <span className="expand">{title}</span>
          {headerSlot}
        </h4>
      </div>
      
      <div
        className={`advanced-body ${toggleContent ? 'expanded' : 'collapsed'}`}
        style={{
          height: toggleContent ? 'auto' : '0',
          opacity: toggleContent ? 1 : 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease, opacity 0.3s ease',
        }}
      >
        {toggleContent && children}
      </div>
    </div>
  );
};

export default ToggleFormArea;
