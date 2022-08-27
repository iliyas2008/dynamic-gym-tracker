import React from "react";
import { Layout, Typography } from "antd";
import { BsBrightnessHighFill, BsBrightnessHigh } from "react-icons/bs";
import { AiOutlineMenuUnfold, AiOutlineMenuFold } from "react-icons/ai";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { useDarkMode } from "../../hooks/UseDarkMode";

const Header = ({ collapsed, setCollapsed }) => {
  const { theme, toggleDarkMode, dark } = useDarkMode()
  const { Header } = Layout;
  const { Title } = Typography;
  const { user } = useUserAuth();
  
  return (
    <Header
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.color
      }}
    >
      <div className="d-flex">
        <Title
          style={{ marginInline: "auto" }}
          className="text-primary d-flex justify-content-center align-items-center"
          level={3}
        >
          Dynamic Gym Tracker
        </Title>
        <div className="trigger" onClick={() => toggleDarkMode()}>
          {user && dark ? (
            <BsBrightnessHigh color="orange" />
          ) : (
            <BsBrightnessHighFill color="orange" />
          )}
        </div>
        <div className={`${user ? 'd-none d-sm-block' : 'd-none'} trigger`} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <AiOutlineMenuUnfold color="orange" />
          ) : (
            <AiOutlineMenuFold color="orange" />
          )}
        </div>
      </div>
    </Header>
  );
};

export default Header;
