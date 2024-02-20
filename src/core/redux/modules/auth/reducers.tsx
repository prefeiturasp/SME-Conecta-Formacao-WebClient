import { produce } from 'immer';

import { RetornoPerfilUsuarioDTO } from '~/core/dto/retorno-perfil-usuario-dto';
import { SetDadosLogin, SetDeslogar, typeSetDadosLogin } from './actions';

const initialValues: RetornoPerfilUsuarioDTO = {
  usuarioNome: '',
  usuarioLogin: '',
  dataHoraExpiracao: '',
  token: '',
  email: '',
  autenticado: false,
  perfilUsuario: [],
};

const auth = (
  state: RetornoPerfilUsuarioDTO = initialValues,
  action: SetDadosLogin | SetDeslogar,
) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetDadosLogin:
        return { ...draft, ...action.payload };
      default:
        return draft;
    }
  });
};

export default auth;
