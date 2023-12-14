import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import { useState } from 'react';
import { AreaPublicaEnum, MENU_AREA_PUBLICA } from '~/core/constants/menu-area-publica';
import { ROUTES } from '~/core/enum/routes-enum';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { LoginOutlined } from '@ant-design/icons';
import { Colors, BoxShadow } from '~/core/styles/colors';
import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

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
  display: 'flex',
  alignItems: 'center',
  backgroundColor: Colors.Neutral.WHITE,
  boxShadow: BoxShadow.DEFAULT,
  justifyContent: 'space-between',
};

const HeaderAreaPublica = () => {
  const [menu, setMenu] = useState(MENU_AREA_PUBLICA.HOME.LABEL);
  const alterarMenu: MenuProps['onClick'] = (e) => {
    setMenu(e.key);
    if (e.key === AreaPublicaEnum.Home.toString()) {
      irParaHome();
    }
  };
  const navigate = useNavigate();

  const irParaHome = () => navigate(ROUTES.AREA_PUBLICA, { replace: true });
  return (
    <Header style={contentStyle}>
      <a href={ROUTES.AREA_PUBLICA}>
        <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      </a>
      <Menu onClick={alterarMenu} selectedKeys={[menu]} mode='horizontal' items={items} />
    </Header>
  );
};

export default HeaderAreaPublica;
