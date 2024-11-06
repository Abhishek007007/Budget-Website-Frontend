import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import incomeReducer from "./incomeSlice";
import expenseReducer from './expenseSlice'
import transactionReducer from './transactionSlice'

export default configureStore({
  reducer: { auth: authReducer, income: incomeReducer, expense : expenseReducer, transactions: transactionReducer, },
});
