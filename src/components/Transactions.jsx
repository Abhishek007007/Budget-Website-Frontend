import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Input, Space, Select, Modal, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../redux/transactionSlice";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // Import Gemini SDK
import { HumanMessage } from "@langchain/core/messages"; // Import HumanMessage to format requests

const { Option } = Select;
const { Text } = Typography;

const Transactions = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactionsList);
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [insights, setInsights] = useState("");

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  // Fetch insights from Gemini
  const fetchInsights = async () => {
    try {
      // Initialize Gemini model instance
      const vision = new ChatGoogleGenerativeAI({
        modelName: "gemini-1.5-pro", // Ensure this model is available for insights
        apiKey: "AIzaSyAOwlLrqb95aeLXTcMqoi5Sei3mTbx_f3M", // Load your API key from environment variables
      });

      // Create a HumanMessage with transaction data
      const contents = [
        new HumanMessage({
          content: `Provide four brief, actionable insights to help improve financial health based on the following transaction data. Focus on spending habits, saving strategies, or income management:\n\n${JSON.stringify(transactions)}`,

        }),
      ];

      // Call the model and get the response
      const response = await vision.call(contents);



      setInsights(response.content);
      
      // Set the response as insights
    } catch (error) {
      setInsights("Error retrieving insights. Please try again.");
      console.error(error);
    }
  };

  // Show modal with insights
  const handleShowInsights = () => {
    setIsModalVisible(true);
    fetchInsights();
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => parseFloat(a.amount) - parseFloat(b.amount),
    },
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
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
  ];

  const data = transactions.map((transaction) => ({
    key: transaction.id,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type,
  }));

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />
        <Select defaultValue="all" style={{ width: 120 }}>
          <Option value="all">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        <Button type="primary" onClick={handleShowInsights}>
          Show Insights
        </Button>
      </Space>

      <Table columns={columns} dataSource={filteredData.length > 0 ? filteredData : data} />

      <Modal
        title="Transaction Insights"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Text>{insights || "Fetching insights..."}</Text>
      </Modal>
    </div>
  );
};

export default Transactions;
