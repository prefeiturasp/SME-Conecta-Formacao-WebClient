import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';

export const typeSetPerfilUsuario = '@perfil/setPerfilUsuario';
export const typeSetPerfilSelecionado = '@perfil/setPerfilSelecionado';

export interface SetPerfilSelecionado {
  type: typeof typeSetPerfilSelecionado;
  payload: PerfilUsuarioDTO;
}

export interface SetPerfilUsuario {
  type: typeof typeSetPerfilUsuario;
  payload: PerfilUsuarioDTO[];
}

export const setPerfilUsuario = (payload: PerfilUsuarioDTO[]): SetPerfilUsuario => {
  return {
    type: typeSetPerfilUsuario,
    payload,
  };
};

export const setPerfilSelecionado = (payload: PerfilUsuarioDTO): SetPerfilSelecionado => {
  return {
    type: typeSetPerfilSelecionado,
    payload,
  };
};
