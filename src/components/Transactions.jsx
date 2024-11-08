import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Space, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../redux/transactionSlice";

const { Option } = Select;

const Transactions = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(
    (state) => state.transactions.transactionsList
  );
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(getTransactions());
  }, []);

  // Columns for the table
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description), // Sort by description
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount), // Sort by amount
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // Sort by date
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Actions",
      render: () => (
        <Button type="link" size="small">
          Edit
        </Button>
      ),
    },
  ];

  // Format the data
  const data = transactions.map((transaction, index) => ({
    key: `${transaction.id}-${transaction.type}-${index}`, // Unique key
    sourceOrCategory: transaction.source
      ? transaction.source.source_name
      : transaction.category
      ? transaction.category.name
      : "N/A",
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type,
  }));

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    setFilteredData(
      data.filter(
        (item) =>
          item.description.toLowerCase().includes(value.toLowerCase()) ||
          item.sourceOrCategory.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Handle filter by type (Income/Expense)
  const handleTypeFilter = (value) => {
    if (value === "all") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.type === value));
    }
  };

  // Show loading state while fetching
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Space style={{ marginBottom: 16, marginTop: 10 }}>
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
        />
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          onChange={handleTypeFilter}
        >
          <Option value="all">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData.length > 0 ? filteredData : data}
        pagination={false}
        bordered
        title={() => "Transaction List"}
      />
    </div>
  );
};

export default Transactions;
