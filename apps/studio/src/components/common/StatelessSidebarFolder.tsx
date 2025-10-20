import React from 'react';

interface StatelessSidebarFolderProps {
  schema: string;
  expanded?: boolean;
  onContextMenu?: (event: React.MouseEvent) => void;
  onExpand?: (event: React.MouseEvent) => void;
  className?: string;
}

const StatelessSidebarFolder: React.FC<StatelessSidebarFolderProps> = ({
  schema,
  expanded = false,
  onContextMenu,
  onExpand,
  className = '',
}) => {
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu?.(event);
  };

  const handleExpand = (event: React.MouseEvent) => {
    event.preventDefault();
    onExpand?.(event);
  };

  return (
    <div
      className={`list-item schema-item ${className}`}
      onContextMenu={handleContextMenu}
    >
      <div className="folder-group schema">
        <button
          className={`folder-btn ${expanded ? 'open' : ''}`}
          onClick={handleExpand}
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
            title={schema}
          >
            {schema}
          </span>
        </button>
      </div>
    </div>
  );
};

export default StatelessSidebarFolder;
