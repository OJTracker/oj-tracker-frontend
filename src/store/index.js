import { configureStore } from "@reduxjs/toolkit";
import handlesReducer from "./handles";
import userReducer from "./user";

const store = configureStore({
  reducer: { user: userReducer, handles: handlesReducer },
});

export default store;
