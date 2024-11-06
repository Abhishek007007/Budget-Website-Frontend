import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeSource } from "./../redux/incomeSlice";

function IncomeSource() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  const [isAddingSource, setIsAddingSource] = useState(false);
  const [newIcomeSource, setNewIncomeSource] = useState("");

  function handleAddIncomeSource(e) {
    e.preventDefault();
    dispatch(postIncomeSource(newIcomeSource));
    setNewIncomeSource("");
    setIsAddingSource(false);
  }

  useEffect(() => {}, [income.incomeSourceList]);

  return (
    <div className="w-100 h-25 d-flex flex-column ">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center">
        <h2>Income Sources</h2>
        <button
          onClick={() => {
            setIsAddingSource(true);
          }}
          className="btn"
        >
          Add Income Source
        </button>
      </div>
      {isAddingSource ? (
        <form>
          <input
            type="text"
            className="form-control"
            value={newIcomeSource}
            onChange={(e) => setNewIncomeSource(e.target.value)}
          />
          <div>
            <button type="submit" onClick={handleAddIncomeSource}>
              Add
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setNewIncomeSource("");
                setIsAddingSource(false);
              }}
            >
              Close
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
      {income.incomeSourceList.length > 0 ? (
        <div className="h-100 overflow-auto">
          {income.incomeSourceList.map((val, idx) => {
            return <div key={idx}>{val.source_name}</div>;
          })}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default IncomeSource;
