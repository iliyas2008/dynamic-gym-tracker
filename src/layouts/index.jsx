import React, { useState } from "react";

import { Layout } from "antd";
import Footer from "../components/footer/Footer";
import SideMenu from "../components/sidebar/SideMenu";
import Header from "../components/header/Header";
import { Outlet } from "react-router-dom";
import { useUserAuth } from "../hooks/UseUserAuth";
import { useDarkMode } from "../hooks/UseDarkMode";
import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import Fab from "../components/common/FAB"

const LayoutWithRoute = () => {
  const { Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = (collapsed) => setCollapsed(collapsed);
  const { user } = useUserAuth();
  const { theme, setTheme } = useDarkMode();

  const actions = [
    { label: "Dark", icon: <BsFillMoonStarsFill color="orange" />, onClick: ()=> setTheme("dark") },
    { label: "Light", icon: <BsFillSunFill color="orange" />, onClick: ()=> setTheme("light") },
  ];
  
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout  style={{ backgroundColor: theme.backgroundColor,
    color: theme.color }} >
        {user && (
          <SideMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
        )}
        <Content
          style={{
            margin: `6rem 0px 16px ${collapsed ? "3rem" : "12rem"}`,
            padding: 24,
            minHeight: 360,
            backgroundColor: theme.backgroundColor,
            color: theme.color,
          }}
        >
          <Outlet />
          <Fab actions={actions} />
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default LayoutWithRoute;
