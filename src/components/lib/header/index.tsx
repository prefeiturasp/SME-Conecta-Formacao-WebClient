import { LoginOutlined, MenuOutlined } from '@ant-design/icons';
import { Layout, Menu, MenuProps, Row, Space } from 'antd';
import React, { useMemo, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import MenuMobile from '~/components/main/menu-mobile';
import { AreaPublicaEnum, MENU_AREA_PUBLICA } from '~/core/constants/menu-area-publica';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';
import { BoxShadow, Colors } from '~/core/styles/colors';
import { obterIniciaisNome } from '~/core/utils/functions';
import NotificacoesContextProvider from '~/pages/notificacoes/provider';
import DropdownPerfil from '../dropdown-perfil';
import ExitButton from '../exit-button';
import NotificationButton from '../notification-button';

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
  padding: '0 16px',
};

const StyledHeader = styled(Layout.Header)<{ $autenticado?: boolean }>`
  ${(props) =>
    props.$autenticado &&
    `
    @media (max-width: 768px) {
      background-color: ${Colors.SystemSME.ConectaFormacao.PRIMARY} !important;
      padding: 16px 24px !important;
      height: 64px !important;
      min-height: 64px !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) !important;
    }
  `}
`;

const DesktopHeaderContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileHeaderContent = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media (max-width: 768px) {
    display: flex !important;
  }
`;

const BotaoHamburguer = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #ffffff;
  font-size: 24px;
  line-height: 1;

  &:hover,
  &:focus-visible {
    opacity: 0.85;
  }
`;

const AvatarMobile = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

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
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const auth = useAppSelector((state) => state.auth);
  const autenticado = auth?.autenticado;

  const nomeExibicao = auth?.nomeSocial || auth?.usuarioNome || '';
  const iniciais = useMemo(() => obterIniciaisNome(nomeExibicao), [nomeExibicao]);

  const rotaEhAreaPublica = location?.pathname?.includes(ROUTES.AREA_PUBLICA);

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
    <StyledHeader style={contentStyle} $autenticado={autenticado}>
      <DesktopHeaderContent data-testid='header-desktop-content'>
        <Link to={rotaEhAreaPublica && !autenticado ? ROUTES.AREA_PUBLICA : ROUTES.PRINCIPAL}>
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
              <NotificacoesContextProvider>
                <NotificationButton
                  onClick={() => {
                    navigate(ROUTES.NOTIFICACOES);
                  }}
                />
              </NotificacoesContextProvider>
              <ExitButton
                onClick={() => {
                  store.dispatch(setDeslogar());
                }}
              />
            </Space>
          )}
        </Row>
      </DesktopHeaderContent>

      {autenticado && (
        <MobileHeaderContent data-testid='header-mobile-content'>
          <BotaoHamburguer
            type='button'
            aria-label='Abrir menu'
            title='Abrir menu'
            aria-expanded={menuMobileAberto}
            aria-controls='menu-mobile'
            onClick={() => setMenuMobileAberto(true)}
            data-testid='btn-hamburguer-header'
          >
            <MenuOutlined style={{ fontSize: 24, color: '#FFFFFF' }} />
          </BotaoHamburguer>

          <AvatarMobile data-testid='avatar-header-mobile'>
            {iniciais || <FaUser size={14} />}
          </AvatarMobile>

          <MenuMobile open={menuMobileAberto} onClose={() => setMenuMobileAberto(false)} />
        </MobileHeaderContent>
      )}
    </StyledHeader>
  );
};

export default Header;
