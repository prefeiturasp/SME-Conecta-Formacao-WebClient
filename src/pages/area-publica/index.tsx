import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from '~/components/lib/header';
import SiderConectaFormacao from '~/components/main/sider';
import { useAppSelector } from '~/core/hooks/use-redux';

const { Content } = Layout;

const SiderWrapper = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const LayoutWrapper = styled.div`
  width: 100%;
  min-height: 100vh;

  @media (max-width: 768px) {
    overflow-x: hidden;
  }

  .conecta-area-publica-interno {
    min-height: 100vh;
    transition: margin-left 0.2s ease;

    @media (max-width: 768px) {
      margin-left: 0 !important;
      width: 100% !important;
      min-width: 0 !important;
    }
  }

  .conecta-area-publica-content {
    margin: 16px 32px;
    margin-left: 32px;

    @media (max-width: 768px) {
      margin: 16px !important;
      min-width: 0 !important;
      overflow-x: hidden !important;
    }
  }
`;

const AreaPublica: FC = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);
  return (
    <LayoutWrapper data-testid="layout-wrapper">
      {autenticado ? (
        <Layout hasSider style={{ minHeight: '100vh' }}>
          <SiderWrapper data-testid="sider-wrapper">
            <SiderConectaFormacao />
          </SiderWrapper>
          <Layout className="conecta-area-publica-interno" style={{ marginLeft: '88px' }}>
            <Header />
            <Content className="conecta-area-publica-content">
              <Outlet />
            </Content>
            <Footer />
          </Layout>
        </Layout>
      ) : (
        <Layout style={{ minHeight: '100vh' }}>
          <Header />
          <Content className="conecta-area-publica-content">
            <Outlet />
          </Content>
          <Footer />
        </Layout>
      )}
    </LayoutWrapper>
  );
};

export default AreaPublica;

