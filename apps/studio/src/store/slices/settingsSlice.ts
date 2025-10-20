import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  settings: Record<string, any>;
  initialized: boolean;
  privacyMode: boolean;
}

const initialState: SettingsState = {
  settings: {},
  initialized: false,
  privacyMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    replaceSettings: (state, action: PayloadAction<any[]>) => {
      const grouped = action.payload.reduce((acc, setting) => {
        acc[setting.key] = setting;
        return acc;
      }, {} as Record<string, any>);
      state.settings = grouped;
    },
    addSetting: (state, action: PayloadAction<any>) => {
      state.settings[action.payload.key] = action.payload;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
    setPrivacyMode: (state, action: PayloadAction<boolean>) => {
      state.privacyMode = action.payload;
    },
  },
});

export const { replaceSettings, addSetting, setInitialized, setPrivacyMode } = settingsSlice.actions;
export default settingsSlice.reducer;
