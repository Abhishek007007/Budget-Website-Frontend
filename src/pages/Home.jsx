import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, Typography, Avatar, Badge, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

import { userLogout } from "../redux/authSlice";
import Dashboard from "../components/Dashboard";
import Transactions from "../components/Transactions";
import Expenses from "../components/Expenses";
import Income from "../components/Income";
import Settings from "../components/Settings";

import './dashboard.css'; // Import the CSS file

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
      case "Settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  }

  const handleNotificationClick = () => {
    notification.open({
      message: 'Notification Title',
      description: 'This is the content of the notification.',
      onClick: () => {
        console.log('Notification Clicked!');
      },
    });
  };

  return (
    <Layout style={{ height: '100vh', background: 'transparent', overflowY: "none" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          background: '#3a8eea',
          margin: '16px',
          borderRadius: '8px',
          zIndex: 10,
        }}
      >
        <div style={{ padding: '16px', textAlign: 'center' }}>
          {collapsed ? (
            <Title level={5} style={{ color: '#ffffff', margin: 0 }}>
              B
            </Title>
          ) : (
            <Title level={5} style={{ color: '#ffffff', margin: 0 }}>
              BudgetWise
            </Title>
          )}
        </div>
        <Menu
          style={{ backgroundColor: 'transparent' }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[selectedTab]}
          items={[
            {
              key: 'Dashboard',
              icon: <UserOutlined style={{ color: '#ffffff' }} />,
              label: 'Dashboard',
              onClick: () => setSelectedTab("Dashboard"),
            },
            {
              key: 'Transactions',
              icon: <VideoCameraOutlined style={{ color: '#ffffff' }} />,
              label: 'Transactions',
              onClick: () => setSelectedTab("Transactions"),
            },
            {
              key: 'Expenses',
              icon: <UploadOutlined style={{ color: '#ffffff' }} />,
              label: 'Expenses',
              onClick: () => setSelectedTab("Expenses"),
            },
            {
              key: 'Income',
              icon: <UserOutlined style={{ color: '#ffffff' }} />,
              label: 'Income',
              onClick: () => setSelectedTab("Income"),
            },
            {
              key: 'Settings',
              icon: <SettingOutlined style={{ color: '#ffffff' }} />,
              label: 'Settings',
              onClick: () => setSelectedTab("Settings"),
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginTop: 16, marginRight: 16 }}>
        <Header
          style={{
            background: '#f0f5ff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined style={{ color: '#3a8eea' }} /> : <MenuFoldOutlined style={{ color: '#3a8eea' }} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: '#3a8eea',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Badge count={5} style={{ marginRight: '16px' }}>
              <BellOutlined style={{ fontSize: '20px', color: '#3a8eea' }} onClick={handleNotificationClick} />
            </Badge>
            <Avatar style={{ backgroundColor: '#3a8eea', color: '#ffffff' }} icon={<UserOutlined />} />
            <Button
              type="primary"
              danger
              onClick={handleLogout}
              style={{ marginLeft: '16px', backgroundColor: '#f5222d' }}
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            backgroundColor: '#ffffff',
            overflowY: 'auto',
            height: 'calc(100vh - 64px)',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: "20px",
          }}
        >
          <Tab />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
