import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeSource } from "./../redux/incomeSlice";

function IncomeItems() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  useEffect(() => {}, [income.incomeItemsList]);

  return (
    <div className="w-100 h-100">
      <h2>Income Items</h2>
      {income.incomeItemsList.length > 0 ? (
        <table>
          <tr>
            <th>source</th>
            <th>amount</th>
            <th>description</th>
            <th>date</th>
          </tr>
          {income.incomeItemsList.map((val, idx) => {
            return (
              <tr key={idx}>
                <td>{val.source}</td>
                <td>{val.amount}</td>
                <td>{val.description}</td>
                <td>{val.date}</td>
              </tr>
            );
          })}
        </table>
      ) : (
        <></>
      )}
    </div>
  );
}

export default IncomeItems;
