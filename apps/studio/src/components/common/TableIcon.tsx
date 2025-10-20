import React from 'react';

interface Table {
  entityType: string;
  name: string;
  type?: string;
}

interface TableIconProps {
  table: Table;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const TableIcon: React.FC<TableIconProps> = ({ 
  table, 
  className = '',
  size = 'medium'
}) => {
  const getIconClass = (entityType: string): string => {
    const baseClass = 'material-icons item-icon';
    const sizeClass = `icon-${size}`;
    const entityClass = `${entityType}-icon`;
    return `${baseClass} ${sizeClass} ${entityClass} ${className}`.trim();
  };

  const getTitle = (entityType: string): string => {
    // Convert camelCase or snake_case to Title Case
    return entityType
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getIconName = (entityType: string): string => {
    const iconMap: Record<string, string> = {
      'table': 'grid_on',
      'view': 'visibility',
      'materialized_view': 'view_module',
      'function': 'functions',
      'procedure': 'settings',
      'trigger': 'flash_on',
      'index': 'storage',
      'sequence': 'format_list_numbered',
      'type': 'category',
      'domain': 'domain',
      'schema': 'folder',
      'database': 'storage',
      'collection': 'collections',
      'document': 'description',
      'partition': 'view_list',
      'temporary': 'schedule',
      'system': 'settings',
      'information_schema': 'info',
      'performance_schema': 'speed',
      'mysql': 'storage',
      'postgresql': 'storage',
      'sqlite': 'storage',
      'oracle': 'storage',
      'sqlserver': 'storage',
      'mongodb': 'storage',
      'redis': 'storage',
      'clickhouse': 'storage',
      'bigquery': 'storage',
      'cassandra': 'storage',
      'firebird': 'storage',
      'duckdb': 'storage',
      'libsql': 'storage',
      'trino': 'storage',
      'surreal': 'storage',
      'redshift': 'storage',
      'sqlanywhere': 'storage',
    };

    return iconMap[entityType.toLowerCase()] || 'grid_on';
  };

  return (
    <i
      title={getTitle(table.entityType)}
      className={getIconClass(table.entityType)}
    >
      {getIconName(table.entityType)}
    </i>
  );
};

export default TableIcon;
