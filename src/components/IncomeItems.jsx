import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeItems } from "./../redux/incomeSlice";

function IncomeItems() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();
  const ItemForm = {
    source: 0,
    amount: "",
    description: "",
    date: "",
  };

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [form, setForm] = useState(ItemForm);

  useEffect(() => {}, [income.incomeItemsList]);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newform = { ...form };
    newform.source = income.incomeSourceList[form.source].id;
    dispatch(postIncomeItems(newform));
    setForm(ItemForm);
    setIsAddingItem(false);
  }

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center">
        <h2>Income Items</h2>
        <button
          onClick={() => {
            setIsAddingItem(true);
          }}
          className="btn"
        >
          Add Income Item
        </button>
      </div>
      {isAddingItem ? (
        <form>
          <select
            className="form-control"
            name="source"
            value={form.source}
            onChange={handleChange}
            required
          >
            {income.incomeSourceList.map((source, idx) => {
              return (
                <option key={idx} value={idx}>
                  {source.source_name}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            className="form-control"
            name="amount"
            placeholder="amount"
            value={form.amount}
            onChange={handleChange}
          />
          <input
            type="text"
            className="form-control"
            name="description"
            placeholder="description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="date"
            className="form-control"
            name="date"
            placeholder="date"
            value={form.date}
            onChange={handleChange}
          />
          <div>
            <button type="submit" onClick={handleSubmit}>
              Add
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setForm(ItemForm);
                setIsAddingItem(false);
              }}
            >
              Close
            </button>
          </div>
        </form>
      ) : (
        <></>
      )}
      {income.incomeItemsList.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>source</th>
              <th>amount</th>
              <th>description</th>
              <th>date</th>
            </tr>
          </thead>

          <tbody>
            {income.incomeItemsList.map((val, idx) => {
              return (
                <tr key={idx}>
                  <td>{val.source.source_name}</td>
                  <td>{val.amount}</td>
                  <td>{val.description}</td>
                  <td>{val.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <></>
      )}
    </div>
  );
}

export default IncomeItems;
