import { LoginOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps, Row, Space } from 'antd';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { AreaPublicaEnum, MENU_AREA_PUBLICA } from '~/core/constants/menu-area-publica';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow, Colors } from '~/core/styles/colors';
import DropdownPerfil from '../dropdown-perfil';
import ExitButton from '../exit-button';

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

const menuItems: MenuProps['items'] = [
  {
    label: <Link to={ROUTES.LOGIN}>{MENU_AREA_PUBLICA.LOGIN.LABEL}</Link>,
    key: MENU_AREA_PUBLICA.LOGIN.KEY,
    icon: <LoginOutlined />,
  },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState(MENU_AREA_PUBLICA.HOME.LABEL);

  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const rotaEhAreaPublica = location.pathname.includes(ROUTES.AREA_PUBLICA);

  const filteredMenuItems = autenticado
    ? menuItems.filter((item) => item?.key !== MENU_AREA_PUBLICA.LOGIN.KEY)
    : menuItems;

  const alterarMenu: MenuProps['onClick'] = (e) => {
    setMenu(e.key);
    if (e.key === AreaPublicaEnum.Home.toString()) {
      irParaHome();
    }
  };

  const irParaHome = () => navigate(ROUTES.AREA_PUBLICA, { replace: true });

  return (
    <Layout.Header style={contentStyle}>
      <Link to={rotaEhAreaPublica ? ROUTES.AREA_PUBLICA : ROUTES.PRINCIPAL}>
        <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
      </Link>

      <Row justify='end' style={{ width: '100%' }}>
        {rotaEhAreaPublica && (
          <Menu
            disabledOverflow
            mode='horizontal'
            onClick={alterarMenu}
            selectedKeys={[menu]}
            style={{
              height: 70,
              display: 'flex',
            }}
            items={filteredMenuItems}
          />
        )}

        {autenticado && (
          <Space>
            <DropdownPerfil />
            <ExitButton
              onClick={() => {
                store.dispatch(setDeslogar());
              }}
            />
          </Space>
        )}
      </Row>
    </Layout.Header>
  );
};

export default Header;
