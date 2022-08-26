import React from "react";
import { Layout } from "antd";
import { useDarkMode } from "../../context/DarkModeContext"

const Footer = () => {
  const { theme } = useDarkMode();
  const currentYear = new Date().getFullYear();
  const { Footer } = Layout 

  return (
    <Footer style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.backgroundColor,
      color: theme.color
    }}>
      Design &amp; Copyright &copy;{currentYear} by Ilyas
    </Footer>
  );
};

export default Footer;
