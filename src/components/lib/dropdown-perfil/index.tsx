import { Button, Dropdown, List } from 'antd';
import styled from 'styled-components';
import { useAppSelector } from '~/core/hooks/use-redux';
import { Colors } from '~/core/styles/colors';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';
import { useState } from 'react';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

const ItensPerfil = styled.div`
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: auto;
  background: ${Colors.Neutral.WHITE};
  border: solid ${Colors.Neutral.LIGHTEST} 1px;
  position: absolute;
`;

const Item = styled.tr`
  text-align: left;
  width: 100%;
  height: 100%;
  vertical-align: middle !important;

  &:not(:last-child) {
    border-bottom: solid ${Colors.Neutral.LIGHTEST} 1px !important;
  }

  &:hover {
    cursor: pointer;
    background: #e7e6f8;
    font-weight: bold !important;
  }

  td {
    height: 35px;
    font-size: 10px;
    padding-left: 7px;
    width: 145px;
  }

  i {
    font-size: 14px;
    color: ${Colors.Neutral.DARK};
  }
`;

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
  const auth = useAppSelector((state) => state.auth);
  const perfil = useAppSelector((state) => state.perfil);
  const [openDropdow, setOpenDropdow] = useState(false);
  const alterarPerfil = (perfilUsuarioId: string) => {
    autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId).then((response) => {
      validarAutenticacao(response.data);
    });
  };

  return (
    <div className='position-relative'>
      <Dropdown
        placement='bottomRight'
        trigger={['click']}
        open={openDropdow}
        onOpenChange={(open) => {
          setOpenDropdow(open);
        }}
        dropdownRender={() => (
          <ItensPerfil className='list-inline'>
            <List
              dataSource={auth.perfilUsuario}
              renderItem={(item: PerfilUsuarioDTO) => (
                <Item
                  key={item.perfil}
                  onClick={() => {
                    alterarPerfil(item.perfil);
                    setOpenDropdow(false);
                  }}
                >
                  <td style={{ width: '300px' }}>
                    <i>{item.perfilNome}</i>
                  </td>
                </Item>
              )}
            />
          </ItensPerfil>
        )}
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
            <Texto style={{ fontWeight: 700 }}>{`RF: ${auth.usuarioLogin}`}</Texto>
            <Texto>{auth?.usuarioNome}</Texto>
            <Texto>{perfil.perfilSelecionado?.perfilNome}</Texto>
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
    </div>
  );
};

export default DropdownPerfil;
