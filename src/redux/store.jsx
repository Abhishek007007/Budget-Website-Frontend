import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import incomeReducer from "./incomeSlice";
import expenseReducer from "./expenseSlice";
import transactionReducer from "./transactionSlice";
import budgetReducer from './budgetSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    income: incomeReducer,
    expense: expenseReducer,
    transactions: transactionReducer,
    budget: budgetReducer
  },
});
