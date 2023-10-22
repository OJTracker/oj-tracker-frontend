import { createSlice } from "@reduxjs/toolkit";

const initialHandlesState = {
  codeforcesHandle: localStorage.getItem("codeforcesHandle") || "",
  atcoderHandle: localStorage.getItem("atcoderHandle") || "",
  uvaHandle: localStorage.getItem("uvaHandle") || "",
  spojHandle: localStorage.getItem("spojHandle") || "",
  codechefHandle: localStorage.getItem("codechefHandle") || "",
};

const handleSlice = createSlice({
  name: "userHandles",
  initialState: initialHandlesState,
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
    clearHandles(state) {
      state.codeforcesHandle = "";
      localStorage.removeItem("codeforcesHandle");
      state.atcoderHandle = "";
      localStorage.removeItem("atcoderHandle");
      state.uvaHandle = "";
      localStorage.removeItem("uvaHandle");
      state.spojHandle = "";
      localStorage.removeItem("spojHandle");
      state.codechefHandle = "";
      localStorage.removeItem("codechefHandle");
    },
  },
});

export const handleActions = handleSlice.actions;

export default handleSlice.reducer;
