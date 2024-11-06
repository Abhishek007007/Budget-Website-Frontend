import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  deleteIncomeSource,
  getIncomeItemsList,
  getIncomeSourceList,
  editIncomeSource,
} from "./../redux/incomeSlice";

function IncomeSourceCard({ val }) {
  const dispatch = useDispatch();
  async function handleDelete() {
    await dispatch(deleteIncomeSource(val.id));
    dispatch(getIncomeItemsList());
    dispatch(getIncomeSourceList());
  }

  const [isEditing, setIsEditing] = useState(false);
  const [newSouceName, setNewSourceName] = useState(val.source_name);

  async function handleEditSubmit() {
    await dispatch(editIncomeSource([val.id, newSouceName]));
    dispatch(getIncomeItemsList());
    dispatch(getIncomeSourceList());
    setIsEditing(false);
  }
  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={newSouceName}
            onChange={(e) => setNewSourceName(e.target.value)}
          />
          <button onClick={handleEditSubmit}>Submit</button>
          <button
            onClick={() => {
              setNewSourceName(val.source_name);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          {val.source_name}
          <button onClick={handleDelete}>Delete</button>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
    </div>
  );
}

export default IncomeSourceCard;
