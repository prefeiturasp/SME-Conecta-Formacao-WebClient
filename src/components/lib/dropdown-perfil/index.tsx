import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';
import { Colors } from '~/core/styles/colors';
import { validarAutenticacao } from '~/core/utils/perfil';

const ContainerPerfil = styled(Button)`
  background: ${Colors.Neutral.LIGHTEST};
  height: 55px;
  min-width: 161px;
  border-radius: 4px;
  display: flex;
  padding: 3px 10px;
`;

const Texto = styled.div`
  font-size: 12px;
  color: ${Colors.Neutral.DARK};
`;

const DropdownPerfil: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useAppSelector((state) => state.auth);
  const [openDropdow, setOpenDropdow] = useState(false);
  const [tipoLogin, setTipoLogin] = useState<string>('Login');

  const perfil = useAppSelector((state) => state.perfil);

  const alterarPerfil = (perfilUsuarioId: string) => {
    autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId).then((response) => {
      validarAutenticacao(response.data);
    });

    if (location.pathname.startsWith(ROUTES.AREA_PUBLICA)) {
      navigate(ROUTES.AREA_PUBLICA);
    } else {
      navigate(ROUTES.PRINCIPAL);
    }
  };

  if (perfil.perfilSelecionado?.perfil == null) {
    alterarPerfil(auth.perfilUsuario[0].perfil);
  }
  const items: MenuProps['items'] = auth.perfilUsuario.map((perfil) => ({
    key: perfil?.perfil,
    label: perfil?.perfilNome,
  }));
  useEffect(() => {
    const loginUsuario = auth.usuarioLogin.replace(/[^0-9]/g, '');
    if (loginUsuario.length == 7) setTipoLogin('RF');
    if (loginUsuario.length == 11) setTipoLogin('CPF');
  }, [auth.usuarioLogin]);

  return (
    <Dropdown
      open={openDropdow}
      trigger={['click']}
      onOpenChange={(open) => {
        setOpenDropdow(open);
      }}
      menu={{
        items,
        selectable: true,
        onClick: (e) => alterarPerfil(e.key),
        defaultSelectedKeys: [perfil.perfilSelecionado?.perfil || ''],
      }}
    >
      <ContainerPerfil>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            marginRight: '7px',
            lineHeight: '16px',
          }}
        >
          <Texto style={{ fontWeight: 700 }}>{`${tipoLogin}: ${auth.usuarioLogin}`}</Texto>
          <Texto>{auth?.usuarioNome}</Texto>
          <Texto>{perfil?.perfilSelecionado?.perfilNome}</Texto>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {openDropdow ? <UpOutlined /> : <DownOutlined />}
        </div>
      </ContainerPerfil>
    </Dropdown>
  );
};

export default DropdownPerfil;
