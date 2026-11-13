import { Col, Row } from 'antd';

import conecataFormacaoLogoTitulo from '~/assets/conecta-formacao-logo-titulo.svg';
import prefeituraLogo from '~/assets/prefeitura-sp-logo.png';

import { Outlet } from 'react-router-dom';
import { BackgroundCol, BackgroundHome, ConteudoCol, HomeContainer } from './style';

const Home = () => {
  return (
    <HomeContainer align='middle'>
      <BackgroundCol sm={0} md={8} lg={12}>
        <BackgroundHome />
      </BackgroundCol>
      <ConteudoCol sm={24} md={16} lg={12}>
        <Row justify='center' className='home-logo' style={{ margin: '40px 0px' }}>
          <Col span={14}>
            <img
              style={{ width: '100%', height: '100%' }}
              src={conecataFormacaoLogoTitulo}
              alt='Conecta Formação LOGO'
            />
          </Col>
        </Row>
        <Row justify='center' className='home-conteudo'>
          <Outlet />
        </Row>
        <Row justify='center' style={{ marginTop: '40px' }}>
          <Col span={24} style={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            <img
              style={{ height: '62px', opacity: 0.8 }}
              src={prefeituraLogo}
              alt='PREFEITURA SP LOGO'
            />
          </Col>
        </Row>
        <Row justify='center' className='home-navegadores' style={{ marginTop: '10px' }}>
          Sistema homologado para navegadores: Google Chrome e Firefox
        </Row>
      </ConteudoCol>
    </HomeContainer>
  );
};

export default Home;
