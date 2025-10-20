import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Add user enums-related state here
};

const userEnumsSlice = createSlice({
  name: 'userEnums',
  initialState,
  reducers: {
    // Add user enums-related reducers here
  },
});

export default userEnumsSlice.reducer;
