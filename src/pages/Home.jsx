import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion"; // Import framer-motion
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  TransactionOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  AppstoreAddOutlined,
  GroupOutlined,
  PaperClipOutlined,
  RadiusBottomleftOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Typography,
  Avatar,
  Badge,
  notification,
} from "antd";
import { useNavigate } from "react-router-dom";

import { userLogout } from "../redux/authSlice";
import Dashboard from "../components/Dashboard";
import Transactions from "../components/Transactions";
import Expenses from "../components/Expenses";
import Income from "../components/Income";
import Settings from "../components/Settings";
import CreateBudget from "../components/Budget";
import { clearBudget } from "../redux/budgetSlice";
import { clearExpense } from "../redux/expenseSlice";
import { clearIncome } from "../redux/incomeSlice";
import { clearTransactions } from "../redux/transactionSlice";
import FinancialGoals from "../components/FinancialGoals";
import Groups from "../components/Groups";
import NewsComponent from "../components/news";
import BillReminderComponent from "../components/Bills";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function Home() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  function handleLogout() {
    dispatch(userLogout());
    dispatch(clearExpense());
    dispatch(clearIncome());
    dispatch(clearTransactions());
    dispatch(clearBudget());
    navigate("/");
  }

  function Tab() {
    switch (selectedTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Transactions":
        return <Transactions />;
      case "Expenses":
        return <Expenses />;
      case "Income":
        return <Income />;
      case "Budgets":
        return <CreateBudget />;
      case "Groups":
        return <Groups />;
      case "Settings":
        return <Settings />;
      case "FinancialGoals":
        return <FinancialGoals />;
      case "News":
        return <NewsComponent />;
      case "Bills":
        return <BillReminderComponent />;
      default:
        return <Dashboard />;
    }
  }

  const handleNotificationClick = () => {
    notification.open({
      message: "Notification Title",
      description: "This is the content of the notification.",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  return (
    <Layout
      style={{ height: "100vh", background: "transparent", overflowY: "none" }}
    >
      {/* Sidebar with Framer Motion for collapse animation */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: "#3a8eea",
          margin: "16px",
          borderRadius: "8px",
          zIndex: 10,
        }}
      >
        <motion.div
          style={{ padding: "16px", textAlign: "center" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {collapsed ? (
            <Title level={5} style={{ color: "#ffffff", margin: 0 }}>
              B
            </Title>
          ) : (
            <Title level={5} style={{ color: "#ffffff", margin: 0 }}>
              BudgetWise
            </Title>
          )}
        </motion.div>
        <Menu
          style={{ backgroundColor: "transparent" }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedTab]}
          items={[
            {
              key: "Dashboard",
              icon: (
                <UserOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Dashboard",
              onClick: () => setSelectedTab("Dashboard"),
            },
            {
              key: "Transactions",
              icon: (
                <TransactionOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Transactions",
              onClick: () => setSelectedTab("Transactions"),
            },
            {
              key: "Expenses",
              icon: (
                <CreditCardOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Expenses",
              onClick: () => setSelectedTab("Expenses"),
            },
            {
              key: "Income",
              icon: (
                <DollarCircleOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Income",
              onClick: () => setSelectedTab("Income"),
            },
            {
              key: "FinancialGoals",
              icon: (
                <DollarCircleOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Financial Goals",
              onClick: () => setSelectedTab("FinancialGoals"),
            },
            {
              key: "Budgets",
              icon: (
                <AppstoreAddOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Budgets",
              onClick: () => setSelectedTab("Budgets"),
            },
            {
              key: "Groups",
              icon: (
                <GroupOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Groups",
              onClick: () => setSelectedTab("Groups"),
            },
            {
              key: "Bills",
              icon: (
                <RadiusBottomleftOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Bills",
              onClick: () => setSelectedTab("Bills"),
            },
            {
              key: "News",
              icon: (
                <PaperClipOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "News",
              onClick: () => setSelectedTab("News"),
            },
            {
              key: "Settings",
              icon: (
                <SettingOutlined
                  className="animated-icon"
                  style={{ color: "#ffffff" }}
                />
              ),
              label: "Settings",
              onClick: () => setSelectedTab("Settings"),
            },
          ]}
        />
      </Sider>

      {/* Content with Framer Motion for tab transitions */}
      <Layout style={{ marginTop: 16, marginRight: 16 }}>
        <Header
          style={{
            background: "#f0f5ff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: "18px",
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ color: "#3a8eea" }} />
              ) : (
                <MenuFoldOutlined style={{ color: "#3a8eea" }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "#3a8eea",
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Badge count={5} style={{ marginRight: "16px" }}>
              <BellOutlined
                style={{ fontSize: "20px", color: "#3a8eea" }}
                onClick={handleNotificationClick}
              />
            </Badge>
            <Avatar
              style={{ backgroundColor: "#3a8eea", color: "#ffffff" }}
              icon={<UserOutlined />}
            />
            <Button
              type="primary"
              danger
              onClick={handleLogout}
              style={{ marginLeft: "16px", backgroundColor: "#f5222d" }}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content
          style={{
            backgroundColor: "#ffffff",
            overflowY: "auto",
            height: "calc(100vh - 64px)",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          {/* Animate Tab Transitions */}
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Tab />
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
