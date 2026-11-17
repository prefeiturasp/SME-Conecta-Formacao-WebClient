import { produce } from 'immer';

import {
  SetPerfilUsuario,
  SetPerfilSelecionado,
  SetDres,
  typeSetPerfilUsuario,
  typeSetPerfilSelecionado,
  typeSetDres,
} from './actions';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';

type PerfilStorage = {
  perfilUsuario: PerfilUsuarioDTO[];
  perfilSelecionado?: PerfilUsuarioDTO;
  dres: string[];
};

const initialValues: PerfilStorage = {
  perfilUsuario: [],
  perfilSelecionado: undefined,
  dres: [],
};

const perfil = (state = initialValues, action: SetPerfilUsuario | SetPerfilSelecionado | SetDres) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetPerfilSelecionado:
        return { ...draft, perfilSelecionado: action.payload };
      case typeSetPerfilUsuario:
        return { ...draft, perfilUsuario: action.payload };
      case typeSetDres:
        return { ...draft, dres: action.payload };
      default:
        return draft;
    }
  });
};

export default perfil;
