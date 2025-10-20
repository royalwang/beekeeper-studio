import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slice reducers
import settingsReducer from './slices/settingsSlice';
import tabsReducer from './slices/tabsSlice';
import sidebarReducer from './slices/sidebarSlice';
import exportsReducer from './slices/exportsSlice';
import pinsReducer from './slices/pinsSlice';
import searchReducer from './slices/searchSlice';
import licensesReducer from './slices/licensesSlice';
import credentialsReducer from './slices/credentialsSlice';
import hideEntitiesReducer from './slices/hideEntitiesSlice';
import userEnumsReducer from './slices/userEnumsSlice';
import pinnedConnectionsReducer from './slices/pinnedConnectionsSlice';
import multiTableExportsReducer from './slices/multiTableExportsSlice';
import importsReducer from './slices/importsSlice';
import backupsReducer from './slices/backupsSlice';
import popupMenuReducer from './slices/popupMenuSlice';
import menuBarReducer from './slices/menuBarSlice';

// Root state interface
export interface RootState {
  settings: any;
  tabs: any;
  sidebar: any;
  exports: any;
  pins: any;
  search: any;
  licenses: any;
  credentials: any;
  hideEntities: any;
  userEnums: any;
  pinnedConnections: any;
  multiTableExports: any;
  imports: any;
  backups: any;
  popupMenu: any;
  menuBar: any;
  // Global state
  connection: any;
  usedConfig: any;
  server: any;
  connected: boolean;
  connectionType: any;
  supportedFeatures: any;
  database: any;
  databaseList: string[];
  tables: any[];
  routines: any[];
  entityFilter: any;
  columnsLoading: any;
  tablesLoading: any;
  tablesInitialLoaded: boolean;
  username: any;
  menuActive: boolean;
  activeTab: any;
  selectedSidebarItem: any;
  workspaceId: number;
  storeInitialized: boolean;
  windowTitle: string;
  defaultSchema: any;
  versionString: any;
  connError: any;
  expandFKDetailsByDefault: boolean;
  namespace: any;
  namespaceList: string[];
  pluginManagerStatus: string;
}

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['settings', 'tabs', 'sidebar', 'pins', 'pinnedConnections']
};

// Global state reducer
const globalStateReducer = (state = {
  connection: null,
  usedConfig: null,
  server: null,
  connected: false,
  connectionType: null,
  supportedFeatures: null,
  database: null,
  databaseList: [],
  tables: [],
  routines: [],
  entityFilter: {
    filterQuery: undefined,
    showTables: true,
    showRoutines: true,
    showViews: true,
    showPartitions: false
  },
  columnsLoading: null,
  tablesLoading: null,
  tablesInitialLoaded: false,
  username: null,
  menuActive: false,
  activeTab: null,
  selectedSidebarItem: null,
  workspaceId: 1,
  storeInitialized: false,
  windowTitle: 'Beekeeper Studio',
  defaultSchema: null,
  versionString: null,
  connError: null,
  expandFKDetailsByDefault: false,
  namespace: null,
  namespaceList: [],
  pluginManagerStatus: "initializing",
}, action: any) => {
  switch (action.type) {
    case 'global/setConnected':
      return { ...state, connected: action.payload };
    case 'global/setDatabase':
      return { ...state, database: action.payload };
    case 'global/setStoreInitialized':
      return { ...state, storeInitialized: action.payload };
    default:
      return state;
  }
};

// Combine reducers
const rootReducer = combineReducers({
  settings: settingsReducer,
  tabs: tabsReducer,
  sidebar: sidebarReducer,
  exports: exportsReducer,
  pins: pinsReducer,
  search: searchReducer,
  licenses: licensesReducer,
  credentials: credentialsReducer,
  hideEntities: hideEntitiesReducer,
  userEnums: userEnumsReducer,
  pinnedConnections: pinnedConnectionsReducer,
  multiTableExports: multiTableExportsReducer,
  imports: importsReducer,
  backups: backupsReducer,
  popupMenu: popupMenuReducer,
  menuBar: menuBarReducer,
  global: globalStateReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Persistor
export const persistor = persistStore(store);

// Export types
export type AppDispatch = typeof store.dispatch;
export type AppThunk = any;