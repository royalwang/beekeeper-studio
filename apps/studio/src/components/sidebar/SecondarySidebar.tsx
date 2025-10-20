import React, { forwardRef } from 'react';

interface SecondarySidebarProps {
  onClose: () => void;
}

const SecondarySidebar = forwardRef<HTMLDivElement, SecondarySidebarProps>(({ onClose }, ref) => {
  return (
    <div ref={ref} className="secondary-sidebar">
      {/* Secondary sidebar content will be implemented here */}
      <div className="sidebar-header">
        <button onClick={onClose} className="close-button">
          <i className="material-icons">close</i>
        </button>
      </div>
      <div className="sidebar-content">
        <h3>Secondary Sidebar</h3>
        <p>Additional tools and information will be displayed here.</p>
      </div>
    </div>
  );
});

SecondarySidebar.displayName = 'SecondarySidebar';

export default SecondarySidebar;
