import React, { forwardRef } from 'react';

interface SidebarProps {
  className?: string;
  children: React.ReactNode;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ className, children }, ref) => {
  return (
    <div ref={ref} className={`sidebar ${className || ''}`}>
      {children}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
