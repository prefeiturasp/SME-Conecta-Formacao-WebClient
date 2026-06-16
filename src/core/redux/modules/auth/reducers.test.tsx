import auth from './reducers';
import {
  setDadosLogin,
  setDeslogar,
} from './actions';
import { RetornoPerfilUsuarioDTO } from '../../../../core/dto/retorno-perfil-usuario-dto';

describe('Auth Reducer', () => {
  const initialState: RetornoPerfilUsuarioDTO = {
    usuarioNome: '',
    usuarioLogin: '',
    dataHoraExpiracao: '',
    token: '',
    email: '',
    autenticado: false,
    perfilUsuario: [],
  };

  const payload: RetornoPerfilUsuarioDTO = {
    usuarioNome: 'João Silva',
    usuarioLogin: 'joao.silva',
    dataHoraExpiracao: '2026-06-30T12:00:00',
    token: 'token-123',
    email: 'joao@teste.com',
    autenticado: true,
    perfilUsuario: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o estado inicial quando o state for undefined', () => {
    const state = auth(undefined, {
      type: '@@INIT',
    } as any);

    expect(state).toEqual(initialState);
  });

  it('deve atualizar os dados do usuário ao receber setDadosLogin', () => {
    const state = auth(initialState, setDadosLogin(payload));

    expect(state).toEqual(payload);
  });

  it('deve mesclar os dados do payload com o estado atual', () => {
    const stateAnterior: RetornoPerfilUsuarioDTO = {
      ...initialState,
      autenticado: false,
    };

    const novoPayload: RetornoPerfilUsuarioDTO = {
      ...payload,
      autenticado: true,
    };

    const state = auth(stateAnterior, setDadosLogin(novoPayload));

    expect(state.autenticado).toBe(true);
    expect(state.usuarioNome).toBe('João Silva');
    expect(state.usuarioLogin).toBe('joao.silva');
    expect(state.token).toBe('token-123');
    expect(state.email).toBe('joao@teste.com');
  });

  it('deve manter o estado quando receber setDeslogar', () => {
    const state = auth(payload, setDeslogar());

    expect(state).toEqual(payload);
  });

  it('deve manter o estado para uma action desconhecida', () => {
    const state = auth(payload, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(payload);
  });
});