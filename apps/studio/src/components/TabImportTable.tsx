import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Stepper from './stepper/Stepper';
import ImportFile from './importtable/ImportFile';
import ImportTable from './importtable/ImportTable';
import ImportMapper from './importtable/ImportMapper';
import ImportPreview from './importtable/ImportPreview';
import StatusBar from './common/StatusBar';
import { DialectTitles } from '@shared/lib/dialects/models';

interface TabImportTableProps {
  schema?: string;
  table?: string;
  tab: any;
  active: boolean;
}

const TabImportTable: React.FC<TabImportTableProps> = ({
  table = '',
  tab,
  active
}) => {
  const [importStarted, setImportStarted] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const isCommunity = useSelector((state: any) => state.settings?.isCommunity);
  const usedConfig = useSelector((state: any) => state.connection?.usedConfig);
  const dialectTitle = usedConfig ? DialectTitles[usedConfig.connectionType] : '';

  const isSupported = useCallback(() => {
    // Mock implementation - in a real app, this would check if the dialect supports import
    const supportedDialects = ['mysql', 'postgresql', 'sqlite'];
    return usedConfig && supportedDialects.includes(usedConfig.connectionType);
  }, [usedConfig]);

  const importSteps = [
    { id: 'file', title: 'Select File', component: ImportFile },
    { id: 'table', title: 'Choose Table', component: ImportTable },
    { id: 'mapper', title: 'Map Columns', component: ImportMapper },
    { id: 'preview', title: 'Preview', component: ImportPreview },
  ];

  const getProgressIcon = () => {
    if (importError) return 'error';
    if (isSpinning) return 'sync';
    return 'check_circle';
  };

  const getProgressTitle = () => {
    if (importError) return 'Import Failed';
    if (isSpinning) return 'Importing...';
    return 'Import Complete';
  };

  const handleImport = useCallback(async () => {
    setImportStarted(true);
    setIsSpinning(true);
    
    try {
      // Mock import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTimer(Date.now());
      setIsSpinning(false);
    } catch (error) {
      setImportError('Import failed');
      setIsSpinning(false);
    }
  }, []);

  const closeTab = useCallback(() => {
    // Mock close tab functionality
    console.log('Closing import tab');
  }, []);

  const openTable = useCallback(() => {
    // Mock open table functionality
    console.log('Opening table:', table);
  }, [table]);

  const portalName = `import-table-${tab.id}`;

  if (!isSupported()) {
    return (
      <div className="tab-content">
        <div className="not-supported">
          <p>
            Beekeeper does not currently support Import from File for {dialectTitle} ☹️
          </p>
        </div>
      </div>
    );
  }

  if (isCommunity) {
    return (
      <div className="tab-upsell-wrapper">
        <div className="upsell-content">
          <h3>Upgrade Required</h3>
          <p>This feature is available in the Pro version.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="import-table-container">
        {!importStarted && (
          <Stepper
            steps={importSteps}
            wrapperClass="import-export-wrapper"
            onFinished={handleImport}
          />
        )}
        
        {importStarted && (
          <div className="import-table-wrapper import-progress">
            <div className="import-progress-wrapper flex-col">
              <i className={`material-icons loading-icon ${importError ? 'error' : ''} ${isSpinning ? 'spinning' : ''}`}>
                {getProgressIcon()}
              </i>
              <div className="text-2x">
                {getProgressTitle()}
              </div>
            </div>
            
            {timer !== null && importError === null && (
              <div className="import-cta-button-wrapper">
                <button
                  type="button"
                  onClick={closeTab}
                  className="btn btn-flat close-tab-btn"
                >
                  Close Tab
                </button>
                <button
                  type="button"
                  onClick={openTable}
                  className="btn btn-primary open-table-btn"
                >
                  Open Table
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <StatusBar
        active={active}
      />
    </div>
  );
};

export default TabImportTable;
