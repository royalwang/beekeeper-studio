import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add pinned connections-related state here
};

const pinnedConnectionsSlice = createSlice({
  name: 'pinnedConnections',
  initialState,
  reducers: {
    // Add pinned connections-related reducers here
  },
});

export default pinnedConnectionsSlice.reducer;
