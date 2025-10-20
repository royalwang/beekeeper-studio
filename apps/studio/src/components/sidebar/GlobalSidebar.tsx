import React, { forwardRef } from 'react';

interface GlobalSidebarProps {
  onSelect: (item: string) => void;
  activeItem: string;
}

const GlobalSidebar = forwardRef<HTMLDivElement, GlobalSidebarProps>(({ onSelect, activeItem }, ref) => {
  return (
    <div ref={ref} className="global-sidebar">
      {/* Global sidebar content will be implemented here */}
      <div className="sidebar-content">
        <h3>Global Navigation</h3>
        <nav>
          <button 
            className={activeItem === 'tables' ? 'active' : ''}
            onClick={() => onSelect('tables')}
          >
            Tables
          </button>
          <button 
            className={activeItem === 'history' ? 'active' : ''}
            onClick={() => onSelect('history')}
          >
            History
          </button>
          <button 
            className={activeItem === 'queries' ? 'active' : ''}
            onClick={() => onSelect('queries')}
          >
            Queries
          </button>
        </nav>
      </div>
    </div>
  );
});

GlobalSidebar.displayName = 'GlobalSidebar';

export default GlobalSidebar;
