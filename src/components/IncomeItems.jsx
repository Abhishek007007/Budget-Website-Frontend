import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeItems, deleteIncomeItem, editIncomeItem, getIncomeItemsList } from "../redux/incomeSlice";
import { Button, Input, Modal, Select, Table, Form, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSource, setSelectedSource] = useState("");  // State for source filter

  useEffect(() => {
    dispatch(getIncomeItemsList());
  }, [dispatch]);

  function handleChange(e) {
    const newForm = { ...form };
    newForm[e.target.name] = e.target.value;
    setForm(newForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newForm = { ...form };
    newForm.source = income.incomeSourceList[form.source].id;
    dispatch(postIncomeItems(newForm));
    setForm(ItemForm);
    setIsAddingItem(false);
  }

  async function handleDelete(itemId) {
    await dispatch(deleteIncomeItem(itemId));
    dispatch(getIncomeItemsList());
  }

  function handleEdit(item) {
    setCurrentEditingItem(item);
    setForm({
      source: income.incomeSourceList.findIndex((source) => source.id === item.source.id),
      amount: item.amount,
      description: item.description,
      date: item.date,
    });
    setIsEditingItem(true);
  }

  async function handleEditSubmit() {
    const updatedItem = { ...form };
    updatedItem.source = income.incomeSourceList[form.source];
    await dispatch(editIncomeItem({ id: currentEditingItem.id, ...updatedItem }));
    dispatch(getIncomeItemsList());
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

  // Filtering based on source and description
  const filteredIncomeItems = income.incomeItemsList.filter((item) => {
    const matchesSource = selectedSource ? item.source.source_name === selectedSource : true;
    const matchesSearch = item.source.source_name.toLowerCase().includes(searchText.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchText.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const columns = [
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (text) => text.source_name,
      ...{
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Input
              autoFocus
              placeholder={`Search Source`}
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
      sorter: (a, b) => a.amount - b.amount, // Sorting by amount
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...{
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
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // Sorting by date
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
        <h5>Income Items</h5>
        <Button
          type="primary"
          onClick={() => {
            setIsAddingItem(true);
          }}
        >
          Add Income Item
        </Button>
      </div>

      {/* Modal for Adding a New Income Item */}
      <Modal
        title="Add Income Item"
        visible={isAddingItem}
        onCancel={() => setIsAddingItem(false)}
        onOk={handleSubmit}
        okText="Add"
        cancelText="Close"
      >
        <Form layout="vertical">
          <Form.Item label="Income Source" required>
            <Select
              name="source"
              value={form.source}
              onChange={(value) => setForm({ ...form, source: value })}
            >
              {income.incomeSourceList.map((source, idx) => (
                <Select.Option key={idx} value={idx}>
                  {source.source_name}
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

      {/* Modal for Editing an Income Item */}
      <Modal
        title="Edit Income Item"
        visible={isEditingItem}
        onCancel={() => setIsEditingItem(false)}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Close"
      >
        <Form layout="vertical">
          <Form.Item label="Income Source" required>
            <Select
              name="source"
              value={form.source}
              onChange={(value) => setForm({ ...form, source: value })}
            >
              {income.incomeSourceList.map((source, idx) => (
                <Select.Option key={idx} value={idx}>
                  {source.source_name}
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

      {/* Filter Dropdown */}
      <div>
        <Select
          style={{ width: 200, marginBottom: 10 }}
          placeholder="Filter by Source"
          onChange={setSelectedSource}
        >
          {income.incomeSourceList.map((source) => (
            <Select.Option key={source.id} value={source.source_name}>
              {source.source_name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredIncomeItems}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}

export default IncomeItems;
