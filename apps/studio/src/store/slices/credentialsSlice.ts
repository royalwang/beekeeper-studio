import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add credentials-related state here
};

const credentialsSlice = createSlice({
  name: 'credentials',
  initialState,
  reducers: {
    // Add credentials-related reducers here
  },
});

export default credentialsSlice.reducer;
