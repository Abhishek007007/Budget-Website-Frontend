import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import { useSelector } from "react-redux";

const WeekViewCalendar = () => {
  const transactions = useSelector(
    (state) => state.transactions.transactionsList
  );
  const [startDate, setStartDate] = useState(new Date());

  // Function to get the week starting from the selected date
  const getWeekDays = (start) => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);

      const dayTransaction = transactions.filter(
        (transaction) => transaction.date === day.toISOString().slice(0, 10)
      );

      const dayTransactionIncome = dayTransaction.filter(
        (transaction) => transaction.type === "income"
      );

      const dayTransactionExpense = dayTransaction.filter(
        (transaction) => transaction.type === "expense"
      );

      let income = dayTransactionIncome.reduce(
        (acc, transaction) => acc + parseFloat(transaction.amount),
        0
      );
      let expense = dayTransactionExpense.reduce(
        (acc, transaction) => acc + parseFloat(transaction.amount),
        0
      );
      income = Math.round(income);
      expense = Math.round(expense);

      weekDays.push({ day, income, expense });
    }
    return weekDays;
  };

  const weekDays = getWeekDays(startDate);

  // Functions to shift week by 7 days forward or backward
  const shiftWeek = (direction) => {
    const newDate = new Date(startDate);
    newDate.setDate(startDate.getDate() + direction * 7);
    setStartDate(newDate);
  };

  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      {/* Navigation Controls */}
      <div
        className="py-2"
        style={{
          marginBottom: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <button
          className="btn btn-light"
          onClick={() => shiftWeek(-1)}
          style={{ marginRight: "20px" }}
        >
          <LeftOutlined />
        </button>

        {/* Display current month and year */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="MMMM yyyy"
          showMonthYearPicker
          customInput={
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {startDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </div>
          }
        />

        <button
          className="btn btn-light"
          onClick={() => shiftWeek(1)}
          style={{ marginLeft: "20px" }}
        >
          <RightOutlined />
        </button>
      </div>

      {/* Display the selected week */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        {weekDays.map(({ day, income, expense }, index) => (
          <div
            key={index}
            style={{
              padding: "10px",
              borderRadius: "8px",
              width: "13%",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              placeItems: "center",

              backgroundColor:
                day.toDateString() === new Date().toDateString()
                  ? "#e6f7ff"
                  : "#f0f0f0",
              color:
                day.toDateString() === new Date().toDateString()
                  ? "#1890ff"
                  : "#000",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div style={{ fontSize: "18px" }}>{day.getDate()}</div>
            <div className="d-flex flex-column justify-content-end">
              {income !== 0 ? (
                <div className="text-primary">{income}</div>
              ) : (
                <></>
              )}
              {expense !== 0 ? (
                <div className="text-danger">{expense}</div>
              ) : (
                <></>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekViewCalendar;
