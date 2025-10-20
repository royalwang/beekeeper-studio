import React from 'react';

interface WorkspaceAvatarProps {
  workspace: {
    name: string;
    logo?: string;
    icon?: string;
  };
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const WorkspaceAvatar: React.FC<WorkspaceAvatarProps> = ({
  workspace,
  size = 'medium',
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    small: 'workspace-avatar-small',
    medium: 'workspace-avatar-medium',
    large: 'workspace-avatar-large',
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={`workspace-avatar ${sizeClasses[size]} ${className}`}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {workspace.logo && (
        <img
          className="workspace-logo"
          src={workspace.logo}
          alt={workspace.name}
          loading="lazy"
        />
      )}
      
      {!workspace.logo && workspace.icon && (
        <i className="material-icons workspace-icon">
          {workspace.icon}
        </i>
      )}
      
      {!workspace.logo && !workspace.icon && (
        <span className="workspace-letter">
          {workspace.name.toUpperCase()[0]}
        </span>
      )}
    </div>
  );
};

export default WorkspaceAvatar;
