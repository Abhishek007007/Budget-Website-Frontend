import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import incomeReducer from "./incomeSlice";

export default configureStore({
  reducer: { auth: authReducer, income: incomeReducer },
});
