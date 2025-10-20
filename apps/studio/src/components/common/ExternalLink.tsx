import React from 'react';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  onClick?: (event: React.MouseEvent) => void;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
  onClick,
}) => {
  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Call custom onClick handler if provided
    if (onClick) {
      onClick(event);
    }
    
    // Open link using native method if available (Electron)
    if (window.electronAPI?.openLink) {
      window.electronAPI.openLink(href);
    } else {
      // Fallback to standard window.open for web
      window.open(href, target, rel);
    }
  };

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};

export default ExternalLink;
