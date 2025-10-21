import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

interface Warning {
  type: string;
  sourceName: string;
  path: string;
  section: string;
}

interface GroupedWarnings {
  [key: string]: Warning[];
}

const ConfigurationWarningModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [groupedWarnings, setGroupedWarnings] = useState<GroupedWarnings>({});
  
  const warnings = useSelector((state: any) => state.config?.warnings || []);

  useEffect(() => {
    if (warnings.length > 0) {
      const grouped = warnings.reduce((acc: GroupedWarnings, warning: Warning) => {
        if (!acc[warning.type]) {
          acc[warning.type] = [];
        }
        acc[warning.type].push(warning);
        return acc;
      }, {});
      
      setGroupedWarnings(grouped);
      setIsVisible(true);
    }
  }, [warnings]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  const modalContent = (
    <div className="vue-dialog beekeeper-modal">
      <div className="dialog-content">
        <div className="dialog-c-title">
          <i className="material-icons alert-warning">warning</i>
          Configuration Warnings
        </div>
        <div className="alert config-modal-warnings">
          {groupedWarnings['unrecognized-key'] && (
            <div>
              <span>Unrecognized keys</span>
              <ul>
                {groupedWarnings['unrecognized-key'].map((warning, index) => (
                  <li key={`${warning.sourceName}-${warning.path}-${warning.section}-${index}`}>
                    {warning.section === warning.path ? (
                      <span style={{ fontWeight: 'bold' }}>[{warning.section}]</span>
                    ) : (
                      <>
                        <span style={{ fontWeight: 'bold' }}>{warning.path}</span> at
                        <span style={{ fontWeight: 'bold' }}>[{warning.section}]</span>
                      </>
                    )}
                    in {warning.sourceName} config.
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {groupedWarnings['system-user-conflict'] && (
            <div>
              <span>
                System settings can't be overridden. The following keys are
                ignored:
              </span>
              <ul>
                {groupedWarnings['system-user-conflict'].map((warning, index) => (
                  <li key={`${warning.sourceName}-${warning.path}-${warning.section}-${index}`}>
                    <span style={{ fontWeight: 'bold' }}>{warning.path}</span> at
                    <span style={{ fontWeight: 'bold' }}>[{warning.section}]</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="vue-dialog-buttons">
        <button
          className="btn btn-flat"
          type="button"
          onClick={handleClose}
          autoFocus
        >
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('modals') || document.body);
};

export default ConfigurationWarningModal;
