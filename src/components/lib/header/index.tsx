import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Layout, Row, Space } from 'antd';
import React from 'react';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow } from '~/core/styles/colors';
import ExitButton from '../exit-button';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: <p>Admin 001</p>,
  },
  {
    key: '2',
    label: <p>Admin 002</p>,
  },
  {
    key: '3',
    label: <p>Admin 003</p>,
  },
];

const contentStyle: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 11,
  width: '100%',
  height: '72px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  boxShadow: BoxShadow.DEFAULT,
};

const Header: React.FC = () => {
  return (
    <Layout.Header style={contentStyle}>
      <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      <Row justify='end' style={{ width: '100%' }}>
        <Space>
          <Dropdown menu={{ items }} arrow>
            <Space>
              Adm COTIC
              <DownOutlined />
            </Space>
          </Dropdown>
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
