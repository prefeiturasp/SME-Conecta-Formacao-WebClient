import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '~/components/lib/header';

const { Content } = Layout;

const AreaPublica: FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={{ margin: '16px 32px', marginLeft: '32px' }}>
        <Outlet />
      </Content>
      <Footer />
    </Layout>
  );
};

export default AreaPublica;
