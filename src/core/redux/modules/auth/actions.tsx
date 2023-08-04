import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';

export const typeSetDeslogar = '@auth/setDeslogar';
export const typeSetDadosLogin = '@auth/setDadosLogin';

export interface SetDeslogar {
  type: typeof typeSetDeslogar;
}

export interface SetDadosLogin {
  type: typeof typeSetDadosLogin;
  payload: RetornoPerfilUsuarioDTO;
}

export const setDeslogar = (): SetDeslogar => {
  return {
    type: typeSetDeslogar,
  };
};

export const setDadosLogin = (payload: RetornoPerfilUsuarioDTO): SetDadosLogin => {
  return {
    type: typeSetDadosLogin,
    payload,
  };
};
