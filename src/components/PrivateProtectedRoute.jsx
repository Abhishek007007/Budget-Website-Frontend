import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { getBudget } from "../redux/budgetSlice";
import {
  getExpenseCategoryList,
  getExpenseItemsList,
} from "../redux/expenseSlice";
import { getExpenses } from "../redux/groupSlice";
import { getIncomeItemsList } from "../redux/incomeSlice";
import { getTransactions } from "../redux/transactionSlice";

function PrivateProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  useEffect(() => {}, [auth.loading]);

  const dispatch = useDispatch();

  if (auth.user !== null) {
    dispatch(getTransactions());
    dispatch(getExpenseCategoryList());
    dispatch(getExpenseItemsList());
    dispatch(getBudget());
    dispatch(getIncomeItemsList());
    dispatch(getIncomeItemsList());
    return children;
  }

  if (auth.loading) {
    return <h1>Loading</h1>;
  }

  return <Navigate to="/login" />;
}

export default PrivateProtectedRoute;
