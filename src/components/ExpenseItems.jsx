import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  postExpenseItem,
  deleteExpenseItem,
  editExpenseItem,
  getExpenseItemsList,
} from "../redux/expenseSlice";
import { Button, Input, Modal, Select, Table, Form, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);  // Added category filter state

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
    console.log(newForm);
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

  // Search filter function for table
  const handleSearch = (selectedKeys, confirm) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  // Custom filter logic for category
  const handleCategoryFilter = (value) => {
    setCategoryFilter(value);
  };

  // Filtered data based on category and search text
  const filteredData = expense.expenseItemsList.filter((item) => {
    const matchCategory = categoryFilter
      ? item.category.id === categoryFilter
      : true;
    const matchSearchText = searchText
      ? item.description.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchCategory && matchSearchText;
  });

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text.name,
      ...{
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              autoFocus
              placeholder={`Search Category`}
              value={selectedKeys[0]}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="link"
                onClick={() => handleSearch(selectedKeys, confirm)}
                icon={<SearchOutlined />}
              >
                Search
              </Button>
              <Button
                type="link"
                onClick={() => handleReset(clearFilters)}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
        ),
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            autoFocus
            placeholder={`Search Description`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="link"
              onClick={() => handleSearch(selectedKeys, confirm)}
              icon={<SearchOutlined />}
            >
              Search
            </Button>
            <Button
              type="link"
              onClick={() => handleReset(clearFilters)}
            >
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      sortDirections: ['ascend', 'descend'],
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
        <h5>Expense Items</h5>
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

      {/* Category Filter */}
      <Select
        value={categoryFilter}
        onChange={handleCategoryFilter}
        placeholder="Filter by Category"
        style={{ width: 200, marginBottom: 16 }}
      >
        <Select.Option value={null}>All Categories</Select.Option>
        {expense.expenseCategoryList.map((category) => (
          <Select.Option key={category.id} value={category.id}>
            {category.name}
          </Select.Option>
        ))}
      </Select>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default ExpenseItems;
