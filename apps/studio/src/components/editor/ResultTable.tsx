import React, { useState, useMemo } from 'react';

interface ResultTableProps {
  results: any[];
  columns?: string[];
}

const ResultTable: React.FC<ResultTableProps> = ({ results, columns }) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const tableColumns = useMemo(() => {
    if (columns) return columns;
    if (results.length === 0) return [];
    return Object.keys(results[0]);
  }, [results, columns]);

  const sortedResults = useMemo(() => {
    if (!sortColumn) return results;
    
    return [...results].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
  }, [results, sortColumn, sortDirection]);

  const paginatedResults = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return sortedResults.slice(startIndex, startIndex + pageSize);
  }, [sortedResults, page, pageSize]);

  const totalPages = Math.ceil(sortedResults.length / pageSize);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="null-value">NULL</span>;
    }
    
    if (typeof value === 'boolean') {
      return <span className="boolean-value">{value.toString()}</span>;
    }
    
    if (typeof value === 'number') {
      return <span className="number-value">{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'string' && value.length > 100) {
      return (
        <span className="long-text" title={value}>
          {value.substring(0, 100)}...
        </span>
      );
    }
    
    return <span className="text-value">{String(value)}</span>;
  };

  if (results.length === 0) {
    return (
      <div className="result-table empty">
        <div className="empty-state">
          <i className="material-icons">table_chart</i>
          <p>No results to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="result-table">
      <div className="table-header">
        <div className="table-info">
          <span className="result-count">
            {sortedResults.length} row{sortedResults.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="table-controls">
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="page-size-select"
          >
            <option value={25}>25 rows</option>
            <option value={50}>50 rows</option>
            <option value={100}>100 rows</option>
            <option value={500}>500 rows</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              {tableColumns.map((column) => (
                <th
                  key={column}
                  className={`sortable ${sortColumn === column ? `sorted-${sortDirection}` : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <span className="column-name">{column}</span>
                  <i className="material-icons sort-icon">
                    {sortColumn === column 
                      ? (sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward')
                      : 'unfold_more'
                    }
                  </i>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedResults.map((row, index) => (
              <tr key={index} className="data-row">
                {tableColumns.map((column) => (
                  <td key={column} className="data-cell">
                    {formatCellValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="table-pagination">
          <button
            className="btn btn-sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <i className="material-icons">chevron_left</i>
            Previous
          </button>
          
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          
          <button
            className="btn btn-sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
            <i className="material-icons">chevron_right</i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;
