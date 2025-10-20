import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import Sidebar from './common/Sidebar';
import CoreSidebar from './sidebar/CoreSidebar';
import SecondarySidebar from './sidebar/SecondarySidebar';
import GlobalSidebar from './sidebar/GlobalSidebar';
import CoreTabs from './CoreTabs';
import ExportManager from './export/ExportManager';
import QuickSearch from './quicksearch/QuickSearch';
import ProgressBar from './editor/ProgressBar';
import LostConnectionModal from './LostConnectionModal';
import GlobalStatusBar from './GlobalStatusBar';
import RenameDatabaseElementModal from './common/modals/RenameDatabaseElementModal';

interface CoreInterfaceProps {
  onDatabaseSelected: (database: any) => void;
}

const CoreInterface: React.FC<CoreInterfaceProps> = ({ onDatabaseSelected }) => {
  const dispatch = useDispatch();
  const minimalMode = useSelector((state: RootState) => state.global.minimalMode);
  const initializing = useSelector((state: RootState) => state.global.initializing);
  const primarySidebarOpen = useSelector((state: RootState) => state.sidebar.primarySidebarOpen);
  const secondarySidebarOpen = useSelector((state: RootState) => state.sidebar.secondarySidebarOpen);
  const globalSidebarActiveItem = useSelector((state: RootState) => state.sidebar.globalSidebarActiveItem);
  
  const [quickSearchShown, setQuickSearchShown] = useState(false);
  const [primarySidebarWidth, setPrimarySidebarWidth] = useState(0);
  const [globalSidebarWidth, setGlobalSidebarWidth] = useState(0);
  
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondarySidebarRef = useRef<HTMLDivElement>(null);
  const globalSidebarRef = useRef<HTMLDivElement>(null);

  const handleSelectGlobalSidebarItem = (item: string) => {
    dispatch({ type: 'sidebar/setGlobalSidebarActiveItem', payload: item });
  };

  const handleToggleOpenPrimarySidebar = (open: boolean) => {
    dispatch({ type: 'sidebar/setPrimarySidebarOpen', payload: open });
  };

  const handleToggleOpenSecondarySidebar = (open: boolean) => {
    dispatch({ type: 'sidebar/setSecondarySidebarOpen', payload: open });
  };

  const showQuickSearch = () => {
    setQuickSearchShown(true);
  };

  const handleDatabaseSelected = (database: any) => {
    onDatabaseSelected(database);
  };

  return (
    <div id="interface" className="interface">
      {initializing ? (
        <ProgressBar />
      ) : (
        <div className="interface-wrap row" ref={splitContainerRef}>
          {!minimalMode && (
            <GlobalSidebar
              ref={globalSidebarRef}
              onSelect={handleSelectGlobalSidebarItem}
              activeItem={globalSidebarActiveItem}
            />
          )}

          <Sidebar ref={sidebarRef} className="primary-sidebar">
            <CoreSidebar onDatabaseSelected={handleDatabaseSelected} />
          </Sidebar>

          <div
            ref={contentRef}
            className="page-content flex-col main-content"
            id="page-content"
          >
            <CoreTabs />
          </div>

          <SecondarySidebar
            ref={secondarySidebarRef}
            onClose={() => handleToggleOpenSecondarySidebar(false)}
          />
        </div>
      )}
      
      <GlobalStatusBar
        connectionButtonWidth={primarySidebarWidth}
        connectionButtonIconWidth={globalSidebarWidth}
      />
      
      {quickSearchShown && (
        <QuickSearch onClose={() => setQuickSearchShown(false)} />
      )}
      
      <ExportManager />
      <LostConnectionModal />
      <RenameDatabaseElementModal />
    </div>
  );
};

export default CoreInterface;
