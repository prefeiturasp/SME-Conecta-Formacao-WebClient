import { Menu } from 'antd';
import { MenuProps } from 'antd/es/menu';
import { useState } from 'react';
import { AreaPublicaEnum, MENU_AREA_PUBLICA } from '~/core/constants/menu-area-publica';
import { ROUTES } from '~/core/enum/routes-enum';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { LoginOutlined } from '@ant-design/icons';
import { Colors, BoxShadow } from '~/core/styles/colors';
import { Header } from 'antd/es/layout/layout';
import { useNavigate, Link } from 'react-router-dom';

const items: MenuProps['items'] = [
  {
    label: <Link to={ROUTES.AREA_PUBLICA}>{MENU_AREA_PUBLICA.HOME.LABEL}</Link>,
    key: MENU_AREA_PUBLICA.HOME.KEY,
  },
  {
    label: <Link to={ROUTES.LOGIN}>{MENU_AREA_PUBLICA.LOGIN.LABEL}</Link>,
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
      <Link to={ROUTES.AREA_PUBLICA}>
        <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      </Link>
      <Menu onClick={alterarMenu} selectedKeys={[menu]} mode='horizontal' items={items} />
    </Header>
  );
};

export default HeaderAreaPublica;
