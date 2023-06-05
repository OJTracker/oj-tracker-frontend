import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  codeforcesHandle: localStorage.getItem("codeforcesHandle") || "",
  atcoderHandle: localStorage.getItem("atcoderHandle") || "",
  uvaHandle: localStorage.getItem("uvaHandle") || "",
  spojHandle: localStorage.getItem("spojHandle") || "",
  codechefHandle: localStorage.getItem("codechefHandle") || "",
};

const userSlice = createSlice({
  name: "userHandles",
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
    setSpojHandle(state, action) {
      state.spojHandle = action.payload;
    },
    setCodechefHandle(state, action) {
      state.codechefHandle = action.payload;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
