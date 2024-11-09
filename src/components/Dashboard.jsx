import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Typography, Tag } from "antd";
import ApexCharts from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { getTransactions } from "../redux/transactionSlice";
import { getBudget } from "../redux/budgetSlice";
const { Title } = Typography;

function Dashboard() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const budget = useSelector((state) => state.budget);
  const transactions = useSelector(
    (state) => state.transactions.transactionsList
  );

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: "income-expense-chart",
        height: 250,
        type: "line",
        zoom: {
          enabled: false,
        },
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      title: {
        text: "Daily Income and Expense (Last 5 Days)",
        align: "center",
        style: {
          fontWeight: "bold",
          fontSize: "14px",
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Amount (₹)",
        },
      },
      markers: {
        size: 4,
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      colors: ["#1890ff", "#ff4d4f"],
    },
  });

  // Helper function to format the date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Function to get the last 5 days from today
  const getLastFiveDays = () => {
    const today = new Date();
    const lastFiveDays = [];
    for (let i = 4; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      lastFiveDays.push(formatDate(date));
    }
    return lastFiveDays;
  };

  // Group and sum income and expense by the last 5 days
  const getDailyData = (transactions) => {
    const lastFiveDays = getLastFiveDays();
    const dailyIncome = {};
    const dailyExpense = {};

    transactions.forEach((transaction) => {
      const transactionDate = formatDate(transaction.date); // Assuming transaction has a date field
      if (lastFiveDays.includes(transactionDate)) {
        const amount = parseFloat(
          transaction.amount.replace("₹", "").replace(",", "")
        );

        if (transaction.type === "income") {
          if (!dailyIncome[transactionDate]) dailyIncome[transactionDate] = 0;
          dailyIncome[transactionDate] += amount;
        } else if (transaction.type === "expense") {
          if (!dailyExpense[transactionDate]) dailyExpense[transactionDate] = 0;
          dailyExpense[transactionDate] += amount;
        }
      }
    });

    // Prepare data for the chart
    const incomeData = lastFiveDays.map((day) => dailyIncome[day] || 0);
    const expenseData = lastFiveDays.map((day) => dailyExpense[day] || 0);

    return {
      categories: lastFiveDays,
      incomeData,
      expenseData,
    };
  };

  useEffect(() => {
    dispatch(getTransactions());
    dispatch(getBudget());
  }, [dispatch]);

  useEffect(() => {
    if (transactions.length > 0) {
      const { categories, incomeData, expenseData } =
        getDailyData(transactions);

      console.log(getDailyData(transactions));
      setChartData((prevState) => ({
        ...prevState,
        series: [
          {
            name: "Income",
            data: incomeData,
          },
          {
            name: "Expense",
            data: expenseData,
          },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
          },
        },
      }));

      // Calculate total income and total expense
      const totalIncomeValue = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce(
          (total, transaction) =>
            total +
            parseFloat(transaction.amount.replace("₹", "").replace(",", "")),
          0
        );

      const totalExpenseValue = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce(
          (total, transaction) =>
            total +
            parseFloat(transaction.amount.replace("₹", "").replace(",", "")),
          0
        );

      setTotalIncome(totalIncomeValue);
      setTotalExpense(totalExpenseValue);
    }
  }, [transactions]); // Re-run when transactions data changes

  // Columns for the transactions table
  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "income" ? "green" : "red"}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#ffffff", height: "100vh" }}>
      <div className="w-100 p-3">
        <Row gutter={16}>
          {budget.budgets.length !== 0 ? (
            <>
              <Col span={6}>
                <Card
                  title={`Budget:   ${budget.budgets[0].name}`}
                  bordered={false}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "#fff7e6",
                    color: "#faad14",
                  }}
                >
                  <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                    ₹
                    {(
                      budget.budgets[0].budget_limit -
                      budget.budgets[0].total_expenses
                    ).toFixed(2)}
                  </p>
                </Card>
              </Col>
            </>
          ) : (
            <></>
          )}
          <Col span={6}>
            <Card
              title="Total Income"
              bordered={false}
              style={{
                borderRadius: "20px",
                backgroundColor: "#e6f7ff",
                color: "#1890ff",
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                ₹{totalIncome.toFixed(2)}
              </p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              title="Total Expense"
              bordered={false}
              style={{
                borderRadius: "20px",
                backgroundColor: "#fff2e8", // Light red for Expense
                color: "#ff4d4f", // Error color (Ant Design Light)
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                ₹{totalExpense.toFixed(2)}
              </p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              title="Total Savings"
              bordered={false}
              style={{
                borderRadius: "20px",
                backgroundColor: "#f6ffed", // Light green for Savings
                color: "#52c41a", // Success color (Ant Design Light)
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                ₹{(totalIncome - totalExpense).toFixed(2)}
              </p>
            </Card>
          </Col>
        </Row>

        {/* Second Row - Charts and Table in one row */}
        <Row gutter={16} style={{ marginTop: "20px" }}>
          {/* Left column - Charts (one below the other) */}
          <Col span={16}>
            <Card
              title="Daily Income and Expense (Last 5 Days)"
              bordered={false}
              style={{
                borderRadius: "20px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                marginBottom: "20px",
              }}
            >
              <ApexCharts
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={265} // Chart height is fixed, no scrolling
              />
            </Card>
          </Col>

          {/* Right column - Transactions Table */}
          <Col span={8}>
            <Card
              title="Recent Transactions"
              bordered={false}
              style={{
                borderRadius: "20px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#ffffff",
              }}
            >
              <Table
                columns={columns}
                rowKey="created_at"
                dataSource={transactions.slice(0, 4)}
                pagination={false}
                // Assuming 'id' is the key for each transaction
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
