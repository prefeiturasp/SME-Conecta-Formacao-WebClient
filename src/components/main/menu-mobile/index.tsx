import { CloseOutlined, LogoutOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { BsFillMortarboardFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ConectaLogo from '~/assets/conecta-formacao-logo.svg';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import { store } from '~/core/redux';
import { setDeslogar } from '~/core/redux/modules/auth/actions';

export const obterTipoLogin = (login?: string): string => {
  if (!login) return 'Login';
  const loginLimpo = login.replace(/\D/g, '');
  if (loginLimpo.length === 7) return 'RF';
  if (loginLimpo.length === 11) return 'CPF';
  return 'Login';
};

const BlocoSuperiorLaranja = styled.div`
  background-color: #ff9a52;
  padding: 24px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const LinhaLogoFechar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const LogoMenuMobile = styled.img`
  height: 36px;
  width: auto;
`;

const BotaoFechar = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #ffffff;
  font-size: 20px;
  line-height: 1;

  &:hover,
  &:focus-visible {
    opacity: 0.85;
  }
`;

const NomeUsuarioDestaque = styled.h2`
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  word-break: break-word;
`;

const IdentificacaoUsuario = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: #ffffff;
  line-height: 1.4;
  word-break: break-word;
`;

const ConteudoNavegacao = styled.nav`
  background-color: #ffffff;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const ItemNavegacaoBotao = styled.button<{ $ativo?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border: none;
  background: transparent;
  color: #42474a;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: opacity 0.2s ease;

  &:hover,
  &:focus-visible {
    opacity: 0.75;
  }

  svg {
    font-size: 18px;
    color: #ff9a52;
    flex-shrink: 0;
  }
`;

const DivisorNavegacao = styled.hr`
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 16px 0;
  width: 100%;
`;

export interface MenuMobileProps {
  open: boolean;
  onClose: () => void;
}

const MenuMobile: React.FC<MenuMobileProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAppSelector((state) => state.auth);
  const perfil = useAppSelector((state) => state.perfil);

  const nomeExibicao = auth?.nomeSocial || auth?.usuarioNome || '';
  const tipoLogin = useMemo(() => obterTipoLogin(auth?.usuarioLogin), [auth?.usuarioLogin]);
  const perfilNome = perfil?.perfilSelecionado?.perfilNome || '';

  const identificacaoFormatada = useMemo(() => {
    const loginLimpo = auth?.usuarioLogin ? auth.usuarioLogin.trim() : '';
    const loginParte = loginLimpo ? `${tipoLogin}:${loginLimpo}` : '';
    if (loginParte && perfilNome) {
      return `${loginParte} - ${perfilNome}`;
    }
    return loginParte || perfilNome || '';
  }, [auth?.usuarioLogin, tipoLogin, perfilNome]);

  // Fechar menu se a viewport for redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined' && window.innerWidth > 768 && open) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open, onClose]);

  const navegarPara = (rota: string) => {
    onClose();
    navigate(rota);
  };

  const handleLogout = () => {
    onClose();
    store.dispatch(setDeslogar());
  };

  return (
    <Drawer
      placement='left'
      closable={false}
      open={open}
      onClose={onClose}
      width={312}
      styles={{
        content: {
          borderRadius: '0 16px 16px 0',
          overflow: 'hidden',
        },
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
        },
      }}
      data-testid='drawer-menu-mobile'
    >
      <BlocoSuperiorLaranja data-testid='bloco-topo-menu-mobile'>
        <LinhaLogoFechar>
          <LogoMenuMobile
            src={ConectaLogo}
            alt='Conecta Formação LOGO'
            data-testid='logo-menu-mobile'
          />
          <BotaoFechar
            type='button'
            onClick={onClose}
            aria-label='Fechar menu'
            title='Fechar menu'
            data-testid='btn-fechar-menu-mobile'
          >
            <CloseOutlined />
          </BotaoFechar>
        </LinhaLogoFechar>

        {nomeExibicao && (
          <NomeUsuarioDestaque data-testid='nome-usuario-mobile'>
            {nomeExibicao}
          </NomeUsuarioDestaque>
        )}

        {identificacaoFormatada && (
          <IdentificacaoUsuario data-testid='identificacao-usuario-mobile'>
            {identificacaoFormatada}
          </IdentificacaoUsuario>
        )}
      </BlocoSuperiorLaranja>

      <ConteudoNavegacao aria-label='Navegação mobile' data-testid='conteudo-navegacao-mobile'>
        <ItemNavegacaoBotao
          type='button'
          $ativo={location.pathname.startsWith(ROUTES.MEUS_DADOS)}
          onClick={() => navegarPara(ROUTES.MEUS_DADOS)}
          data-testid='btn-menu-meus-dados'
        >
          <FaUser />
          <span>Meus dados</span>
        </ItemNavegacaoBotao>

        <ItemNavegacaoBotao
          type='button'
          $ativo={location.pathname.startsWith(ROUTES.CERTIFICADOS)}
          onClick={() => navegarPara(ROUTES.CERTIFICADOS)}
          data-testid='btn-menu-meus-certificados'
        >
          <BsFillMortarboardFill />
          <span>Meus certificados</span>
        </ItemNavegacaoBotao>

        <DivisorNavegacao data-testid='divisor-menu-mobile' />

        <ItemNavegacaoBotao type='button' onClick={handleLogout} data-testid='btn-menu-logout'>
          <LogoutOutlined />
          <span>Sair</span>
        </ItemNavegacaoBotao>
      </ConteudoNavegacao>
    </Drawer>
  );
};

export default MenuMobile;
