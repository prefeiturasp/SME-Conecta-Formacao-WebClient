import rootReducer from './reducers';
import { typeSetDeslogar } from './auth/actions';

jest.mock('./auth/reducers', () =>
  jest.fn((state = { auth: 'initial' }, action) => {
    if (action.type === 'AUTH_ACTION') {
      return { auth: 'updated' };
    }

    return state;
  }),
);

jest.mock('./spin/reducers', () =>
  jest.fn((state = { spinning: false }) => state),
);

jest.mock('./perfil/reducers', () =>
  jest.fn((state = { perfilUsuario: [] }) => state),
);

jest.mock('./roles/reducers', () =>
  jest.fn((state = { roles: [], permissaoPorMenu: [] }) => state),
);

jest.mock('./area-publica-inscricao/reducers', () =>
  jest.fn((state = { formacao: {} }) => state),
);

describe('rootReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o estado inicial', () => {
    const state = rootReducer(undefined, {
      type: '@@INIT',
    });

    expect(state).toEqual({
      auth: { auth: 'initial' },
      spin: { spinning: false },
      perfil: { perfilUsuario: [] },
      roles: {
        roles: [],
        permissaoPorMenu: [],
      },
      inscricao: {
        formacao: {},
      },
    });
  });

  it('deve delegar a action para os reducers', () => {
    const state = rootReducer(undefined, {
      type: 'AUTH_ACTION',
    });

    expect(state.auth).toEqual({
      auth: 'updated',
    });
  });

  it('deve limpar o estado quando receber typeSetDeslogar', () => {
    const stateAnterior = {
      auth: { auth: 'usuario' },
      spin: { spinning: true },
      perfil: { perfilUsuario: [{ id: 1 }] },
      roles: {
        roles: [{ id: 1 }],
        permissaoPorMenu: [],
      },
      inscricao: {
        formacao: { id: 10 },
      },
    };

    const state = rootReducer(stateAnterior, {
      type: typeSetDeslogar,
    });

    expect(state).toEqual({
      auth: { auth: 'initial' },
      spin: { spinning: false },
      perfil: { perfilUsuario: [] },
      roles: {
        roles: [],
        permissaoPorMenu: [],
      },
      inscricao: {
        formacao: {},
      },
    });
  });

  it('deve manter o comportamento para actions desconhecidas', () => {
    const state = rootReducer(undefined, {
      type: 'ACTION_DESCONHECIDA',
    });

    expect(state).toEqual({
      auth: { auth: 'initial' },
      spin: { spinning: false },
      perfil: { perfilUsuario: [] },
      roles: {
        roles: [],
        permissaoPorMenu: [],
      },
      inscricao: {
        formacao: {},
      },
    });
  });
});