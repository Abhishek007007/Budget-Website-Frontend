import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Space,
  Select,
  Modal,
  Typography,
  DatePicker,
  Spin,
} from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../redux/transactionSlice";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"; // Import Gemini SDK
import { HumanMessage } from "@langchain/core/messages"; // Import HumanMessage to format requests

const { Option } = Select;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const Transactions = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactions.transactionsList
  );
  const loading = useSelector((state) => state.transactions.loading);
  const error = useSelector((state) => state.transactions.error);

  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [insights, setInsights] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all"); // Category filter for Income/Expense
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 }); // Pagination state
  const [dateRange, setDateRange] = useState([null, null]); // Date range state

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  useEffect(() => {
    // Filter data based on category, search text, and date range
    const filtered = transactions.filter((transaction) => {
      const matchSearchText =
        searchText === "" ||
        transaction.description
          .toLowerCase()
          .includes(searchText.toLowerCase());
      const matchCategory =
        categoryFilter === "all" || transaction.type === categoryFilter;

      // Check if transaction date is within the selected date range
      const matchDateRange =
        !dateRange[0] ||
        !dateRange[1] ||
        (new Date(transaction.date) >= dateRange[0].startOf("day") &&
          new Date(transaction.date) <= dateRange[1].endOf("day"));

      return matchSearchText && matchCategory && matchDateRange;
    });

    setFilteredData(filtered);
  }, [transactions, searchText, categoryFilter, dateRange]);

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
          content: `Provide four brief 4 line without heading just give, actionable insights to help improve financial health based on the following transaction data. Focus on spending habits, saving strategies, or income management:\n\n${JSON.stringify(
            transactions
          )}`,
        }),
      ];

      // Call the model and get the response
      const response = await vision.call(contents);
      setInsights(response.content);
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

  const data = filteredData.map((transaction) => ({
    key: `${transaction.type} : ${transaction.id}`,
    description: transaction.description,
    amount: transaction.amount,
    date: transaction.date,
    type: transaction.type,
  }));

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize: pageSize });
  };

  // Handle Date Range change
  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <div>
      <br />
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
        />
        <Select
          value={categoryFilter}
          onChange={(value) => setCategoryFilter(value)}
          style={{ width: 120 }}
        >
          <Option value="all">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        <RangePicker
          style={{ marginLeft: 10 }}
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
        />
        <Button type="primary" onClick={handleShowInsights}>
          Show Insights
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredData.length,
          onChange: handlePageChange,
        }}
      />

      <Modal
        title="Transaction Insights"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Text>
          {insights || (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
          )}
        </Text>
      </Modal>
    </div>
  );
};

export default Transactions;
