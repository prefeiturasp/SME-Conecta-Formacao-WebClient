import autenticacaoService from './autenticacao-service';
import { AutenticacaoDTO } from '../dto/autenticacao-dto';
import { RetornoPerfilUsuarioDTO } from '../dto/retorno-perfil-usuario-dto';

jest.mock('./api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    put: jest.fn(),
  },
}));

jest.mock('../redux', () => ({
  store: {
    dispatch: jest.fn(),
  },
}));

jest.mock('../redux/modules/spin/actions', () => ({
  setSpinning: jest.fn(),
}));

import api from './api';
import { store } from '../redux';
import { setSpinning } from '../redux/modules/spin/actions';

const mockApiPost = api.post as jest.MockedFunction<typeof api.post>;
const mockApiPut = api.put as jest.MockedFunction<typeof api.put>;
const mockDispatch = store.dispatch as jest.MockedFunction<typeof store.dispatch>;
const mockSetSpinning = setSpinning as jest.MockedFunction<typeof setSpinning>;

describe('AutenticacaoService', () => {
  const URL_DEFAULT = 'v1/autenticacao';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('autenticar', () => {
    test('deve autenticar com sucesso', async () => {
      const dadosAutenticacao: AutenticacaoDTO = {
        login: 'usuario@teste.com',
        senha: 'senha123',
      };

      const mockResponse = {
        data: {
          token: 'token-jwt-valido',
          usuarioLogin: 'usuario@teste.com',
          usuarioNome: 'Usuário Teste',
          perfis: [],
        } as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPost.mockResolvedValueOnce(mockResponse as any);

      const result = await autenticacaoService.autenticar(dadosAutenticacao);

      expect(mockApiPost).toHaveBeenCalledWith(URL_DEFAULT, dadosAutenticacao);
      expect(result.sucesso).toBe(true);
      expect(result.dados).toEqual(mockResponse.data);
      expect(result.status).toBe(200);
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockSetSpinning).toHaveBeenCalledWith(false);
    });

    test('deve retornar erro quando credenciais inválidas', async () => {
      const dadosAutenticacao: AutenticacaoDTO = {
        login: 'usuario@teste.com',
        senha: 'senhaerrada',
      };

      const mockError = {
        response: {
          data: {
            mensagens: ['Credenciais inválidas'],
          },
          status: 401,
        },
      };

      mockApiPost.mockRejectedValueOnce(mockError);

      const result = await autenticacaoService.autenticar(dadosAutenticacao);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toEqual(['Credenciais inválidas']);
      expect(result.status).toBe(401);
      expect(mockDispatch).toHaveBeenCalled();
    });

    test('deve retornar mensagem de serviço indisponível quando status 503', async () => {
      const dadosAutenticacao: AutenticacaoDTO = {
        login: 'usuario@teste.com',
        senha: 'senha123',
      };

      const mockError = {
        response: {
          data: {
            mensagens: [],
          },
          status: 503,
        },
      };

      mockApiPost.mockRejectedValueOnce(mockError);

      const result = await autenticacaoService.autenticar(dadosAutenticacao);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toHaveLength(1);
      expect(result.status).toBe(503);
      expect(mockDispatch).toHaveBeenCalled();
    });

    test('deve retornar array vazio de mensagens quando erro sem mensagens', async () => {
      const dadosAutenticacao: AutenticacaoDTO = {
        login: 'usuario@teste.com',
        senha: 'senha123',
      };

      const mockError = {
        response: {
          data: {},
          status: 500,
        },
      };

      mockApiPost.mockRejectedValueOnce(mockError);

      const result = await autenticacaoService.autenticar(dadosAutenticacao);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toEqual([]);
      expect(result.status).toBe(500);
    });
  });

  describe('autenticarRevalidar', () => {
    test('deve revalidar token com sucesso', async () => {
      const token = 'token-jwt-valido';
      const mockResponse = {
        data: {
          token: 'novo-token-jwt',
          usuarioLogin: 'usuario@teste.com',
        },
        status: 200,
      };

      mockApiPost.mockResolvedValueOnce(mockResponse as any);

      const result = await autenticacaoService.autenticarRevalidar(token);

      expect(mockApiPost).toHaveBeenCalledWith(`${URL_DEFAULT}/revalidar`, { token });
      expect(result).toEqual(mockResponse);
    });

    test('deve aceitar token vazio', async () => {
      const token = '';
      const mockResponse = {
        data: null,
        status: 400,
      };

      mockApiPost.mockResolvedValueOnce(mockResponse as any);

      await autenticacaoService.autenticarRevalidar(token);

      expect(mockApiPost).toHaveBeenCalledWith(`${URL_DEFAULT}/revalidar`, { token: '' });
    });
  });

  describe('alterarPerfilSelecionado', () => {
    test('deve alterar perfil selecionado com sucesso', async () => {
      const perfilUsuarioId = '123';
      const mockResponse = {
        data: {
          token: 'novo-token-com-perfil',
          perfilAtual: '123',
        } as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      const result = await autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/perfis/${perfilUsuarioId}`);
      expect(result).toEqual(mockResponse);
    });

    test('deve funcionar com perfilUsuarioId numérico', async () => {
      const perfilUsuarioId = '456';
      const mockResponse = {
        data: {} as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      await autenticacaoService.alterarPerfilSelecionado(perfilUsuarioId);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/perfis/456`);
    });

    test('deve funcionar com perfilUsuarioId undefined', async () => {
      const mockResponse = {
        data: {} as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponse as any);

      await autenticacaoService.alterarPerfilSelecionado(undefined);

      expect(mockApiPut).toHaveBeenCalledWith(`${URL_DEFAULT}/perfis/undefined`);
    });
  });

  describe('Integração entre métodos', () => {
    test('deve autenticar e depois alterar perfil', async () => {
      const dadosAutenticacao: AutenticacaoDTO = {
        login: 'usuario@teste.com',
        senha: 'senha123',
      };

      const mockResponseAuth = {
        data: {
          token: 'token-inicial',
          perfis: [{ id: '1' }, { id: '2' }],
        } as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPost.mockResolvedValueOnce(mockResponseAuth as any);

      const resultAuth = await autenticacaoService.autenticar(dadosAutenticacao);
      expect(resultAuth.sucesso).toBe(true);

      const mockResponsePerfil = {
        data: {
          token: 'novo-token-com-perfil',
          perfilAtual: '2',
        } as RetornoPerfilUsuarioDTO,
        status: 200,
      };

      mockApiPut.mockResolvedValueOnce(mockResponsePerfil as any);

      const resultPerfil = await autenticacaoService.alterarPerfilSelecionado('2');
      expect(resultPerfil.data.perfilAtual).toBe('2');
    });
  });
});
