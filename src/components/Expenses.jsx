import React from "react";
import ExpenseCategory from "./expenseCategory";
import { Divider } from "antd";
import ExpenseItems from "./ExpenseItems";

function Expenses() {
  return (
    <div className="w-100 h-100 p-3 ">
     <div className="w-100 h-100 d-flex flex-column">
        <ExpenseCategory className=" overflow-auto" />
        <Divider/>
        {/* <IncomeItems /> */}
        <ExpenseItems/>
      </div>
    </div>
  );
}

export default Expenses;
