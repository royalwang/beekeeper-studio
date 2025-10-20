import React from 'react';

interface ContentPlaceholderTextProps {
  lines?: number;
  className?: string;
}

const ContentPlaceholderText: React.FC<ContentPlaceholderTextProps> = ({
  lines = 4,
  className = 'vue-content-placeholders-text',
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`${className}__line`}
        />
      ))}
    </div>
  );
};

export default ContentPlaceholderText;
