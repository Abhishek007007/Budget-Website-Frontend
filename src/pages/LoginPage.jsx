import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Alert, Typography, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/authSlice";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import loginVideo from '../assets/MicrosoftTeams-video.mp4';
import './dashboard.css'

const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const resultAction = await dispatch(userLogin(values));
    if (userLogin.fulfilled.match(resultAction)) {
      navigate("/");
    }
  };

  return (
    <Row justify="center" align="middle" className="vh-100">
      <Col span={24} md={12} className="text-center mb-4">
        <video className="w-50" autoPlay loop muted>
          <source src={loginVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Text className="d-block mt-3" style={{ fontSize: '24px' }}>
          Budget <span style={{ color: "#2f54eb" }}>Wise</span>
        </Text>
      </Col>

      <Col span={24} md={12} className="text-start">
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 420, minWidth: 350 }}
          onFinish={onFinish}
        >
          <Title level={3} className="text-center mb-4">Login</Title>

          {auth.error && (
            <Alert
              message={auth.error}
              type="error"
              showIcon
              className="mb-3 alert-shake"  // Add the shake animation class here
            />
          )}

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle">
              <Col>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Col>
              <Col>
                <a href="">Forgot password</a>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit" loading={auth.loading}>
              Log in
            </Button>
            Or <Link to='/registration'>Register now!</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginPage;
