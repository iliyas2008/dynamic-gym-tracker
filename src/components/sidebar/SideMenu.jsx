import React from "react";
import { Layout, Menu as AntMenu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";

import {
  UserOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
  MoneyCollectOutlined,
  LogoutOutlined,
  BookOutlined,
} from "@ant-design/icons";

const SideMenu = ({ collapsed, toggleCollapsed }) => {
  const { logOut, user } = useUserAuth();
  const { theme } = useDarkMode();
  const { Sider } = Layout;

  let navigate = useNavigate();
  let location = useLocation();

  const handleLogout = async () => {
    try {
      await logOut();
      localStorage.removeItem("authUser");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const HOME_SIDER_MENU_LIST = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/"),
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => {
        navigate("/users");
      },
    },
    {
      key: "/attendance",
      icon: <BookOutlined />,
      label: "Attendance",
      onClick: () => {
        navigate("/attendance");
      },
    },
    {
      key: "/timing",
      icon: <FieldTimeOutlined />,
      label: "Timing",
      onClick: () => {
        navigate("/timing");
      },
    },
    {
      key: "/calendar",
      icon: <CalendarOutlined />,
      label: "Calendar",
      onClick: () => {
        navigate("/calendar");
      },
    },
    {
      key: "/payment",
      icon: <MoneyCollectOutlined />,
      label: "Payment",
      onClick: () => {
        navigate("/payment");
      },
    },
    user && {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: () => handleLogout(),
    }
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="md"
      collapsedWidth="32"
      onBreakpoint={(broken) => {
        // console.log(broken);
      }}
      onCollapse={toggleCollapsed}
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color,
        marginTop:"6rem"
      }}
    >
      {/* <div  className="logo text-white d-flex justify-content-center align-items-center">{collapsed? "": "Dynamic Gym"}</div> */}
      <AntMenu
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.color,
        }}
        defaultSelectedKeys={["/"]}
        selectedKeys={[location.pathname]}
        items={HOME_SIDER_MENU_LIST}
      />
    </Sider>
  );
};

export default SideMenu;
