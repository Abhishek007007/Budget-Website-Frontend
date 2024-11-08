import React, { useState } from "react";
import { LockOutlined, UserOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography, Alert } from "antd";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

const { Title } = Typography;

const RegistrationPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BASE_API_URL + "/api/v1/register/",
        values
      );
      console.log(response);
      setLoading(false);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-around">
      <Form
        name="register"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360 }}
        onFinish={onFinish}
      >
        <Title level={3} className="d-flex justify-content-center">
          Register
        </Title>

        {error && (
          <Alert
            message="Registration Failed"
            description={error}
            type="error"
            showIcon
            className="mb-3"
          />
        )}

        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your Email!" },
            { type: "email", message: "Please enter a valid Email!" },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item
          name="password2"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
          Already have an account? <Link to="/login">Log in!</Link>
        </Form.Item>
      </Form>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/gadget-a7f0c.appspot.com/o/ui%2Fundraw_investing_re_bov7.svg?alt=media&token=9bc1b60c-8e34-4cc6-b208-82e045e0784e"
        alt="Password Illustration"
        style={{ width: "100%", maxWidth: "400px" }} // Optional: Adjust image size
      />
    </div>
  );
};

export default RegistrationPage;
