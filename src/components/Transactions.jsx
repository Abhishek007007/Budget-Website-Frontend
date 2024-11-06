import React, { useState } from "react";
import { Table, Tag, Button, Input, Space, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

const Transactions = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const transactions = [
    {
      id: 2,
      source: {
        source_name: "Salary from ust",
      },
      amount: "3000.00",
      description: "Monthly salary",
      date: "2024-11-01",
      type: "income",
    },
    {
      id: 4,
      source: {
        source_name: "Salary from ust",
      },
      amount: "2000.00",
      description: "Monthly salary",
      date: "2024-11-01",
      type: "income",
    },
    {
      id: 4,
      category: {
        name: "Eating Out",
      },
      amount: "150.00",
      description: "Grocery shopping",
      date: "2024-11-02",
      type: "expense",
    },
    {
      id: 5,
      category: {
        name: "HouseHold",
      },
      amount: "1500.00",
      description: "Household shopping",
      date: "2024-11-02",
      type: "expense",
    },
  ];

  const columns = [
    {
      title: "Source/Category",
      dataIndex: "sourceOrCategory",
      render: (text, record) => (
        <span>
          {record.source ? record.source.source_name : record.category ? record.category.name : 'N/A'}
        </span>
      ),
      sorter: (a, b) => a.sourceOrCategory.localeCompare(b.sourceOrCategory), // Sort by name
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description), // Sort by description
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount), // Sort by amount
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), // Sort by date
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>{type.charAt(0).toUpperCase() + type.slice(1)}</Tag>
      ),
      filters: [
        { text: 'Income', value: 'income' },
        { text: 'Expense', value: 'expense' },
      ],
      onFilter: (value, record) => record.type.includes(value),
    },
    {
      title: "Actions",
      render: () => <Button type="link" size="small">Edit</Button>,
    },
  ];

  // Format the data
  const data = transactions.map((transaction, index) => ({
    key: `${transaction.id}-${transaction.type}-${index}`, // Unique key
    sourceOrCategory: transaction.source
      ? transaction.source.source_name
      : transaction.category ? transaction.category.name : 'N/A',
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type,
  }));

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchText(value);
    setFilteredData(
      data.filter((item) =>
        item.description.toLowerCase().includes(value.toLowerCase()) ||
        item.sourceOrCategory.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

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
          onChange={(value) => {
            if (value === "all") {
              setFilteredData(data);
            } else {
              setFilteredData(data.filter((item) => item.type === value));
            }
          }}
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
