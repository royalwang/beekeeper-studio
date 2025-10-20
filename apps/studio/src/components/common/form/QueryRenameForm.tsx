import React, { useState, useRef, useEffect } from 'react';

interface QueryRenameFormProps {
  query: any;
  onSave: (newTitle: string) => Promise<void>;
  onCancel: () => void;
  className?: string;
}

const QueryRenameForm: React.FC<QueryRenameFormProps> = ({
  query,
  onSave,
  onCancel,
  className = '',
}) => {
  const [title, setTitle] = useState(query.title || '');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(query.title || '');
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setWorking(true);

    try {
      await onSave(title);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save query title');
    } finally {
      setWorking(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div className={`query-rename-form ${className}`}>
      <form onSubmit={handleSubmit}>
        {saveError && (
          <div className="alert alert-danger save-errors">
            <i className="material-icons">error_outline</i>
            <div>{saveError}</div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">Query Title</label>
          <input
            ref={inputRef}
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="form-control"
            name="title"
            placeholder="Enter query title"
            disabled={working}
          />
          <small className="form-text text-muted">
            Choose a descriptive name for your query
          </small>
        </div>

        <div className="buttons">
          <button
            className="btn btn-flat"
            type="button"
            onClick={handleCancel}
            disabled={working}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={working || !title.trim()}
          >
            {working ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryRenameForm;
