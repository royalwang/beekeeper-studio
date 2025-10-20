import React, { useState, useEffect } from 'react';

interface RowFilterBuilderProps {
  columns: any[];
  reactiveFilters: any[];
  onInput: (filters: any[]) => void;
  onSubmit: () => void;
}

const RowFilterBuilder: React.FC<RowFilterBuilderProps> = ({
  columns,
  reactiveFilters,
  onInput,
  onSubmit,
}) => {
  const [filters, setFilters] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setFilters(reactiveFilters);
  }, [reactiveFilters]);

  const addFilter = () => {
    const newFilter = {
      id: Date.now(),
      column: columns[0]?.name || '',
      operator: '=',
      value: '',
    };
    const newFilters = [...filters, newFilter];
    setFilters(newFilters);
    onInput(newFilters);
  };

  const removeFilter = (id: number) => {
    const newFilters = filters.filter(filter => filter.id !== id);
    setFilters(newFilters);
    onInput(newFilters);
  };

  const updateFilter = (id: number, field: string, value: any) => {
    const newFilters = filters.map(filter =>
      filter.id === id ? { ...filter, [field]: value } : filter
    );
    setFilters(newFilters);
    onInput(newFilters);
  };

  const operators = [
    { value: '=', label: 'Equals' },
    { value: '!=', label: 'Not Equals' },
    { value: '>', label: 'Greater Than' },
    { value: '<', label: 'Less Than' },
    { value: '>=', label: 'Greater or Equal' },
    { value: '<=', label: 'Less or Equal' },
    { value: 'LIKE', label: 'Contains' },
    { value: 'NOT LIKE', label: 'Not Contains' },
    { value: 'IS NULL', label: 'Is Null' },
    { value: 'IS NOT NULL', label: 'Is Not Null' },
  ];

  return (
    <div className="row-filter-builder">
      <div className="filter-header">
        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className={`material-icons ${isExpanded ? 'expanded' : ''}`}>
            {isExpanded ? 'expand_less' : 'expand_more'}
          </i>
          Row Filters
          {filters.length > 0 && (
            <span className="filter-count">({filters.length})</span>
          )}
        </button>
        
        {isExpanded && (
          <div className="filter-actions">
            <button
              className="btn btn-sm btn-primary"
              onClick={addFilter}
            >
              <i className="material-icons">add</i>
              Add Filter
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={onSubmit}
              disabled={filters.length === 0}
            >
              <i className="material-icons">search</i>
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="filter-content">
          {filters.length === 0 ? (
            <div className="no-filters">
              <p>No filters applied. Click "Add Filter" to create a filter.</p>
            </div>
          ) : (
            <div className="filters-list">
              {filters.map((filter, index) => (
                <div key={filter.id} className="filter-item">
                  <div className="filter-controls">
                    <select
                      className="form-control"
                      value={filter.column}
                      onChange={(e) => updateFilter(filter.id, 'column', e.target.value)}
                    >
                      {columns.map((column) => (
                        <option key={column.name} value={column.name}>
                          {column.name} ({column.type})
                        </option>
                      ))}
                    </select>

                    <select
                      className="form-control"
                      value={filter.operator}
                      onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>

                    {!['IS NULL', 'IS NOT NULL'].includes(filter.operator) && (
                      <input
                        type="text"
                        className="form-control"
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                        placeholder="Enter value..."
                      />
                    )}

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFilter(filter.id)}
                      title="Remove Filter"
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RowFilterBuilder;
