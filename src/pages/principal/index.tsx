import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '~/components/lib/footer';
import Header from '~/components/lib/header';
import Sider from '~/components/lib/sider';

const { Content } = Layout;

const Principal: React.FC = () => (
  <Layout hasSider style={{ minHeight: '100vh' }}>
    <Sider />
    <Layout style={{ marginLeft: '88px' }}>
      <Header />
      <Content style={{ margin: '16px 32px' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  </Layout>
);

export default Principal;
