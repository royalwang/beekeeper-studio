import React, { useState } from 'react';
import TableIcon from '../../common/TableIcon';

interface Table {
  name: string;
  type: string;
  schema?: string;
  columns?: any[];
}

interface TableListItemProps {
  table: Table;
  active?: boolean;
  selected?: boolean;
  showColumns?: boolean;
  pinned?: boolean;
  draggable?: boolean;
  onContextMenu?: (event: React.MouseEvent) => void;
  onToggleColumns?: () => void;
  onOpenTable?: () => void;
  onSelectItem?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  onImport?: () => void;
}

const TableListItem: React.FC<TableListItemProps> = ({
  table,
  active = false,
  selected = false,
  showColumns = false,
  pinned = false,
  draggable = false,
  onContextMenu,
  onToggleColumns,
  onOpenTable,
  onSelectItem,
  onPin,
  onUnpin,
  onRename,
  onDelete,
  onExport,
  onImport,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    onContextMenu?.(event);
  };

  const handleToggleColumns = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleColumns?.();
  };

  const handleOpenTable = (event: React.MouseEvent) => {
    event.preventDefault();
    onOpenTable?.();
  };

  const handleSelectItem = (event: React.MouseEvent) => {
    onSelectItem?.();
  };

  const handlePin = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onPin?.();
  };

  const handleUnpin = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onUnpin?.();
  };

  return (
    <div
      className="list-item"
      onContextMenu={handleContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`list-item-btn ${active ? 'active' : ''} ${selected ? 'selected' : ''} ${showColumns ? 'open' : ''}`}
        role="button"
        tabIndex={0}
      >
        <button
          className="btn-fab open-close"
          onClick={handleToggleColumns}
          onMouseDown={(e) => e.preventDefault()}
        >
          <i className={`dropdown-icon material-icons ${showColumns ? 'expanded' : ''}`}>
            keyboard_arrow_right
          </i>
        </button>

        <div
          className="item-wrapper flex flex-middle expand"
          onDoubleClick={handleOpenTable}
          onMouseDown={handleSelectItem}
        >
          <div
            className={`table-item-wrapper ${draggable ? 'draggable drag-handle' : ''}`}
            title={draggable ? 'drag me!' : ''}
          >
            <TableIcon table={table} className="table-icon" />
            {draggable && (
              <i className="material-icons item-icon dh">menu</i>
            )}
          </div>
          
          <span
            className="table-name truncate"
            title={table.name}
          >
            {table.name}
          </span>
        </div>

        <div className={`actions ${pinned ? 'pinned' : ''}`}>
          {!pinned && (
            <button
              className="btn-fab pin"
              onClick={handlePin}
              onMouseDown={(e) => e.preventDefault()}
              title="Pin"
            >
              <i className="material-icons">push_pin</i>
            </button>
          )}

          {pinned && (
            <button
              className="btn-fab unpin"
              onClick={handleUnpin}
              onMouseDown={(e) => e.preventDefault()}
              title="Unpin"
            >
              <i className="material-icons">push_pin</i>
            </button>
          )}

          {(isHovered || active) && (
            <div className="item-actions">
              <button
                className="btn-fab action-btn"
                onClick={onRename}
                title="Rename"
              >
                <i className="material-icons">edit</i>
              </button>
              
              <button
                className="btn-fab action-btn"
                onClick={onExport}
                title="Export"
              >
                <i className="material-icons">download</i>
              </button>
              
              <button
                className="btn-fab action-btn"
                onClick={onImport}
                title="Import"
              >
                <i className="material-icons">upload</i>
              </button>
              
              <button
                className="btn-fab action-btn danger"
                onClick={onDelete}
                title="Delete"
              >
                <i className="material-icons">delete</i>
              </button>
            </div>
          )}
        </div>
      </div>

      {showColumns && table.columns && (
        <div className="columns-list">
          {table.columns.map((column, index) => (
            <div key={index} className="column-item">
              <span className="column-name">{column.name}</span>
              <span className="column-type">{column.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableListItem;
