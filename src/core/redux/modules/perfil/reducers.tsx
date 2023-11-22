import { produce } from 'immer';

import {
  SetPerfilUsuario,
  SetPerfilSelecionado,
  typeSetPerfilUsuario,
  typeSetPerfilSelecionado,
} from './actions';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';

type PerfilStorage = {
  perfilUsuario: PerfilUsuarioDTO[];
  perfilSelecionado?: PerfilUsuarioDTO;
};

const initialValues: PerfilStorage = {
  perfilUsuario: [],
  perfilSelecionado: undefined,
};

const perfil = (state = initialValues, action: SetPerfilUsuario | SetPerfilSelecionado) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetPerfilSelecionado:
        return { ...draft, perfilSelecionado: action.payload };
      case typeSetPerfilUsuario:
        return { ...draft, perfilUsuario: action.payload };
      default:
        return draft;
    }
  });
};

export default perfil;
