import { MDBCard } from "mdb-react-ui-kit";
import React from "react";
import { useSelector } from "react-redux";
import { ArrowDownOutlined, ArrowUpOutlined, DollarOutlined } from '@ant-design/icons';
import { Statistic, Typography, Card, Col, Row, Progress } from 'antd';

function Dashboard() {
  const { Title } = Typography;
  const auth = useSelector((state) => state.auth);

  // Sample data; replace these with your actual state values
  const totalIncome = 5000; // Replace with actual total income in Rupees
  const totalExpense = 2000; // Replace with actual total expense in Rupees
  const totalSavings = totalIncome - totalExpense; // Calculate savings
  const totalBalance = totalIncome; // Assuming balance equals total income for this example

  return (
    <div className="w-100 h-100 p-3" style={{ backgroundColor: '#ffffff' }}> {/* Light background for the entire card */}
      <Row gutter={16}>
        <Col span={6}>
          <Card 
            bordered={false} 
            style={{ 
              backgroundColor: '#f6ffed', 
              borderRadius: '20px', 
              border : '#f6ffed',
              color: '#000000' 
            }} 
          >
            <Statistic
              title={<span style={{ fontWeight: 'bold', color: '#000000' }}>Total Income</span>}
              value={totalIncome}
              precision={2}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            bordered={false} 
            style={{ 
              backgroundColor: '#fff1f0', 
              borderRadius: '20px', 
              color: '#000000',
              border: '#fff1f0'
            }} 
          >
            <Statistic
              title={<span style={{ fontWeight: 'bold', color: '#000000' }}>Total Expense</span>}
              value={totalExpense}
              precision={2}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            bordered={false} 
            style={{ 
              backgroundColor: '#e6f4ff', 
              border: '#e6f4ff',
              borderRadius: '20px', 
              color: '#000000' 
            }} 
          >
            <Statistic
              title={<span style={{ fontWeight: 'bold', color: '#000000' }}>Total Savings</span>}
              value={totalSavings}
              precision={2}
              valueStyle={{ color: '#2f54eb', fontWeight: 'bold' }}
              suffix="₹"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card 
            bordered={false} 
            style={{ 
              backgroundColor: '#feffe6', 
              borderRadius: '20px', 
              color: '#000000' ,
              border : '#feffe6'
            }} 
          >
            <Statistic
              title={<span style={{ fontWeight: 'bold', color: '#000000' }}>Total Balance</span>}
              value={totalBalance}
              precision={2}
              valueStyle={{ color: '#fadb14', fontWeight: 'bold' }}
              suffix="₹"
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={12}>
        <Progress strokeLinecap="butt" type="circle" percent={75} />
      </Row>
    </div>
  );
}

export default Dashboard;
