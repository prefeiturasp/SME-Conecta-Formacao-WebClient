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
  dayjs: () => ({
    diff: () => -9999, // evita refresh token
  }),
}));

jest.mock('~/core/constants/mensagens', () => ({
  SERVICO_INDISPONIVEL: 'Serviço indisponível',
}));



import {
  obterRegistro,
  alterarRegistro,
  alterarRegistroParcial,
  inserirRegistro,
  deletarRegistro,
} from './index';

import { store } from '~/core/redux';
import { setSpinning } from '~/core/redux/modules/spin/actions';
import { openNotificationErrors } from '~/components/lib/notification';

describe('api service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});