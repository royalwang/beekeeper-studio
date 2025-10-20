import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add pins-related state here
};

const pinsSlice = createSlice({
  name: 'pins',
  initialState,
  reducers: {
    // Add pins-related reducers here
  },
});

export default pinsSlice.reducer;
