import reducer from './reducers';
import {
  setPerfilUsuario,
  setPerfilSelecionado,
} from './actions';
import { PerfilUsuarioDTO } from '../../../../core/dto/perfil-usuario-dto';

describe('Perfil reducer', () => {
  const initialState = {
    perfilUsuario: [],
    perfilSelecionado: undefined,
  };

  const perfilAdmin = {
    perfil: '1',
    perfilNome: 'Administrador',
  } as PerfilUsuarioDTO;

  const perfilProfessor = {
    perfil: '2',
    perfilNome: 'Professor',
  } as PerfilUsuarioDTO;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o estado inicial quando o state for undefined', () => {
    const state = reducer(undefined, {
      type: '@@INIT',
    } as any);

    expect(state).toEqual(initialState);
  });

  it('deve atualizar perfilUsuario', () => {
    const payload = [perfilAdmin, perfilProfessor];

    const state = reducer(
      initialState,
      setPerfilUsuario(payload)
    );

    expect(state).toEqual({
      perfilUsuario: payload,
      perfilSelecionado: undefined,
    });
  });

  it('deve atualizar perfilSelecionado', () => {
    const state = reducer(
      initialState,
      setPerfilSelecionado(perfilProfessor)
    );

    expect(state).toEqual({
      perfilUsuario: [],
      perfilSelecionado: perfilProfessor,
    });
  });

  it('deve substituir perfilSelecionado existente', () => {
    const stateAnterior = {
      perfilUsuario: [perfilAdmin],
      perfilSelecionado: perfilAdmin,
    };

    const state = reducer(
      stateAnterior,
      setPerfilSelecionado(perfilProfessor)
    );

    expect(state.perfilSelecionado).toEqual(perfilProfessor);
    expect(state.perfilUsuario).toEqual([perfilAdmin]);
  });

  it('deve substituir a lista de perfis', () => {
    const stateAnterior = {
      perfilUsuario: [perfilAdmin],
      perfilSelecionado: perfilProfessor,
    };

    const novaLista = [perfilProfessor];

    const state = reducer(
      stateAnterior,
      setPerfilUsuario(novaLista)
    );

    expect(state.perfilUsuario).toEqual(novaLista);
    expect(state.perfilSelecionado).toEqual(perfilProfessor);
  });

  it('deve manter o estado para action desconhecida', () => {
    const stateAnterior = {
      perfilUsuario: [perfilAdmin],
      perfilSelecionado: perfilProfessor,
    };

    const state = reducer(stateAnterior, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(stateAnterior);
  });
});