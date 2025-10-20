import React, { useState, useEffect, useRef } from 'react';

interface Column {
  columnName: string;
  dataType: string;
  isNullable: boolean;
}

interface Filter {
  field: string;
  type: string;
  value: string;
}

interface FilterType {
  value: string;
  label: string;
}

interface BuilderFilterProps {
  filter: Filter;
  columns: Column[];
  onFilterChange: (filter: Filter) => void;
  onBlur?: () => void;
  onRemove?: () => void;
  className?: string;
}

const BuilderFilter: React.FC<BuilderFilterProps> = ({
  filter,
  columns,
  onFilterChange,
  onBlur,
  onRemove,
  className = '',
}) => {
  const [localFilter, setLocalFilter] = useState<Filter>(filter);
  const filterInputRef = useRef<HTMLInputElement>(null);

  const filterTypes: FilterType[] = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'not_contains', label: 'Not Contains' },
    { value: 'starts_with', label: 'Starts With' },
    { value: 'ends_with', label: 'Ends With' },
    { value: 'is_null', label: 'Is NULL' },
    { value: 'is_not_null', label: 'Is Not NULL' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_than_or_equal', label: 'Greater Than or Equal' },
    { value: 'less_than_or_equal', label: 'Less Than or Equal' },
    { value: 'in', label: 'In' },
    { value: 'not_in', label: 'Not In' },
    { value: 'between', label: 'Between' },
    { value: 'not_between', label: 'Not Between' },
  ];

  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  const isNullFilter = localFilter.type === 'is_null' || localFilter.type === 'is_not_null';

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = { ...localFilter, field: e.target.value };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilter = { ...localFilter, type: e.target.value, value: '' };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = { ...localFilter, value: e.target.value };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleBlur = () => {
    onBlur?.();
  };

  const handleRemove = () => {
    onRemove?.();
  };

  const getPlaceholder = () => {
    switch (localFilter.type) {
      case 'in':
      case 'not_in':
        return 'Enter values separated by comma, eg: foo,bar';
      case 'between':
      case 'not_between':
        return 'Enter range separated by comma, eg: 1,100';
      default:
        return 'Enter Value';
    }
  };

  const getInputType = () => {
    const column = columns.find(col => col.columnName === localFilter.field);
    if (!column) return 'text';

    const dataType = column.dataType.toLowerCase();
    if (dataType.includes('int') || dataType.includes('decimal') || dataType.includes('float')) {
      return 'number';
    }
    if (dataType.includes('date') || dataType.includes('time')) {
      return 'datetime-local';
    }
    return 'text';
  };

  return (
    <div className={`filter-container ${className}`}>
      <div className="select-wrap">
        <select
          name="Filter Field"
          className="form-control"
          value={localFilter.field}
          onChange={handleFieldChange}
        >
          <option value="">Select Field</option>
          {columns.map((column) => (
            <option key={column.columnName} value={column.columnName}>
              {column.columnName}
            </option>
          ))}
        </select>
      </div>

      <div className="select-wrap">
        <select
          name="Filter Type"
          className="form-control"
          value={localFilter.type}
          onChange={handleTypeChange}
        >
          {filterTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="expand filter">
        <div className="filter-wrap">
          <input
            ref={filterInputRef}
            className={`form-control filter-value ${isNullFilter ? 'disabled-input' : ''}`}
            type={getInputType()}
            value={localFilter.value}
            onChange={handleValueChange}
            onBlur={handleBlur}
            disabled={isNullFilter}
            placeholder={getPlaceholder()}
            title={isNullFilter ? 'You cannot provide a comparison value when checking for NULL or NOT NULL' : ''}
          />
        </div>
      </div>

      <div className="filter-actions">
        <button
          type="button"
          className="btn btn-flat btn-icon"
          onClick={handleRemove}
          title="Remove Filter"
        >
          <i className="material-icons">close</i>
        </button>
      </div>

      <div className="filter-info">
        {localFilter.field && localFilter.type && (
          <div className="filter-preview">
            <small className="text-muted">
              {localFilter.field} {filterTypes.find(ft => ft.value === localFilter.type)?.label.toLowerCase()} {!isNullFilter && localFilter.value && `"${localFilter.value}"`}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderFilter;
