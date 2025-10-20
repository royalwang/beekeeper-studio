import React, { useState, useEffect, ReactNode } from 'react';

interface SidebarFolderProps {
  title: string;
  expanded?: boolean;
  skipDisplay?: boolean;
  placeholder?: string;
  onContextMenu?: (event: React.MouseEvent) => void;
  onToggle?: (expanded: boolean) => void;
  children: ReactNode;
  placeholderSlot?: ReactNode;
  className?: string;
}

const SidebarFolder: React.FC<SidebarFolderProps> = ({
  title,
  expanded: controlledExpanded,
  skipDisplay = false,
  placeholder = "No items",
  onContextMenu,
  onToggle,
  children,
  placeholderSlot,
  className = '',
}) => {
  const [manuallyExpanded, setManuallyExpanded] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);

  const expanded = controlledExpanded !== undefined ? controlledExpanded : manuallyExpanded;

  useEffect(() => {
    // Check if there are children
    const hasContent = React.Children.count(children) > 0;
    setHasChildren(hasContent);
  }, [children]);

  const handleToggle = () => {
    const newExpanded = !expanded;
    if (controlledExpanded === undefined) {
      setManuallyExpanded(newExpanded);
    }
    onToggle?.(newExpanded);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu?.(event);
  };

  if (skipDisplay) {
    return (
      <div className={`schema-wrapper ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`schema-wrapper ${className}`}
      onContextMenu={handleContextMenu}
    >
      <div className="folder-group schema">
        <button
          className={`folder-btn ${expanded ? 'open' : ''}`}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
        >
          <span className="btn-fab open-close">
            <i className={`dropdown-icon material-icons ${expanded ? 'expanded' : ''}`}>
              keyboard_arrow_right
            </i>
          </span>
          
          <i
            title="Schema"
            className="schema-icon item-icon material-icons"
          >
            folder
          </i>
          
          <span
            className="table-name truncate expand"
            title={title}
          >
            {title}
          </span>
        </button>

        {expanded && (
          <div className="folder-content">
            {hasChildren ? (
              children
            ) : (
              placeholderSlot || (
                <div className="list-item empty">
                  {placeholder}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarFolder;
