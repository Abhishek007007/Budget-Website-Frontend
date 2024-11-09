import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postExpenseItem,
  deleteExpenseItem,
  editExpenseItem,
  getExpenseItemsList,
} from "../redux/expenseSlice";
import { Button, Input, Modal, Select, Table, Form } from "antd";

function ExpenseItems() {
  const expense = useSelector((state) => state.expense);
  const dispatch = useDispatch();

  const ItemForm = {
    category: 0,
    amount: "",
    description: "",
    date: "",
  };

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [form, setForm] = useState(ItemForm);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);

  useEffect(() => {
    dispatch(getExpenseItemsList());
  }, [dispatch]);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newForm = { ...form };
    newForm.category = expense.expenseCategoryList[form.category].id;
    dispatch(postExpenseItem(newForm));
    console.log(newForm)
    setForm(ItemForm);
    setIsAddingItem(false);
  }

  async function handleDelete(itemId) {
    await dispatch(deleteExpenseItem(itemId));
    dispatch(getExpenseItemsList());
  }

  function handleEdit(item) {
    setCurrentEditingItem(item);
    setForm({
      category: expense.expenseCategoryList.findIndex(
        (category) => category.id === item.category.id
      ),
      amount: item.amount,
      description: item.description,
      date: item.date,
    });
    setIsEditingItem(true);
  }

  async function handleEditSubmit() {
    const updatedItem = { ...form };
    updatedItem.category = expense.expenseCategoryList[form.category];
    await dispatch(editExpenseItem({ id: currentEditingItem.id, ...updatedItem }));
    dispatch(getExpenseItemsList());
    setIsEditingItem(false);
    setCurrentEditingItem(null);
  }

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text.name,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-100 h-100 d-flex flex-column">
      <div className="w-100 d-flex flex-row justify-content-between align-items-center">
        <h2>Expense Items</h2>
        <Button
          type="primary"
          onClick={() => {
            setIsAddingItem(true);
          }}
        >
          Add Expense Item
        </Button>
      </div>

      {/* Modal for Adding a New Expense Item */}
      <Modal
        title="Add Expense Item"
        visible={isAddingItem}
        onCancel={() => setIsAddingItem(false)}
        onOk={handleSubmit}
        okText="Add"
        cancelText="Close"
      >
        <Form layout="vertical">
          <Form.Item label="Expense Category" required>
            <Select
              name="category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
            >
              {expense.expenseCategoryList.map((category, idx) => (
                <Select.Option key={idx} value={idx}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Amount" required>
            <Input
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </Form.Item>

          <Form.Item label="Date">
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Editing an Expense Item */}
      <Modal
        title="Edit Expense Item"
        visible={isEditingItem}
        onCancel={() => setIsEditingItem(false)}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Close"
      >
        <Form layout="vertical">
          <Form.Item label="Expense Category" required>
            <Select
              name="category"
              value={form.category}
              onChange={(value) => setForm({ ...form, category: value })}
            >
              {expense.expenseCategoryList.map((category, idx) => (
                <Select.Option key={idx} value={idx}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Amount" required>
            <Input
              type="text"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </Form.Item>

          <Form.Item label="Date">
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Table for displaying Expense Items */}
      {expense.expenseItemsList.length > 0 && (
        <Table columns={columns} dataSource={expense.expenseItemsList} rowKey="id" />
      )}
    </div>
  );
}

export default ExpenseItems;
