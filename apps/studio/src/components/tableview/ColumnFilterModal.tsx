import React, { useState, useEffect } from 'react';

interface ColumnFilterModalProps {
  modalName: string | null;
  columnsWithFilterAndOrder: any[];
  hasPendingChanges: boolean;
  onChange: (changes: any[]) => void;
  onClose: () => void;
}

const ColumnFilterModal: React.FC<ColumnFilterModalProps> = ({
  modalName,
  columnsWithFilterAndOrder,
  hasPendingChanges,
  onChange,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [columns, setColumns] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsOpen(modalName === 'columnFilter');
    if (modalName === 'columnFilter') {
      setColumns([...columnsWithFilterAndOrder]);
    }
  }, [modalName, columnsWithFilterAndOrder]);

  const filteredColumns = columns.filter(column =>
    column.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleColumnVisibility = (columnName: string) => {
    const newColumns = columns.map(col =>
      col.name === columnName ? { ...col, visible: !col.visible } : col
    );
    setColumns(newColumns);
  };

  const moveColumn = (fromIndex: number, toIndex: number) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    setColumns(newColumns);
  };

  const applyChanges = () => {
    onChange(columns);
    onClose();
  };

  const resetChanges = () => {
    setColumns([...columnsWithFilterAndOrder]);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content column-filter-modal">
        <div className="modal-header">
          <h3>Column Filter & Order</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="material-icons">close</i>
          </button>
        </div>

        <div className="modal-body">
          <div className="search-section">
            <div className="form-group">
              <label htmlFor="columnSearch">Search Columns</label>
              <input
                id="columnSearch"
                type="text"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search columns..."
              />
            </div>
          </div>

          <div className="columns-section">
            <div className="section-header">
              <h4>Columns ({filteredColumns.length})</h4>
              <div className="bulk-actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    const newColumns = columns.map(col => ({ ...col, visible: true }));
                    setColumns(newColumns);
                  }}
                >
                  Show All
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => {
                    const newColumns = columns.map(col => ({ ...col, visible: false }));
                    setColumns(newColumns);
                  }}
                >
                  Hide All
                </button>
              </div>
            </div>

            <div className="columns-list">
              {filteredColumns.map((column, index) => (
                <div key={column.name} className="column-item">
                  <div className="column-controls">
                    <label className="column-checkbox">
                      <input
                        type="checkbox"
                        checked={column.visible !== false}
                        onChange={() => toggleColumnVisibility(column.name)}
                      />
                      <span className="column-name">{column.name}</span>
                      <span className="column-type">({column.type})</span>
                    </label>

                    <div className="column-actions">
                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => moveColumn(index, Math.max(0, index - 1))}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        <i className="material-icons">keyboard_arrow_up</i>
                      </button>
                      <button
                        className="btn btn-sm btn-icon"
                        onClick={() => moveColumn(index, Math.min(columns.length - 1, index + 1))}
                        disabled={index === columns.length - 1}
                        title="Move Down"
                      >
                        <i className="material-icons">keyboard_arrow_down</i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hasPendingChanges && (
            <div className="pending-changes-warning">
              <div className="alert alert-warning">
                <i className="material-icons">warning</i>
                <span>You have unsaved changes. Apply column changes to save them.</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={resetChanges}>
            Reset
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={applyChanges}>
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColumnFilterModal;
