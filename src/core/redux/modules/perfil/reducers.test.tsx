import reducer from './reducers';
import {
  setPerfilUsuario,
  setPerfilSelecionado,
  setDres,
} from './actions';
import { PerfilUsuarioDTO } from '../../../../core/dto/perfil-usuario-dto';

describe('Perfil reducer', () => {
  const initialState = {
    perfilUsuario: [],
    perfilSelecionado: undefined,
    dres: [],
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
      dres: [],
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
      dres: [],
    });
  });

  it('deve atualizar dres', () => {
    const state = reducer(
      initialState,
      setDres(['108900', '108100'])
    );

    expect(state).toEqual({
      perfilUsuario: [],
      perfilSelecionado: undefined,
      dres: ['108900', '108100'],
    });
  });

  it('deve substituir perfilSelecionado existente', () => {
    const stateAnterior = {
      perfilUsuario: [perfilAdmin],
      perfilSelecionado: perfilAdmin,
      dres: [],
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
      dres: [],
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
      dres: ['108900'],
    };

    const state = reducer(stateAnterior, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(stateAnterior);
  });
});
