import React, { forwardRef, useState } from 'react';

interface EditorModalProps {
  onSave: (data: any) => void;
  binaryEncoding?: string;
}

const EditorModal = forwardRef<HTMLDivElement, EditorModalProps>(({ 
  onSave, 
  binaryEncoding = 'base64' 
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const openModal = (data: any) => {
    setEditData(data);
    setFormData({ ...data });
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditData(null);
    setFormData({});
  };

  const handleSave = () => {
    onSave(formData);
    closeModal();
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div ref={ref} className="editor-modal">
      {isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Row</h3>
              <button className="close-btn" onClick={closeModal}>
                <i className="material-icons">close</i>
              </button>
            </div>
            
            <div className="modal-body">
              {editData && Object.keys(editData).map((field) => (
                <div key={field} className="form-group">
                  <label htmlFor={field}>{field}</label>
                  <input
                    id={field}
                    type="text"
                    className="form-control"
                    value={formData[field] || ''}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

EditorModal.displayName = 'EditorModal';

export default EditorModal;
