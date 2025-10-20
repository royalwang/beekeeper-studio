import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import TabQueryEditor from './TabQueryEditor';

const CoreTabs: React.FC = () => {
  const dispatch = useDispatch();
  const tabs = useSelector((state: RootState) => state.tabs.tabs);
  const activeTab = useSelector((state: RootState) => state.tabs.active);

  const createQuery = () => {
    const newTab = {
      id: `query-${Date.now()}`,
      title: 'New Query',
      type: 'query',
      unsavedText: '',
    };
    dispatch({ type: 'tabs/addTab', payload: newTab });
  };

  const closeTab = (tabId: string) => {
    dispatch({ type: 'tabs/removeTab', payload: tabId });
  };

  const selectTab = (tabId: string) => {
    dispatch({ type: 'tabs/setActiveTab', payload: tabId });
  };

  return (
    <div className="core-tabs">
      <div className="tabs-header">
        <ul className="nav-tabs nav">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`nav-item ${activeTab?.id === tab.id ? 'active' : ''}`}
              onClick={() => selectTab(tab.id)}
            >
              <span className="nav-link">{tab.title}</span>
              <button
                className="close-tab"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
              >
                <i className="material-icons">close</i>
              </button>
            </li>
          ))}
        </ul>
        <div className="actions add-tab-group">
          <button
            className="btn-fab add-query"
            onClick={createQuery}
            title="New Query"
          >
            <i className="material-icons">add</i>
          </button>
        </div>
      </div>
      
      <div className="tabs-content">
        {activeTab && (
          <div className="tab-pane active">
            {activeTab.type === 'query' ? (
              <TabQueryEditor 
                query={activeTab} 
                onClose={() => closeTab(activeTab.id)}
              />
            ) : (
              <div className="tab-content-placeholder">
                <h3>{activeTab.title}</h3>
                <p>Tab content for {activeTab.type} will be implemented here.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoreTabs;
