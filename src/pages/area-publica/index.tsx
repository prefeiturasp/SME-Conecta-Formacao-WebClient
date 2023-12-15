import { FC } from 'react';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { Outlet } from 'react-router-dom';
import HeaderAreaPublica from './components/header';

const { Content } = Layout;

const AreaPublica: FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderAreaPublica />
      <Content style={{ margin: '16px 32px', marginLeft: '88px' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default AreaPublica;
