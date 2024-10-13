import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  CopyOutlined,
  UnorderedListOutlined,
  ShoppingCartOutlined,
  BarChartOutlined
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
const { Header, Sider, Content } = Layout;

const DefaultLayout = ({ children }) => {
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  //to get localstorage data
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear();
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src="./assets/Untitled124.png" alt="Logo" className="logo-image" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Menu
            </Link>
            </Menu.Item>

            <Menu.Item key="/categoriess" icon={<CopyOutlined />}>
            <Link to="/categoriess" style={{ textDecoration: "none", color: "white" }}>
              Add New Categories
            </Link>
          </Menu.Item>

          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills" style={{ textDecoration: "none", color: "white" }}>
              Bills
            </Link>
          </Menu.Item>
          <Menu.Item key="/analytics" icon={<BarChartOutlined />}>
            <Link to="/analytics" style={{ textDecoration: "none", color: "white" }}>
            Sales
            </Link>
          </Menu.Item>

          <Menu.Item key="/items" icon={<UnorderedListOutlined />}>
            <Link to="/items" style={{ textDecoration: "none", color: "white" }}>
              Items
            </Link>
          </Menu.Item>

          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers" style={{ textDecoration: "none", color: "white" }}>
              Customers
            </Link>
          </Menu.Item>
          <Menu.Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div className="cart-item d-flex jusitfy-content-space-between flex-row" onClick={() => navigate("/cart")}>
            <p>{cartItems.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;