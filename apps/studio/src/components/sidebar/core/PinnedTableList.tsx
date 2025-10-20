import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import TableListItem from './table_list/TableListItem';
import RoutineListItem from './table_list/RoutineListItem';
import SidebarSortButtons from '../SidebarSortButtons';

interface PinnedEntity {
  id: string;
  entityType: 'table' | 'routine';
  entity: any;
  position: number;
}

interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface PinnedTableListProps {
  onRefreshColumns: () => void;
  onTableSelect: (table: any) => void;
  onRoutineSelect: (routine: any) => void;
  onTableContextMenu: (table: any, event: React.MouseEvent) => void;
  onRoutineContextMenu: (routine: any, event: React.MouseEvent) => void;
  onPinReorder: (pins: PinnedEntity[]) => void;
  onPinRemove: (pin: PinnedEntity) => void;
  onPinAdd: (entity: any, entityType: 'table' | 'routine') => void;
  onPinClear: () => void;
  onPinExport: () => void;
  onPinImport: () => void;
  onPinBackup: () => void;
  onPinRestore: () => void;
  onPinClone: () => void;
  onPinDelete: () => void;
  className?: string;
}

const PinnedTableList: React.FC<PinnedTableListProps> = ({
  onRefreshColumns,
  onTableSelect,
  onRoutineSelect,
  onTableContextMenu,
  onRoutineContextMenu,
  onPinReorder,
  onPinRemove,
  onPinAdd,
  onPinClear,
  onPinExport,
  onPinImport,
  onPinBackup,
  onPinRestore,
  onPinClone,
  onPinDelete,
  className = '',
}) => {
  const [orderedPins, setOrderedPins] = useState<PinnedEntity[]>([]);
  const [sort, setSort] = useState<SortOption>({ field: 'position', direction: 'asc' });
  const [allExpanded, setAllExpanded] = useState(false);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [draggedItem, setDraggedItem] = useState<PinnedEntity | null>(null);
  const [dragOverItem, setDragOverItem] = useState<PinnedEntity | null>(null);

  const pinContainerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const initialized = useSelector((state: RootState) => state.sidebar.initialized);
  const pins = useSelector((state: RootState) => state.sidebar.pins || []);

  const sortOptions = [
    { field: 'position', label: 'Position' },
    { field: 'name', label: 'Name' },
    { field: 'type', label: 'Type' },
    { field: 'size', label: 'Size' },
    { field: 'modified', label: 'Modified' },
  ];

  useEffect(() => {
    if (pins && pins.length > 0) {
      const sorted = [...pins].sort((a, b) => {
        if (sort.field === 'position') {
          return sort.direction === 'asc' ? a.position - b.position : b.position - a.position;
        } else if (sort.field === 'name') {
          const aName = a.entity.name || '';
          const bName = b.entity.name || '';
          return sort.direction === 'asc' ? aName.localeCompare(bName) : bName.localeCompare(aName);
        } else if (sort.field === 'type') {
          const aType = a.entityType || '';
          const bType = b.entityType || '';
          return sort.direction === 'asc' ? aType.localeCompare(bType) : bType.localeCompare(aType);
        }
        return 0;
      });
      setOrderedPins(sorted);
    } else {
      setOrderedPins([]);
    }
  }, [pins, sort]);

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleDragStart = (e: React.DragEvent, item: PinnedEntity) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, item: PinnedEntity) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverItem(item);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetItem: PinnedEntity) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.id !== targetItem.id) {
      const newPins = [...orderedPins];
      const draggedIndex = newPins.findIndex(p => p.id === draggedItem.id);
      const targetIndex = newPins.findIndex(p => p.id === targetItem.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = newPins.splice(draggedIndex, 1);
        newPins.splice(targetIndex, 0, removed);
        
        // Update positions
        newPins.forEach((pin, index) => {
          pin.position = index;
        });
        
        setOrderedPins(newPins);
        onPinReorder(newPins);
      }
    }
    
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleTableSelect = (table: any) => {
    onTableSelect(table);
    onRefreshColumns();
  };

  const handleRoutineSelect = (routine: any) => {
    onRoutineSelect(routine);
  };

  const handleTableContextMenu = (table: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onTableContextMenu(table, event);
  };

  const handleRoutineContextMenu = (routine: any, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    onRoutineContextMenu(routine, event);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handlePinClear = () => {
    onPinClear();
    setShowMenu(false);
  };

  const handlePinExport = () => {
    onPinExport();
    setShowMenu(false);
  };

  const handlePinImport = () => {
    onPinImport();
    setShowMenu(false);
  };

  const handlePinBackup = () => {
    onPinBackup();
    setShowMenu(false);
  };

  const handlePinRestore = () => {
    onPinRestore();
    setShowMenu(false);
  };

  const handlePinClone = () => {
    onPinClone();
    setShowMenu(false);
  };

  const handlePinDelete = () => {
    onPinDelete();
    setShowMenu(false);
  };

  return (
    <nav className={`list-group flex-col ${className}`}>
      <div className="list-heading">
        <span className="sub">Pinned</span>
        <span className="badge">{orderedPins.length}</span>
        <div className="actions">
          {initialized && (
            <SidebarSortButtons
              value={sort}
              onChange={handleSortChange}
              sortOptions={sortOptions}
              noOrder="position"
            />
          )}
          
          <button
            className="btn btn-flat btn-icon"
            onClick={handleMenuToggle}
            title="Pin Actions"
          >
            <i className="material-icons">more_vert</i>
          </button>

          {showMenu && (
            <div className="pin-menu" ref={menuRef}>
              <div className="menu-item" onClick={handlePinExport}>
                <i className="material-icons">export</i>
                <span>Export Pins</span>
              </div>

              <div className="menu-item" onClick={handlePinImport}>
                <i className="material-icons">import</i>
                <span>Import Pins</span>
              </div>

              <div className="menu-item" onClick={handlePinBackup}>
                <i className="material-icons">backup</i>
                <span>Backup Pins</span>
              </div>

              <div className="menu-item" onClick={handlePinRestore}>
                <i className="material-icons">restore</i>
                <span>Restore Pins</span>
              </div>

              <div className="menu-item" onClick={handlePinClone}>
                <i className="material-icons">content_copy</i>
                <span>Clone Pins</span>
              </div>

              <div className="menu-divider" />

              <div className="menu-item danger" onClick={handlePinDelete}>
                <i className="material-icons">delete</i>
                <span>Delete Pins</span>
              </div>

              <div className="menu-item danger" onClick={handlePinClear}>
                <i className="material-icons">clear</i>
                <span>Clear All Pins</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="list-body" ref={pinContainerRef}>
        {orderedPins.map((pin) => (
          <div
            key={pin.id || pin.entity.name}
            className={`pin-wrapper ${draggedItem?.id === pin.id ? 'dragging' : ''} ${dragOverItem?.id === pin.id ? 'drag-over' : ''}`}
            draggable={sort.field === 'position'}
            onDragStart={(e) => handleDragStart(e, pin)}
            onDragOver={(e) => handleDragOver(e, pin)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, pin)}
          >
            {pin.entityType !== 'routine' ? (
              <TableListItem
                table={pin.entity}
                pinned={true}
                draggable={sort.field === 'position'}
                container={pinContainerRef.current}
                forceExpand={allExpanded}
                forceCollapse={allCollapsed}
                onSelected={handleTableSelect}
                noSelect={true}
                onContextMenu={(event) => handleTableContextMenu(pin.entity, event)}
              />
            ) : (
              <RoutineListItem
                container={pinContainerRef.current}
                draggable={sort.field === 'position'}
                routine={pin.entity}
                pinned={true}
                forceExpand={allExpanded}
                forceCollapse={allCollapsed}
                onContextMenu={(event) => handleRoutineContextMenu(pin.entity, event)}
              />
            )}
          </div>
        ))}

        {orderedPins.length === 0 && (
          <div className="no-pins">
            <div className="alert alert-info">
              <i className="material-icons">info</i>
              <div>
                <strong>No pinned items</strong>
                <p>Pin tables and routines to this list for quick access.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PinnedTableList;
