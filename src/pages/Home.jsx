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
    <Layout style={{ height: '100vh', background: 'transparent' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          margin: '16px',
          borderRadius: '8px',
          background: '#3a8eea' // Sidebar background color
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
      <Layout style={{ margin: '16px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        <Header 
          style={{ 
            paddingRight: 30, 
            background: '#ffffff', // Set Header background to white
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderRadius: '8px 8px 0 0', // Rounded corners at the top
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Shadow for visual separation
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
              style={{ marginLeft: '16px', backgroundColor: '#3a8eea' }} 
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content style={{  backgroundColor: 'transparent',  borderBottomLeftRadius: '20px',  // Apply bottom left radius
    borderBottomRightRadius: '20px'}}>
          <Tab />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
