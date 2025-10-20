import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tab {
  id: string;
  title: string;
  type: string;
  unsavedText?: string;
  filters?: any;
  [key: string]: any;
}

interface TabsState {
  tabs: Tab[];
  active?: Tab;
  lastClosedTabs: Tab[];
  allTabTypeConfigs: any[];
}

const initialState: TabsState = {
  tabs: [],
  active: undefined,
  lastClosedTabs: [],
  allTabTypeConfigs: [],
};

const tabsSlice = createSlice({
  name: 'tabs',
  initialState,
  reducers: {
    addTab: (state, action: PayloadAction<Tab>) => {
      state.tabs.push(action.payload);
      state.active = action.payload;
    },
    removeTab: (state, action: PayloadAction<string>) => {
      const tabIndex = state.tabs.findIndex(tab => tab.id === action.payload);
      if (tabIndex !== -1) {
        const removedTab = state.tabs[tabIndex];
        state.lastClosedTabs.unshift(removedTab);
        state.tabs.splice(tabIndex, 1);
        
        if (state.active?.id === action.payload) {
          state.active = state.tabs[tabIndex] || state.tabs[tabIndex - 1] || undefined;
        }
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload);
      if (tab) {
        state.active = tab;
      }
    },
    updateTab: (state, action: PayloadAction<{ id: string; updates: Partial<Tab> }>) => {
      const tab = state.tabs.find(tab => tab.id === action.payload.id);
      if (tab) {
        Object.assign(tab, action.payload.updates);
      }
    },
    clearLastClosedTabs: (state) => {
      state.lastClosedTabs = [];
    },
  },
});

export const { addTab, removeTab, setActiveTab, updateTab, clearLastClosedTabs } = tabsSlice.actions;
export default tabsSlice.reducer;
