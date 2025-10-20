import React from 'react';

interface ContentPlaceholderProps {
  rounded?: boolean;
  centered?: boolean;
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
}

const ContentPlaceholder: React.FC<ContentPlaceholderProps> = ({
  rounded = false,
  centered = false,
  animated = true,
  children,
  className = '',
}) => {
  const getClassNames = (): string => {
    const classes = ['vue-content-placeholders'];
    
    if (rounded) {
      classes.push('vue-content-placeholders-is-rounded');
    }
    
    if (centered) {
      classes.push('vue-content-placeholders-is-centered');
    }
    
    if (animated) {
      classes.push('vue-content-placeholders-is-animated');
    }
    
    if (className) {
      classes.push(className);
    }
    
    return classes.join(' ');
  };

  return (
    <div className={getClassNames()}>
      {children}
    </div>
  );
};

export default ContentPlaceholder;
