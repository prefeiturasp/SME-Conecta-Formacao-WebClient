import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '~/components/lib/header';
import SiderConectaFormacao from '~/components/main/sider';
import { useAppSelector } from '~/core/hooks/use-redux';

const { Content } = Layout;

const AreaPublica: FC = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  return (
    <>
      {autenticado ? (
        <Layout hasSider style={{ minHeight: '100vh' }}>
          <SiderConectaFormacao />
          <Layout style={{ marginLeft: '88px' }}>
            <Header />
            <Content style={{ margin: '16px 32px', marginLeft: '32px' }}>
              <Outlet />
            </Content>
            <Footer />
          </Layout>
        </Layout>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content style={{ margin: '16px 32px', marginLeft: '32px' }}>
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      )}
    </>
  );
};

export default AreaPublica;
