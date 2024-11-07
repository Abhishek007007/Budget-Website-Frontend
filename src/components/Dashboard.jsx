import React, { useEffect, useState } from "react";
import { Row, Col, Card, Table, Typography, Tag } from "antd";
import ApexCharts from "react-apexcharts"; // Import the ApexCharts component
import { useSelector, useDispatch } from "react-redux";
import { getTransactions } from "../redux/transactionSlice";
const { Title } = Typography;

function Dashboard() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const transactions = useSelector(
    (state) => state.transactions.transactionsList
  );
  useEffect(() => {
    dispatch(getTransactions());
  }, []);

  console.log(transactions);

  // Sample data for the chart: Monthly Income and Expense
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Income",
        data: [
          1000, 1500, 1200, 1600, 1800, 2200, 2500, 2700, 2900, 3100, 3500,
          3800,
        ],
      },
      {
        name: "Expense",
        data: [
          800, 1200, 1000, 1300, 1500, 1600, 1800, 1900, 2100, 2200, 2400, 2500,
        ],
      },
    ],
    options: {
      chart: {
        id: "income-expense-chart",
        height: 250, // Smaller chart height
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
        text: "Monthly Income and Expense",
        align: "center",
        style: {
          fontWeight: "bold",
          fontSize: "14px",
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        title: {
          text: "Months",
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
      colors: ["#1890ff", "#ff4d4f"], // Ant Design primary and error colors
    },
  });

  // Donut Chart Data for Financial Goals
  const [donutChartData, setDonutChartData] = useState({
    series: [40, 30, 30], // Example goal completion (e.g., 40% achieved, 30% remaining, 30% in progress)
    options: {
      chart: {
        id: "financial-goals-donut-chart",
        type: "donut",
        width: "100%",
      },
      labels: ["Achieved", "Remaining", "In Progress"],
      title: {
        text: "Financial Goals",
        align: "center",
        style: {
          fontWeight: "bold",
          fontSize: "14px",
        },
      },
      colors: ["#52c41a", "#fa8c16", "#1890ff"], // Ant Design success, warning, and primary colors
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100%",
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  // Sample data for the transactions table

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
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹5000</p>
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
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹2000</p>
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
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹3000</p>
            </Card>
          </Col>
          <Col span={6}>
            <Card
              title="Total Balance"
              bordered={false}
              style={{
                borderRadius: "20px",
                backgroundColor: "#fff7e6", // Light yellow for Balance
                color: "#faad14", // Warning color (Ant Design Light)
              }}
            >
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>₹5000</p>
            </Card>
          </Col>
        </Row>

        {/* Second Row - Charts and Table in one row */}
        <Row gutter={16} style={{ marginTop: "20px" }}>
          {/* Left column - Charts (one below the other) */}
          <Col span={16}>
            <Card
              title="Monthly Income and Expense"
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
                height={250} // Chart height is fixed, no scrolling
              />
            </Card>

            <Card
              title="Financial Goals"
              bordered={false}
              style={{
                borderRadius: "20px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <ApexCharts
                options={donutChartData.options}
                series={donutChartData.series}
                type="donut"
                height={250} // Chart height is fixed, no scrolling
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
                dataSource={transactions.slice(0, 6)}
                pagination={false}
                rowKey="key"
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Dashboard;
