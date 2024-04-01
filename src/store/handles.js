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
      localStorage.setItem("codeforcesHandle", action.payload);
      state.codeforcesHandle = action.payload;
    },
    setAtcoderHandle(state, action) {
      localStorage.setItem("atcoderHandle", action.payload);
      state.atcoderHandle = action.payload;
    },
    setUvaHandle(state, action) {
      localStorage.setItem("uvaHandle", action.payload);
      state.uvaHandle = action.payload;
    },
    setSpojHandle(state, action) {
      localStorage.setItem("spojHandle", action.payload);
      state.spojHandle = action.payload;
    },
    setCodechefHandle(state, action) {
      localStorage.setItem("codechefHandle", action.payload);
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
