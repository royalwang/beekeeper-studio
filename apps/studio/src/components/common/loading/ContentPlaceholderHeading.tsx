import React from 'react';

interface ContentPlaceholderHeadingProps {
  img?: boolean;
  className?: string;
}

const ContentPlaceholderHeading: React.FC<ContentPlaceholderHeadingProps> = ({
  img = false,
  className = 'vue-content-placeholders-heading'
}) => {
  return (
    <div className={className}>
      {img && (
        <div className={`${className}__img`} />
      )}
      <div className={`${className}__content`}>
        <div className={`${className}__title`} />
        <div className={`${className}__subtitle`} />
      </div>
    </div>
  );
};

export default ContentPlaceholderHeading;
