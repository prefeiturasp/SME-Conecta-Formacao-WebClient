import { Col, Row } from 'antd';

import conecataFormacaoLogoTitulo from '~/assets/conecta-formacao-logo-titulo.svg';
import prefeituraLogo from '~/assets/prefeitura-sp-logo.svg';

import { Outlet } from 'react-router-dom';
import { BackgroundHome } from './style';

const Home = () => {
  return (
    <Row align='middle' style={{ height: '100vh' }}>
      <Col sm={0} md={8} lg={12}>
        <BackgroundHome />
      </Col>
      <Col sm={24} md={16} lg={12} style={{ maxHeight: '100vh', overflow: 'auto' }}>
        <Row justify='center' style={{ margin: '40px 0px' }}>
          <Col span={14}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={conecataFormacaoLogoTitulo}
              alt='Conecta Formação LOGO'
            />
          </Col>
        </Row>
        <Row justify='center'>
          <Outlet />
        </Row>
        <Row justify='center' style={{ marginTop: '80px' }}>
          <Col span={24}>
            <img
              style={{ width: '100%', height: '62px' }}
              src={prefeituraLogo}
              alt='PREFEITURA SP LOGO'
            />
          </Col>
        </Row>
        <Row justify='center' style={{ marginTop: '10px' }}>
          Sistema homologado para navegadores: Google Chrome e Firefox
        </Row>
      </Col>
    </Row>
  );
};

export default Home;
