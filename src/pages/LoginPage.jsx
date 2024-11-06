import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Alert, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../redux/authSlice";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-around">
      <div className="text-center mb-4">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/gadget-a7f0c.appspot.com/o/ui%2Fundraw_my_password_re_ydq7.svg?alt=media&token=469333b2-5511-4547-967b-eb9dd16470f1"
          alt="Password Illustration"
          style={{ width: '100%', maxWidth: '400px' }} // Adjust image size
        />
        <Text className="d-block mt-3" style={{ fontSize: '24px', }}>Budget <span style={{color: "#2f54eb"}}>Wise</span></Text>
      </div>
      
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 560, minWidth: 350 }}
        onFinish={onFinish}
      >
        <Title level={3} className="text-center mb-4">Login</Title>

        {auth.error && (
          <Alert
            message={auth.error}
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
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="">Forgot password</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" loading={auth.loading}>
            Log in
          </Button>
          Or <Link to='/registration'>Register now!</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
