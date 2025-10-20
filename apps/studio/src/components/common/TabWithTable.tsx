import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import ProgressBar from '../editor/ProgressBar';
import { findTable } from '@shared/lib/transport/TransportOpenTab';

interface TabWithTableProps {
  tab: any;
  onClose: (tab: any) => void;
  children: (table: any) => React.ReactNode;
  className?: string;
}

const TabWithTable: React.FC<TabWithTableProps> = ({
  tab,
  onClose,
  children,
  className = '',
}) => {
  const tables = useSelector((state: RootState) => state.tables.tables);
  const tablesInitialLoaded = useSelector((state: RootState) => state.tables.tablesInitialLoaded);

  const table = useMemo(() => {
    return findTable(tab, tables);
  }, [tab, tables]);

  const handleClose = () => {
    onClose(tab);
  };

  return (
    <div className={`with-table-wrapper ${className}`}>
      {!tablesInitialLoaded && (
        <div>
          <ProgressBar />
        </div>
      )}

      {tablesInitialLoaded && !table && (
        <div className="no-content flex">
          <div className="alert alert-danger expand">
            <i className="material-icons">error_outline</i>
            <div className="alert-body expand">
              This table does not exist in the selected database
            </div>
            <button
              onClick={handleClose}
              className="btn btn-flat"
            >
              Close Tab
            </button>
          </div>
        </div>
      )}

      {tablesInitialLoaded && table && (
        <div className="table-content">
          {children(table)}
        </div>
      )}
    </div>
  );
};

export default TabWithTable;
