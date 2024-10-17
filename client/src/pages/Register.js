import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import { useDispatch } from "react-redux";
import "../styles/Register.css"; // Ensure to include styles

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (value) => {
    try {
      dispatch({ type: "SHOW_LOADING" });
      await axios.post("/api/users/register", value);
      message.success("Registered Successfully");
      navigate("/login");
      dispatch({ type: "HIDE_LOADING" });
    } catch (error) {
      dispatch({ type: "HIDE_LOADING" });
      message.error("Something Went Wrong");
      console.log(error);
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <div className="register">
        <div className="register-form">
          <div className="logo">
            <img src="./assets/Untitled124.png" alt="Logo" className="logo-image" />
          </div>
          <h3>TeaLerin</h3>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="name" label="Name">
              <Input />
            </Form.Item>
            <Form.Item name="userId" label="User">
              <Input />
            </Form.Item>
            <Form.Item name="password" label="Password">
              <Input type="password" />
            </Form.Item>

            <Button type="primary" htmlType="submit" className="register-button">
              Register
            </Button>
            <div className="footer-links">
              <p>
                Already registered? <Link to="/login">Login Here</Link>
              </p>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Register;