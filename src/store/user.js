import { createSlice } from "@reduxjs/toolkit";

const initialUserState = {
  profilePicURI: localStorage.getItem("profilePicURI") || "",
  userName: localStorage.getItem("userName") || "",
  codeforcesRanking: localStorage.getItem("codeforcesRanking") || "0",
  atcoderRanking: localStorage.getItem("atcoderRanking") || "0",
  codechefRanking: localStorage.getItem("codechefRanking") || "0",
  spojRanking: localStorage.getItem("spojRanking") || "0",
  uvaAvgDacu: localStorage.getItem("uvaAvgDacu") || "0",
};

const userSlice = createSlice({
  name: "userInfos",
  initialState: initialUserState,
  reducers: {
    setProfilePicURI(state, action) {
      localStorage.setItem("profilePicURI", action.payload);
      state.profilePicURI = action.payload;
    },
    setUserName(state, action) {
      localStorage.setItem("userName", action.payload);
      state.userName = action.payload;
    },
    setCodeforcesRanking(state, action) {
      localStorage.setItem("codeforcesRanking", action.payload);
      state.codeforcesRanking = action.payload;
    },
    setAtcoderRanking(state, action) {
      localStorage.setItem("atcoderRanking", action.payload);
      state.atcoderRanking = action.payload;
    },
    setCodechefRanking(state, action) {
      localStorage.setItem("codechefRanking", action.payload);
      state.codechefRanking = action.payload;
    },
    setSpojRanking(state, action) {
      localStorage.setItem("spojRanking", action.payload);
      state.spojRanking = action.payload;
    },
    setUvaAvgDacu(state, action) {
      localStorage.setItem("uvaAvgDacu", action.payload);
      state.uvaAvgDacu = action.payload;
    },
    clearUserInfo(state) {
      state.profilePicURI = "";
      localStorage.removeItem("profilePicURI");
      state.userName = "";
      localStorage.removeItem("userName");
      state.codeforcesRanking = "0";
      localStorage.removeItem("codeforcesRanking");
      state.atcoderRanking = "0";
      localStorage.removeItem("atcoderRanking");
      state.codechefRanking = "0";
      localStorage.removeItem("codechefRanking");
      state.spojRanking = "0";
      localStorage.removeItem("spojRanking");
      state.uvaAvgDacu = "0";
      localStorage.removeItem("uvaAvgDacu");
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
