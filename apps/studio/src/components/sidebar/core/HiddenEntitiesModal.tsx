import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Modal } from '../common/modals/Modal';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface HiddenEntity {
  name: string;
  type: 'table' | 'routine' | 'schema';
  schema?: string;
}

interface HiddenEntitiesModalProps {
  modalName: string;
  isOpen: boolean;
  onClose: () => void;
  onUnhideSchema: (schema: string) => void;
  onUnhideEntity: (entity: HiddenEntity) => void;
  onUnhideAll: () => void;
  onUnhideSelected: (entities: HiddenEntity[]) => void;
  onExportHidden: () => void;
  onImportHidden: () => void;
  onBackupHidden: () => void;
  onRestoreHidden: () => void;
  onCloneHidden: () => void;
  onDeleteHidden: () => void;
  className?: string;
}

const HiddenEntitiesModal: React.FC<HiddenEntitiesModalProps> = ({
  modalName,
  isOpen,
  onClose,
  onUnhideSchema,
  onUnhideEntity,
  onUnhideAll,
  onUnhideSelected,
  onExportHidden,
  onImportHidden,
  onBackupHidden,
  onRestoreHidden,
  onCloneHidden,
  onDeleteHidden,
  className = '',
}) => {
  const [schemas, setSchemas] = useState<string[]>([]);
  const [entities, setEntities] = useState<HiddenEntity[]>([]);
  const [selectedEntities, setSelectedEntities] = useState<Set<string>>(new Set());
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const hiddenSchemas = useSelector((state: RootState) => state.sidebar.hiddenSchemas || []);
  const hiddenEntities = useSelector((state: RootState) => state.sidebar.hiddenEntities || []);

  useEffect(() => {
    if (isOpen) {
      setSchemas(hiddenSchemas);
      setEntities(hiddenEntities);
      setSelectedEntities(new Set());
      setSearchTerm('');
    }
  }, [isOpen, hiddenSchemas, hiddenEntities]);

  const handleClose = () => {
    setSchemas([]);
    setEntities([]);
    setSelectedEntities(new Set());
    setSearchTerm('');
    onClose();
  };

  const handleUnhideSchema = (schema: string) => {
    onUnhideSchema(schema);
    setSchemas(prev => prev.filter(s => s !== schema));
  };

  const handleUnhideEntity = (entity: HiddenEntity) => {
    onUnhideEntity(entity);
    setEntities(prev => prev.filter(e => e.name !== entity.name || e.schema !== entity.schema));
  };

  const handleUnhideAll = () => {
    onUnhideAll();
    setSchemas([]);
    setEntities([]);
    setSelectedEntities(new Set());
  };

  const handleUnhideSelected = () => {
    const selected = entities.filter(entity => selectedEntities.has(`${entity.name}-${entity.schema || ''}`));
    onUnhideSelected(selected);
    setEntities(prev => prev.filter(entity => !selectedEntities.has(`${entity.name}-${entity.schema || ''}`)));
    setSelectedEntities(new Set());
  };

  const handleEntitySelect = (entity: HiddenEntity) => {
    const key = `${entity.name}-${entity.schema || ''}`;
    const newSelected = new Set(selectedEntities);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedEntities(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedEntities.size === entities.length) {
      setSelectedEntities(new Set());
    } else {
      const allKeys = entities.map(entity => `${entity.name}-${entity.schema || ''}`);
      setSelectedEntities(new Set(allKeys));
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSchemas = schemas.filter(schema =>
    schema.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entity.schema && entity.schema.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleExportHidden = () => {
    onExportHidden();
    setShowMenu(false);
  };

  const handleImportHidden = () => {
    onImportHidden();
    setShowMenu(false);
  };

  const handleBackupHidden = () => {
    onBackupHidden();
    setShowMenu(false);
  };

  const handleRestoreHidden = () => {
    onRestoreHidden();
    setShowMenu(false);
  };

  const handleCloneHidden = () => {
    onCloneHidden();
    setShowMenu(false);
  };

  const handleDeleteHidden = () => {
    onDeleteHidden();
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleClose();
    } else if (e.key === 'Enter' && selectedEntities.size > 0) {
      e.preventDefault();
      handleUnhideSelected();
    }
  };

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <Modal
      className={`vue-dialog beekeeper-modal ${className}`}
      name={modalName}
      onOpened={() => {}}
      onBeforeClose={() => {}}
    >
      <form onKeyDown={handleKeyDown}>
        <div className="dialog-content">
          <div className="dialog-c-title flex flex-middle">
            Hidden Entities
            <button
              type="button"
              className="close-btn btn btn-fab"
              onClick={handleClose}
            >
              <i className="material-icons">clear</i>
            </button>
          </div>

          <div className="modal-form">
            <div className="search-container">
              <input
                type="text"
                className="form-control"
                placeholder="Search hidden entities..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="actions-container">
              <div className="action-buttons">
                <button
                  type="button"
                  className="btn btn-flat"
                  onClick={handleUnhideAll}
                  disabled={schemas.length === 0 && entities.length === 0}
                >
                  Unhide All
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUnhideSelected}
                  disabled={selectedEntities.size === 0}
                >
                  Unhide Selected ({selectedEntities.size})
                </button>
              </div>

              <div className="menu-container">
                <button
                  type="button"
                  className="btn btn-flat btn-icon"
                  onClick={handleMenuToggle}
                  title="Hidden Entities Actions"
                >
                  <i className="material-icons">more_vert</i>
                </button>

                {showMenu && (
                  <div className="hidden-menu">
                    <div className="menu-item" onClick={handleExportHidden}>
                      <i className="material-icons">export</i>
                      <span>Export Hidden</span>
                    </div>

                    <div className="menu-item" onClick={handleImportHidden}>
                      <i className="material-icons">import</i>
                      <span>Import Hidden</span>
                    </div>

                    <div className="menu-item" onClick={handleBackupHidden}>
                      <i className="material-icons">backup</i>
                      <span>Backup Hidden</span>
                    </div>

                    <div className="menu-item" onClick={handleRestoreHidden}>
                      <i className="material-icons">restore</i>
                      <span>Restore Hidden</span>
                    </div>

                    <div className="menu-item" onClick={handleCloneHidden}>
                      <i className="material-icons">content_copy</i>
                      <span>Clone Hidden</span>
                    </div>

                    <div className="menu-divider" />

                    <div className="menu-item danger" onClick={handleDeleteHidden}>
                      <i className="material-icons">delete</i>
                      <span>Delete Hidden</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="list-container">
              {filteredSchemas.length > 0 && (
                <div className="hidden-section">
                  <h4>Hidden Schemas ({filteredSchemas.length})</h4>
                  {filteredSchemas.map((schema, index) => (
                    <div key={schema} className="hidden-list-item">
                      <div>
                        <i
                          title="Schema"
                          className="schema-icon item-icon material-icons"
                        >
                          folder
                        </i>
                        <span>{schema}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleUnhideSchema(schema)}
                        className="btn btn-flat btn-small"
                      >
                        Unhide
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {filteredEntities.length > 0 && (
                <div className="hidden-section">
                  <div className="section-header">
                    <h4>Hidden Entities ({filteredEntities.length})</h4>
                    <button
                      type="button"
                      className="btn btn-flat btn-small"
                      onClick={handleSelectAll}
                    >
                      {selectedEntities.size === entities.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  
                  {filteredEntities.map((entity, index) => {
                    const key = `${entity.name}-${entity.schema || ''}`;
                    const isSelected = selectedEntities.has(key);
                    
                    return (
                      <div
                        key={key}
                        className={`hidden-list-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleEntitySelect(entity)}
                      >
                        <div>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleEntitySelect(entity)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <i
                            title={entity.type === 'table' ? 'Table' : 'Routine'}
                            className={`${entity.type === 'table' ? 'table' : 'routine'}-icon item-icon material-icons`}
                          >
                            {entity.type === 'table' ? 'table_chart' : 'functions'}
                          </i>
                          <span className="entity-name">{entity.name}</span>
                          {entity.schema && (
                            <span className="entity-schema">({entity.schema})</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnhideEntity(entity);
                          }}
                          className="btn btn-flat btn-small"
                        >
                          Unhide
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredSchemas.length === 0 && filteredEntities.length === 0 && (
                <div className="no-hidden-entities">
                  <div className="alert alert-info">
                    <i className="material-icons">info</i>
                    <div>
                      <strong>No hidden entities</strong>
                      <p>All schemas and entities are currently visible.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>,
    document.body
  );
};

export default HiddenEntitiesModal;
