import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SidebarState {
  primarySidebarOpen: boolean;
  primarySidebarSize: number;
  secondarySidebarOpen: boolean;
  secondarySidebarSize: number;
  globalSidebarActiveItem: "tables" | "history" | "queries";
}

const initialState: SidebarState = {
  primarySidebarOpen: true,
  primarySidebarSize: 300,
  secondarySidebarOpen: false,
  secondarySidebarSize: 300,
  globalSidebarActiveItem: "tables",
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setPrimarySidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.primarySidebarOpen = action.payload;
    },
    setPrimarySidebarSize: (state, action: PayloadAction<number>) => {
      state.primarySidebarSize = action.payload;
    },
    setSecondarySidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.secondarySidebarOpen = action.payload;
    },
    setSecondarySidebarSize: (state, action: PayloadAction<number>) => {
      state.secondarySidebarSize = action.payload;
    },
    setGlobalSidebarActiveItem: (state, action: PayloadAction<"tables" | "history" | "queries">) => {
      state.globalSidebarActiveItem = action.payload;
    },
  },
});

export const {
  setPrimarySidebarOpen,
  setPrimarySidebarSize,
  setSecondarySidebarOpen,
  setSecondarySidebarSize,
  setGlobalSidebarActiveItem,
} = sidebarSlice.actions;
export default sidebarSlice.reducer;
