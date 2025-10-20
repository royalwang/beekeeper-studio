import React from 'react';
import ContentPlaceholder from './loading/ContentPlaceholder';
import ContentPlaceholderText from './loading/ContentPlaceholderText';

interface SidebarLoadingProps {
  itemCount?: number;
  className?: string;
}

const SidebarLoading: React.FC<SidebarLoadingProps> = ({
  itemCount = 3,
  className = '',
}) => {
  return (
    <nav className={`sidebar-loading list-body ${className}`}>
      <ContentPlaceholder
        animated={true}
        rounded={false}
        className="list-item"
      >
        {Array.from({ length: itemCount }, (_, index) => (
          <ContentPlaceholderText
            key={index}
            lines={2}
            className="list-item-btn"
          />
        ))}
      </ContentPlaceholder>
    </nav>
  );
};

export default SidebarLoading;
