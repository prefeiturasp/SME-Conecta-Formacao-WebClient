/**
 * @jest-environment jsdom
 */

Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_SME_CF_API: 'http://localhost',
      },
    },
  },
});

const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  isCancel: jest.fn(() => false),
  HttpStatusCode: { Unauthorized: 401 },
}));

jest.mock('~/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      auth: { token: 'token', dataHoraExpiracao: '2099-01-01' },
    })),
  },
}));

jest.mock('~/core/redux/modules/spin/actions', () => ({
  setSpinning: jest.fn((v) => ({ type: 'SPIN', payload: v })),
}));

jest.mock('~/components/lib/notification', () => ({
  openNotificationErrors: jest.fn(),
}));

jest.mock('~/core/date/dayjs', () => ({
  dayjs: jest.fn(() => ({
    diff: () => -9999,
  })),
}));

jest.mock('~/core/constants/mensagens', () => ({
  SERVICO_INDISPONIVEL: 'Serviço indisponível',
}));

jest.mock('~/core/redux/modules/auth/actions', () => ({
  setDadosLogin: jest.fn((payload) => ({ type: 'AUTH/SET_DADOS_LOGIN', payload })),
  setDeslogar: jest.fn(() => ({ type: 'AUTH/SET_DESLOGAR' })),
}));

jest.mock('~/core/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    autenticarRevalidar: jest.fn(),
  },
  URL_AUTENTICACAO_REVALIDAR: '/autenticacao/revalidar',
}));



import {
  obterRegistro,
  alterarRegistro,
  alterarRegistroParcial,
  inserirRegistro,
  deletarRegistro,
} from './index';
import axios from 'axios';
import { dayjs } from '../../../core/date/dayjs';
import autenticacaoService, { URL_AUTENTICACAO_REVALIDAR } from '../../../core/services/autenticacao-service';
import { setDadosLogin, setDeslogar } from '../../../core/redux/modules/auth/actions';

import { store } from '../../../core/redux';
import { setSpinning } from '../../../core/redux/modules/spin/actions';
import { openNotificationErrors } from '../../../components/lib/notification';

describe('api service', () => {
  beforeEach(() => {
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.post.mockReset();
    mockAxiosInstance.put.mockReset();
    mockAxiosInstance.patch.mockReset();
    mockAxiosInstance.delete.mockReset();
    (store.dispatch as jest.Mock).mockClear();
    (store.getState as jest.Mock).mockReturnValue({
      auth: { token: 'token', dataHoraExpiracao: '2099-01-01' },
    });
    (openNotificationErrors as jest.Mock).mockClear();
    (setSpinning as jest.Mock).mockClear();
    (axios.isCancel as jest.Mock).mockReturnValue(false);
    (autenticacaoService.autenticarRevalidar as jest.Mock).mockReset();
    (dayjs as jest.Mock).mockImplementation(() => ({
      diff: () => -9999,
    }));
    (setDadosLogin as jest.Mock).mockClear();
    (setDeslogar as jest.Mock).mockClear();
  });

  describe('obterRegistro', () => {
    test('deve retornar sucesso quando API responde corretamente', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { id: 1 },
        status: 200,
      });

      const result = await obterRegistro('/teste');

      expect(result).toEqual({
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 200,
      });

      expect(store.dispatch).toHaveBeenCalledWith(setSpinning(true));
      expect(store.dispatch).toHaveBeenCalledWith(setSpinning(false));
    });

    test('deve tratar erro e exibir notificação', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro api'] },
          status: 400,
        },
      });

      const result = await obterRegistro('/teste');

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toEqual(['erro api']);
      expect(openNotificationErrors).toHaveBeenCalledWith(['erro api']);
    });

    test('não deve exibir notificação quando silencioso=true', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro'] },
          status: 400,
        },
      });

      await obterRegistro('/teste', {}, true);

      expect(openNotificationErrors).not.toHaveBeenCalled();
    });
  });

  describe('alterarRegistro', () => {
    test('deve retornar sucesso', async () => {
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: { atualizado: true },
        status: 200,
      });

      const result = await alterarRegistro('/teste', {});

      expect(result.sucesso).toBe(true);
      expect(result.dados).toEqual({ atualizado: true });
    });

    test('deve tratar erro e exibir notificação', async () => {
      mockAxiosInstance.put.mockRejectedValueOnce({
        response: {
          data: { erros: ['erro backend'] },
          status: 400,
        },
      });

      const result = await alterarRegistro('/teste', {});

      expect(result.sucesso).toBe(false);
      expect(openNotificationErrors).toHaveBeenCalledWith(['erro backend']);
    });
  });

  describe('alterarRegistroParcial', () => {
    test('deve retornar sucesso', async () => {
      mockAxiosInstance.patch.mockResolvedValueOnce({
        data: { ok: true },
        status: 200,
      });

      const result = await alterarRegistroParcial('/teste', {});

      expect(result.sucesso).toBe(true);
    });

    test('deve tratar erro e exibir notificação', async () => {
      mockAxiosInstance.patch.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro patch'] },
          status: 400,
        },
      });

      const result = await alterarRegistroParcial('/teste', {});

      expect(result.sucesso).toBe(false);
      expect(openNotificationErrors).toHaveBeenCalledWith(['erro patch']);
    });
  });

  describe('inserirRegistro', () => {
    test('deve retornar sucesso', async () => {
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { id: 10 },
        status: 201,
      });

      const result = await inserirRegistro('/teste', {});

      expect(result.sucesso).toBe(true);
      expect(result.dados).toEqual({ id: 10 });
    });

    test('não deve exibir notificação quando mostrarNotificacao=false', async () => {
      mockAxiosInstance.post.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro post'] },
          status: 400,
        },
      });

      await inserirRegistro('/teste', {}, {}, false);

      expect(openNotificationErrors).not.toHaveBeenCalled();
    });
  });

  describe('deletarRegistro', () => {
    test('deve retornar sucesso', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({
        data: true,
        status: 200,
      });

      const result = await deletarRegistro('/teste');

      expect(result.sucesso).toBe(true);
      expect(result.dados).toBe(true);
    });

    test('deve tratar erro e exibir notificação', async () => {
      mockAxiosInstance.delete.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro delete'] },
          status: 400,
        },
      });

      const result = await deletarRegistro('/teste');

      expect(result.sucesso).toBe(false);
      expect(openNotificationErrors).toHaveBeenCalledWith(['erro delete']);
    });
  });

  describe('fluxo completo', () => {
    test('deve executar fluxo CRUD completo', async () => {
      // GET
      mockAxiosInstance.get.mockResolvedValueOnce({
        data: { id: 1 },
        status: 200,
      });

      const get = await obterRegistro('/teste');
      expect(get.dados.id).toBe(1);

      // POST
      mockAxiosInstance.post.mockResolvedValueOnce({
        data: { id: 2 },
        status: 201,
      });

      const post = await inserirRegistro('/teste', {});
      expect(post.dados.id).toBe(2);

      // PUT
      mockAxiosInstance.put.mockResolvedValueOnce({
        data: { atualizado: true },
        status: 200,
      });

      const put = await alterarRegistro('/teste', {});
      expect(put.dados.atualizado).toBe(true);

      // DELETE
      mockAxiosInstance.delete.mockResolvedValueOnce({
        data: true,
        status: 200,
      });

      const del = await deletarRegistro('/teste');
      expect(del.dados).toBe(true);
    });
  });

  describe('interceptors', () => {
    test('deve registrar interceptors de request e response', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });

    test('request interceptor deve adicionar Authorization quando token existe', async () => {
      (store.getState as jest.Mock).mockReturnValue({
        auth: { token: 'token-request', dataHoraExpiracao: '2099-01-01' },
      });

      const onRequest = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
      const requestConfig = {
        url: '/v1/propostas',
        headers: {},
      } as any;

      const result = await onRequest(requestConfig);

      expect(result.headers.Authorization).toBe('Bearer token-request');
    });

    test('request interceptor deve usar configRevalidarAutenticacao quando for URL de revalidação', async () => {
      (store.getState as jest.Mock).mockReturnValue({
        auth: { token: 'token-revalidar', dataHoraExpiracao: '2099-01-01' },
      });

      const onRequest = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
      const requestConfig = {
        url: URL_AUTENTICACAO_REVALIDAR,
        headers: {
          set: jest.fn(),
        },
      } as any;

      const result = await onRequest(requestConfig);

      expect(requestConfig.headers.set).toHaveBeenCalledWith('Authorization', 'Bearer token-revalidar');
      expect(result.headers.Authorization).toBe('Bearer token-revalidar');
    });

    test('request interceptor deve revalidar token expirado e atualizar Authorization', async () => {
      (store.getState as jest.Mock).mockReturnValue({
        auth: { token: 'token-expirado', dataHoraExpiracao: '2000-01-01' },
      });
      (dayjs as jest.Mock).mockImplementation(() => ({
        diff: () => 999,
      }));
      (autenticacaoService.autenticarRevalidar as jest.Mock).mockResolvedValue({
        data: { token: 'token-novo' },
      });

      const onRequest = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
      const requestConfig = {
        url: '/v1/propostas',
        headers: {},
      } as any;

      const result = await onRequest(requestConfig);

      expect(autenticacaoService.autenticarRevalidar).toHaveBeenCalledWith('token-expirado');
      expect(store.dispatch).toHaveBeenCalledWith(setDadosLogin({ token: 'token-novo' }));
      expect(result.headers.Authorization).toBe('Bearer token-novo');
    });

    test('request interceptor deve rejeitar quando refresh não retorna token', async () => {
      (store.getState as jest.Mock).mockReturnValue({
        auth: { token: 'token-expirado', dataHoraExpiracao: '2000-01-01' },
      });
      (dayjs as jest.Mock).mockImplementation(() => ({
        diff: () => 999,
      }));
      (autenticacaoService.autenticarRevalidar as jest.Mock).mockResolvedValue({
        data: { token: null },
      });

      const onRequest = (mockAxiosInstance.interceptors.request.use as jest.Mock).mock.calls[0][0];
      const requestConfig = {
        url: '/v1/propostas',
        headers: {},
      } as any;

      await expect(onRequest(requestConfig)).rejects.toBeUndefined();
      expect(store.dispatch).toHaveBeenCalledWith(setDeslogar());
    });

    test('response interceptor deve deslogar quando receber 401', async () => {
      const onResponseError = (mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
      const error = {
        response: { status: 401 },
      };

      await expect(onResponseError(error)).rejects.toEqual(error);
      expect(store.dispatch).toHaveBeenCalledWith(setDeslogar());
    });

    test('response interceptor deve rejeitar normalmente para cancelamento', async () => {
      const onResponseError = (mockAxiosInstance.interceptors.response.use as jest.Mock).mock.calls[0][1];
      (axios.isCancel as jest.Mock).mockReturnValue(true);
      const error = {
        response: { status: 400 },
      };

      await expect(onResponseError(error)).rejects.toEqual(error);
    });
  });

  describe('tratamento adicional de mensagens', () => {
    test('deve usar mensagem de serviço indisponível no status 503', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['mensagem original'] },
          status: 503,
        },
      });

      const result = await obterRegistro('/teste');

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toEqual(['Serviço indisponível']);
      expect(openNotificationErrors).toHaveBeenCalledWith(['Serviço indisponível']);
    });

    test('deve não exibir notificação no alterarRegistro quando mostrarNotificacao=false', async () => {
      mockAxiosInstance.put.mockRejectedValueOnce({
        response: {
          data: { mensagens: ['erro put'] },
          status: 400,
        },
      });

      await alterarRegistro('/teste', {}, undefined, false);

      expect(openNotificationErrors).not.toHaveBeenCalled();
    });
  });
});