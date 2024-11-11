import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postIncomeItems, deleteIncomeItem, editIncomeItem, getIncomeItemsList } from "../redux/incomeSlice";
import { Button, Input, Modal, Select, Table, Form, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ReactApexChart from "react-apexcharts"; // Importing React-ApexCharts
import dayjs from "dayjs"; // For working with dates

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
  const [isGraphModalVisible, setIsGraphModalVisible] = useState(false);  // State for graph modal visibility

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

  // Function to get total income for each of the last 10 days
  const getLast10DaysIncome = () => {
    // Get the current date
    const today = dayjs();
    const last10Days = [];
    
    // Initialize an array for the last 10 days
    for (let i = 9; i >= 0; i--) {
      last10Days.push(today.subtract(i, 'day').format('YYYY-MM-DD'));
    }

    // Calculate total income for each day
    const dailyIncome = last10Days.map(date => {
      const incomeForDay = filteredIncomeItems.filter(item => dayjs(item.date).format('YYYY-MM-DD') === date);
      return incomeForDay.reduce((total, item) => total + item.amount, 0);
    });

    return {
      dates: last10Days,
      incomeData: dailyIncome,  // Renamed from 'income' to 'incomeData'
    };
  };

  // Data for the Apex Bar Graph (Histogram)
  const { dates, incomeData } = getLast10DaysIncome();  // Updated to use 'incomeData'

  const chartData = {
    series: [{
      name: "Income Amount",
      data: incomeData,  // Updated to use 'incomeData'
    }],
    options: {
      chart: {
        type: 'bar',  // Changed to 'bar' for histogram
        height: 350,
      },
      xaxis: {
        categories: dates,
      },
      title: {
        text: "Income Over Last 10 Days",
        align: 'center',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          endingShape: 'flat',
        },
      },
      colors: ['#52c41a'],  // Set a color for the bars (you can provide an array of colors if needed)
    },
  };
  

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
       <div>
       <Button
          type="primary"
          onClick={() => {
            setIsAddingItem(true);
          }}
        >
          Add Income Item
        </Button>
        <Button
        className="mx-3"
          type="default"
          onClick={() => setIsGraphModalVisible(true)}
        >
          View Income Graph
        </Button>
       </div>
      </div>

      {/* Modal for Adding a New Income Item */}
      <Modal
        title="Add Income Item"
        visible={isAddingItem}
        onCancel={() => setIsAddingItem(false)}
        onOk={handleSubmit}
      >
        <Form layout="vertical" onSubmit={handleSubmit}>
          <Form.Item label="Income Source" required>
            <Select
              value={form.source}
              onChange={(value) => setForm({ ...form, source: value })}
            >
              {income.incomeSourceList.map((source, index) => (
                <Select.Option key={index} value={index}>
                  {source.source_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Amount" required>
            <Input
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </Form.Item>

          <Form.Item label="Date" required>
            <Input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Graph */}
      <Modal
        title="Income Over Last 10 Days"
        visible={isGraphModalVisible}
        onCancel={() => setIsGraphModalVisible(false)}
        footer={null}
        width={800}
      >
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </Modal>

      {/* Table for displaying income items */}
      <Table
        columns={columns}
        dataSource={filteredIncomeItems}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default IncomeItems;
