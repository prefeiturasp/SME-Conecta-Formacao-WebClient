import { FC, useState } from 'react';
import { Layout, Menu, MenuProps, Row } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { Colors, BoxShadow } from '~/core/styles/colors';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { ROUTES } from '~/core/enum/routes-enum';
import { MENU_AREA_PUBLICA } from '~/core/constants/menu-area-publica';

const items: MenuProps['items'] = [
  {
    label: MENU_AREA_PUBLICA.HOME.LABEL,
    key: MENU_AREA_PUBLICA.HOME.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.EVENTOS_EXTERNO.LABEL,
    key: MENU_AREA_PUBLICA.EVENTOS_EXTERNO.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.EVENTOS_ESCOLA.LABEL,
    key: MENU_AREA_PUBLICA.EVENTOS_ESCOLA.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.FAQ.LABEL,
    key: MENU_AREA_PUBLICA.FAQ.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.QUEM_SOMOS.LABEL,
    key: MENU_AREA_PUBLICA.QUEM_SOMOS.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.SEJA_PARCEITO.LABEL,
    key: MENU_AREA_PUBLICA.SEJA_PARCEITO.KEY,
  },
  {
    label: MENU_AREA_PUBLICA.CONTATO.LABEL,
    key: MENU_AREA_PUBLICA.CONTATO.KEY,
  },
  {
    label: <a href={ROUTES.LOGIN}>{MENU_AREA_PUBLICA.LOGIN.LABEL}</a>,
    key: MENU_AREA_PUBLICA.LOGIN.KEY,
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
  const [current, setCurrent] = useState(MENU_AREA_PUBLICA.HOME.LABEL);

  const onClick: MenuProps['onClick'] = (e) => {
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
