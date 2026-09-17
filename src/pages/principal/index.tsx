import { Layout } from 'antd';
import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Footer from '~/components/lib/footer';
import Header from '~/components/lib/header';
import VoltarAoTopoButton from '~/components/main/button/voltar-topo';
import SiderConectaFormacao from '~/components/main/sider';

const { Content } = Layout;

const SiderWrapper = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const LayoutWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;

  .conecta-layout-interno {
    min-height: 100vh;
    transition: margin-left 0.2s ease;

    @media (max-width: 768px) {
      margin-left: 0 !important;
      width: 100% !important;
      min-width: 0 !important;
    }
  }

  .conecta-layout-content {
    @media (max-width: 768px) {
      margin: 16px !important;
      min-width: 0 !important;
      overflow-x: hidden !important;
    }
  }
`;

const Principal: React.FC = () => (
  <LayoutWrapper data-testid='layout-wrapper'>
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <SiderWrapper data-testid='sider-wrapper'>
        <SiderConectaFormacao />
      </SiderWrapper>
      <Layout className='conecta-layout-interno' style={{ marginLeft: '88px' }}>
        <Header />
        <Content className='conecta-layout-content' style={{ margin: '16px 32px' }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
    <VoltarAoTopoButton />
  </LayoutWrapper>
);

export default Principal;
