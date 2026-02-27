import notificacaoService from './notificacao-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('NotificacaoService', () => {
  const URL_DEFAULT = 'v1/Notificacao';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterNotificacoesNaoLida', () => {
    test('deve obter quantidade de notificações não lidas', async () => {
      const mockResponse = {
        sucesso: true,
        dados: 5,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacoesNaoLida();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/nao-lida`);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toBe(5);
    });

    test('deve retornar zero quando não há notificações não lidas', async () => {
      const mockResponse = {
        sucesso: true,
        dados: 0,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacoesNaoLida();

      expect(result.dados).toBe(0);
    });
  });

  describe('obterNotificacoesDetalhe', () => {
    test('deve obter detalhes de uma notificação específica', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          titulo: 'Nova Notificação',
          mensagem: 'Conteúdo da notificação',
          lida: false,
          dataEnvio: '2024-01-01',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacoesDetalhe(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/${id}`);
      expect(result).toEqual(mockResponse);
      expect(result.dados?.id).toBe(1);
    });

    test('deve obter detalhes de diferentes notificações', async () => {
      const mockResponse1 = {
        sucesso: true,
        dados: { id: 10, titulo: 'Notificação 10' },
        mensagens: [],
        status: 200,
      };

      const mockResponse2 = {
        sucesso: true,
        dados: { id: 20, titulo: 'Notificação 20' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockResponse1 as any)
        .mockResolvedValueOnce(mockResponse2 as any);

      const result1 = await notificacaoService.obterNotificacoesDetalhe(10);
      const result2 = await notificacaoService.obterNotificacoesDetalhe(20);

      expect(result1.dados?.id).toBe(10);
      expect(result2.dados?.id).toBe(20);
    });
  });

  describe('obterNotificacaoCategoria', () => {
    test('deve obter categorias de notificação', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Sistema' },
          { id: 2, descricao: 'Formação' },
          { id: 3, descricao: 'Inscrição' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacaoCategoria();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/categoria`);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });

    test('deve retornar lista vazia quando não há categorias', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacaoCategoria();

      expect(result.dados).toEqual([]);
    });
  });

  describe('obterNotificacaoTipo', () => {
    test('deve obter tipos de notificação', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Informativo' },
          { id: 2, descricao: 'Alerta' },
          { id: 3, descricao: 'Urgente' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacaoTipo();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/tipo`);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });
  });

  describe('obterNotificacaoSituacao', () => {
    test('deve obter situações de notificação', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Lida' },
          { id: 2, descricao: 'Não Lida' },
          { id: 3, descricao: 'Arquivada' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await notificacaoService.obterNotificacaoSituacao();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/situacao`);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });
  });

  describe('obterNotificacao', () => {
    test('deve retornar a URL padrão', () => {
      const result = notificacaoService.obterNotificacao();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT);
      expect(result).toBe(URL_DEFAULT);
    });

    test('deve chamar obterRegistro ao executar', () => {
      notificacaoService.obterNotificacao();

      expect(mockObterRegistro).toHaveBeenCalledTimes(1);
      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT);
    });
  });

  describe('Integração entre métodos', () => {
    test('deve obter notificações não lidas e depois detalhes de cada uma', async () => {
      const mockResponseNaoLidas = {
        sucesso: true,
        dados: 2,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponseNaoLidas as any);

      const resultNaoLidas = await notificacaoService.obterNotificacoesNaoLida();
      expect(resultNaoLidas.dados).toBe(2);

      const mockResponseDetalhe1 = {
        sucesso: true,
        dados: { id: 1, titulo: 'Notificação 1', lida: false },
        mensagens: [],
        status: 200,
      };

      const mockResponseDetalhe2 = {
        sucesso: true,
        dados: { id: 2, titulo: 'Notificação 2', lida: false },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockResponseDetalhe1 as any)
        .mockResolvedValueOnce(mockResponseDetalhe2 as any);

      const detalhe1 = await notificacaoService.obterNotificacoesDetalhe(1);
      const detalhe2 = await notificacaoService.obterNotificacoesDetalhe(2);

      expect(detalhe1.dados?.lida).toBe(false);
      expect(detalhe2.dados?.lida).toBe(false);
    });

    test('deve obter categorias, tipos e situações em sequência', async () => {
      const mockCategorias = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Sistema' }],
        mensagens: [],
        status: 200,
      };

      const mockTipos = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Informativo' }],
        mensagens: [],
        status: 200,
      };

      const mockSituacoes = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Lida' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockCategorias as any)
        .mockResolvedValueOnce(mockTipos as any)
        .mockResolvedValueOnce(mockSituacoes as any);

      const categorias = await notificacaoService.obterNotificacaoCategoria();
      const tipos = await notificacaoService.obterNotificacaoTipo();
      const situacoes = await notificacaoService.obterNotificacaoSituacao();

      expect(categorias.dados).toHaveLength(1);
      expect(tipos.dados).toHaveLength(1);
      expect(situacoes.dados).toHaveLength(1);
      expect(mockObterRegistro).toHaveBeenCalledTimes(3);
    });
  });

  describe('Tratamento de erros', () => {
    test('deve lidar com erro ao obter notificações não lidas', async () => {
      const mockError = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar notificações'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockError as any);

      const result = await notificacaoService.obterNotificacoesNaoLida();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar notificações');
    });

    test('deve lidar com notificação não encontrada', async () => {
      const mockError = {
        sucesso: false,
        dados: null,
        mensagens: ['Notificação não encontrada'],
        status: 404,
      };

      mockObterRegistro.mockResolvedValueOnce(mockError as any);

      const result = await notificacaoService.obterNotificacoesDetalhe(999);

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(404);
    });
  });
});
