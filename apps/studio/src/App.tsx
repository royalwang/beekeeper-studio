import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import Titlebar from './components/Titlebar';
import CoreInterface from './components/CoreInterface';
import ConnectionInterface from './components/ConnectionInterface';
import AutoUpdater from './components/AutoUpdater';
import StateManager from './components/quicksearch/StateManager';
import DataManager from './components/data/DataManager';
import ConfigurationWarningModal from './components/ConfigurationWarningModal';
import WorkspaceCreateModal from './components/data/WorkspaceCreateModal';
import WorkspaceRenameModal from './components/data/WorkspaceRenameModal';
import WorkspaceSignInModal from './components/data/WorkspaceSignInModal';
import ImportQueriesModal from './components/ImportQueriesModal';
import ImportConnectionsModal from './components/ImportConnectionsModal';
import EnterLicenseModal from './components/EnterLicenseModal';
import TrialExpiredModal from './components/TrialExpiredModal';
import LicenseExpiredModal from './components/LicenseExpiredModal';
import LifetimeLicenseExpiredModal from './components/LifetimeLicenseExpiredModal';
import PluginManagerModal from './components/plugins/PluginManagerModal';
import ConfirmationModalManager from './components/ConfirmationModalManager';
import Dropzone from './components/Dropzone';
import LockManager from './components/LockManager';
import UtilDiedModal from './components/UtilDiedModal';
import PluginController from './components/plugins/PluginController';
import UpgradeRequiredModal from './components/UpgradeRequiredModal';
import NotificationManager from './components/NotificationManager';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const storeInitialized = useSelector((state: RootState) => state.global.storeInitialized);
  const connected = useSelector((state: RootState) => state.global.connected);
  const database = useSelector((state: RootState) => state.global.database);
  const licensesInitialized = useSelector((state: RootState) => state.licenses.initialized);

  useEffect(() => {
    // Initialize the app
    dispatch({ type: 'global/setStoreInitialized', payload: true });
  }, [dispatch]);

  const handleDatabaseSelected = (database: any) => {
    dispatch({ type: 'global/setDatabase', payload: database });
  };

  return (
    <div className="style-wrapper">
      <div className="beekeeper-studio-wrapper">
        <Titlebar />
        {storeInitialized && (
          <>
            {!connected ? (
              <ConnectionInterface />
            ) : (
              <CoreInterface onDatabaseSelected={handleDatabaseSelected} />
            )}
            <AutoUpdater />
            <StateManager />
            <NotificationManager />
            <UpgradeRequiredModal />
          </>
        )}
      </div>
      
      {/* Portal targets for modals */}
      <div id="menus" />
      <div id="modals" />
      
      <Dropzone />
      <DataManager />
      <ConfigurationWarningModal />
      <EnterLicenseModal />
      <WorkspaceSignInModal />
      <WorkspaceCreateModal />
      <WorkspaceRenameModal />
      <ImportQueriesModal />
      <ImportConnectionsModal />
      <PluginController />
      <PluginManagerModal />
      <ConfirmationModalManager />
      <LockManager />
      <UtilDiedModal />
      
      {licensesInitialized && (
        <>
          <TrialExpiredModal />
          <LicenseExpiredModal />
          <LifetimeLicenseExpiredModal />
        </>
      )}
    </div>
  );
};

export default App;
