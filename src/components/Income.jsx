import React, { useEffect } from "react";
import { MDBCard } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import {
  getIncomeSourceList,
  getIncomeItemsList,
} from "./../redux/incomeSlice";
import IncomeSource from "./IncomeSource";

function Income() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(1);
    if (!income.success && income.error === null) {
      dispatch(getIncomeSourceList());
      dispatch(getIncomeItemsList());
    }
  }, [dispatch, income.sucess]);

  return (
    <MDBCard className="w-100 h-100 p-3 d-flex flex-column overflow-hidden">
      <h1>Income</h1>

      <div className="w-100 h-100 d-flex flex-column">
        <IncomeSource className=" overflow-auto" />
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
      </div>
    </MDBCard>
  );
}

export default Income;
