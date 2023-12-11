import { FC, useState } from 'react';
import { Layout, Menu, MenuProps, Row } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { Colors, BoxShadow } from '~/core/styles/colors';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { ROUTES } from '~/core/enum/routes-enum';

const items: MenuProps['items'] = [
  {
    label: 'Home',
    key: 'home',
  },
  {
    label: 'Eventos externos',
    key: 'eventos-externos',
  },
  {
    label: 'Eventos na escola',
    key: 'eventos-escola',
  },
  {
    label: 'FAQ',
    key: 'faq',
  },
  {
    label: 'Quem Somos',
    key: 'quem-somos',
  },
  {
    label: 'Seja Parceiro',
    key: 'seja-parceito',
  },
  {
    label: 'Contato',
    key: 'contato',
  },
  {
    label: <a href={ROUTES.LOGIN}>Login</a>,
    key: 'login',
    icon: <LoginOutlined />,
  },
];
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
const AreaPublica: FC = () => {
  const [current, setCurrent] = useState('home');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Layout.Header style={contentStyle}>
      <a href={ROUTES.PRINCIPAL}>
        <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      </a>
      <Row justify='end' style={{ width: '100%' }}>
        <Menu onClick={onClick} selectedKeys={[current]} mode='horizontal' items={items} />
      </Row>
    </Layout.Header>
  );
};

export default AreaPublica;
