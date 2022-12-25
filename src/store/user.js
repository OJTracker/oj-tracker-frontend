import { createSlice } from '@reduxjs/toolkit';

const initialUserState = {
  codeforcesHandle: localStorage.getItem("codeforcesHandle") || "",
  atcoderHandle: localStorage.getItem("atcoderHandle") || "",
  uvaHandle: localStorage.getItem("uvaHandle") || "",
};

const userSlice = createSlice({
  name: 'userHandles',
  initialState: initialUserState,
  reducers: {
    setCodeforcesHandle(state, action) {
      state.codeforcesHandle = action.payload;
    },
    setAtcoderHandle(state, action) {
      state.atcoderHandle = action.payload;
    },
    setUvaHandle(state, action) {
      state.uvaHandle = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;