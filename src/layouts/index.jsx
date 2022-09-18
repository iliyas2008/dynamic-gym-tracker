import React, { useState } from "react";

import { Affix, Layout, Switch } from "antd";
import Footer from "../components/footer/Footer";
import SideMenu from "../components/sidebar/SideMenu";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import { useUserAuth } from "../hooks/UseUserAuth";
import { useDarkMode } from "../hooks/UseDarkMode";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { RightCircleOutlined, LeftCircleOutlined } from "@ant-design/icons";

const LayoutWithRoute = () => {
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = (collapsed) => setCollapsed(collapsed);
  const { user } = useUserAuth();
  const { theme, dark, toggleDarkMode } = useDarkMode();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        {user && (
          <SideMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        )}
        <Content
          style={{
            margin: "6rem 0px 16px 16px",
            padding: 24,
            minHeight: 360,
            backgroundColor: theme.backgroundColor,
            color: theme.color,
          }}
        >
        <Affix
        className="pb-2"
        offsetTop={100}
        >
        <div className="d-flex justify-content-between">
          <div
            className={`${user ? "d-sm-block" : "d-none"}`}
            style={{
              cursor: "pointer"
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <RightCircleOutlined />
            ) : (
              <LeftCircleOutlined />
            )}
          </div>
          <Switch
            className="ms-auto me-2"
            checked={dark}
            onChange={() => toggleDarkMode()}
            checkedChildren={<BsFillSunFill color="orange" />}
            unCheckedChildren={<BsFillMoonStarsFill color="orange" />}
          />
        </div>
      </Affix>
          <Outlet />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default LayoutWithRoute;
