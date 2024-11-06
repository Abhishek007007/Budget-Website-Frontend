import React, { useState } from "react";
import { Card, Input, Button, Form, Typography, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/authSlice";
import { useNavigate } from "react-router";

const { Title } = Typography;

function LoginPage() {
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleSubmit(values) {
    const resultAction = await dispatch(userLogin(values));
    if (userLogin.fulfilled.match(resultAction)) {
      navigate("/");
    }
  }

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center">
      <Card style={{ width: 400 }}>
        <Title level={3} className="d-flex justify-content-center">
          Login
        </Title>
        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          {/* Display backend error message if login failed */}
          {auth.error && (
            <Alert
              message="Login Failed"
              description={auth.error}
              type="error"
              showIcon
              className="mb-3"
            />
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={auth.loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;
