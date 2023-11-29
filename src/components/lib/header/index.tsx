import { Layout, Row, Space } from 'antd';
import React from 'react';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow, Colors } from '~/core/styles/colors';
import ExitButton from '../exit-button';
import DropdownPerfil from '../dropdown-perfil';
import { ROUTES } from '~/core/enum/routes-enum';

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 11,
  width: '100%',
  height: '70px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: Colors.Neutral.WHITE,
  boxShadow: BoxShadow.DEFAULT,
};

const Header: React.FC = () => {
  return (
    <Layout.Header style={contentStyle}>
      <a href={ROUTES.PRINCIPAL}>
        <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      </a>
      <Row justify='end' style={{ width: '100%' }}>
        <Space>
          <DropdownPerfil />
          <ExitButton
            onClick={() => {
              store.dispatch(setDeslogar());
            }}
          />
        </Space>
      </Row>
    </Layout.Header>
  );
};

export default Header;
