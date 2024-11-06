import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import incomeSlice, {
  deleteIncomeItem,
  getIncomeItemsList,
  editIncomeItem,
} from "./../redux/incomeSlice";

function IncomeItemsRow({ val }) {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [newVal, setNewVal] = useState(val);

  async function handleDelete() {
    await dispatch(deleteIncomeItem(val.id));
    dispatch(getIncomeItemsList());
  }

  function handleChange(e) {
    const newVal1 = { ...newVal };
    newVal1[e.target.name] = e.target.value;
    setNewVal(newVal1);
  }

  async function handleEditSubmit() {
    const newVal1 = { ...newVal };

    newVal1.source = income.incomeSourceList[newVal1.source];
    await dispatch(editIncomeItem(newVal1));
    dispatch(getIncomeItemsList());
    setIsEditing(false);
  }
  return (
    <tr>
      {isEditing ? (
        <>
          <td>
            <select
              value={newVal.source_name}
              name="source"
              onChange={handleChange}
            >
              {income.incomeSourceList.map((val, idx) => {
                return (
                  <option key={idx} value={idx}>
                    {val.source_name}
                  </option>
                );
              })}
            </select>
          </td>
          <td>
            <input
              type="number"
              value={newVal.amount}
              name="amount"
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              type="text"
              value={newVal.description}
              name="description"
              onChange={handleChange}
            />
          </td>
          <td>
            <input
              type="date"
              name="date"
              value={newVal.date}
              onChange={handleChange}
            />
          </td>
          <td>
            <button onClick={handleEditSubmit}>Submit</button>
            <button
              onClick={() => {
                setNewVal(newVal);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          </td>
        </>
      ) : (
        <>
          <td>{val.source.source_name}</td>
          <td>{val.amount}</td>
          <td>{val.description}</td>
          <td>{val.date}</td>
          <td>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
          </td>
        </>
      )}
    </tr>
  );
}

export default IncomeItemsRow;
