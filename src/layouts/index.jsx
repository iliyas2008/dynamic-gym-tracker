import React, { useState } from 'react';

import { Layout } from 'antd';
import Footer from '../components/footer/Footer';
import SideMenu from '../components/sidebar/SideMenu';
import Header from '../components/header/Header';
import { Outlet } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useDarkMode } from '../context/DarkModeContext';

const LayoutWithRoute = () => {
    const { Content } = Layout;
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = (collapsed) =>  setCollapsed(collapsed)
    const { user } = useUserAuth();
    const { theme } = useDarkMode();
  
    
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
        { user && <SideMenu collapsed={collapsed} toggleCollapsed={toggleCollapsed} />}
      <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 360,
            backgroundColor: theme.backgroundColor,
            color: theme.color
          }}
        >
          <Outlet />
        </Content>
      </Layout>
        <Footer />
    </Layout>
  );
};

export default LayoutWithRoute;