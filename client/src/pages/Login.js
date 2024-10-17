
import React, { useEffect, useState } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import "../styles/Login.css"; // Ensure to include styles

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      const res = await axios.post("/api/users/login", value);
      dispatch({ type: "HIDE_LOADING" });
      message.success("Login Successfully");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Invalid Username or Password");
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <div className="login-form">
          <div className="logo">
            <img src="./assets/Untitled124.png" alt="Logo" className="logo-image" />
          </div>
          <h3>TeaLerin</h3>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="userId" label="User">
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password">
            <Input 
              type={showPassword ? "text" : "password"}
              suffix={
                showPassword ? (
                  <EyeOutlined onClick={() => setShowPassword(false)} style={{ cursor: 'pointer' }} />
                ) : (
                  <EyeInvisibleOutlined onClick={() => setShowPassword(true)} style={{ cursor: 'pointer' }} />
                )
              }
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" className="login-button">
            Log In
          </Button>
          <div className="footer-links">
            <p>
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;