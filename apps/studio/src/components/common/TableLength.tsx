import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface TableLengthProps {
  table: {
    name: string;
    schema?: string;
  };
  onFetchTotalRecords?: (tableName: string, schema?: string) => Promise<number>;
  className?: string;
}

const TableLength: React.FC<TableLengthProps> = ({
  table,
  onFetchTotalRecords,
  className = '',
}) => {
  const [totalRecords, setTotalRecords] = useState<number | null>(null);
  const [fetchingTotalRecords, setFetchingTotalRecords] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connection = useSelector((state: RootState) => state.connection);

  const fetchTotalRecords = useCallback(async () => {
    setFetchingTotalRecords(true);
    setError(null);

    try {
      let records: number;
      
      if (onFetchTotalRecords) {
        records = await onFetchTotalRecords(table.name, table.schema);
      } else if (connection && connection.getTableLength) {
        records = await connection.getTableLength(table.name, table.schema);
      } else {
        throw new Error('No connection or fetch method available');
      }
      
      setTotalRecords(records);
    } catch (ex) {
      console.error('Unable to fetch total records', ex);
      setTotalRecords(0);
      setError(ex instanceof Error ? ex : new Error('Failed to fetch records'));
    } finally {
      setFetchingTotalRecords(false);
    }
  }, [table.name, table.schema, onFetchTotalRecords, connection]);

  const getHoverTitle = () => {
    if (error) return error.message;
    if (totalRecords === null) return 'Click to fetch total record count';
    return `Approximately ${Number(totalRecords).toLocaleString()} Records`;
  };

  const getDisplayText = () => {
    if (fetchingTotalRecords) return 'loading...';
    if (error) return 'error';
    if (totalRecords === null) return 'Unknown';
    return `~${Number(totalRecords).toLocaleString()}`;
  };

  return (
    <button
      className={`statusbar-item hoverable ${className}`}
      onClick={fetchTotalRecords}
      title={getHoverTitle()}
      disabled={fetchingTotalRecords}
      type="button"
    >
      <i className="material-icons">tag</i>
      <span>{getDisplayText()}</span>
    </button>
  );
};

export default TableLength;
