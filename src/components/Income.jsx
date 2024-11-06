import React, { useEffect } from "react";
import { MDBCard } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import {
  getIncomeSourceList,
  getIncomeItemsList,
} from "./../redux/incomeSlice";
import IncomeSource from "./IncomeSource";
import IncomeItems from "./IncomeItems";
import { Divider } from "antd";

function Income() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!income.success && income.error === null) {
      dispatch(getIncomeSourceList());
      dispatch(getIncomeItemsList());
    }
  }, [dispatch, income.sucess]);

  return (
    <MDBCard className="w-100 h-100 p-3 d-flex flex-column overflow-hidden">
      <div className="w-100 h-100 d-flex flex-column">
        <IncomeSource className=" overflow-auto" />
        <Divider/>
        <IncomeItems />
      </div>
    </MDBCard>
  );
}

export default Income;