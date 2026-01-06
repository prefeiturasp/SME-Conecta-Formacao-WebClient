import { obterDREs } from './dre-service';
import { DreDTO } from '../dto/retorno-listagem-dto';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('DreService', () => {
  const URL_DEFAULT = 'v1/Dre';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterDREs', () => {
    test('deve obter lista de DREs sem opção todos', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { codigo: 'DRE-001', descricao: 'DRE Butantã' },
          { codigo: 'DRE-002', descricao: 'DRE Campo Limpo' },
          { codigo: 'DRE-003', descricao: 'DRE Capela do Socorro' },
        ] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: undefined },
      });
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });

    test('deve obter lista de DREs com opção todos habilitada', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { codigo: '-99', descricao: 'Todos' },
          { codigo: 'DRE-001', descricao: 'DRE Butantã' },
          { codigo: 'DRE-002', descricao: 'DRE Campo Limpo' },
        ] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs(true);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: true },
      });
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
      expect(result.dados?.[0].descricao).toBe('Todos');
    });

    test('deve obter lista de DREs com opção todos desabilitada', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { codigo: 'DRE-001', descricao: 'DRE Butantã' },
          { codigo: 'DRE-002', descricao: 'DRE Campo Limpo' },
        ] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs(false);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: false },
      });
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(2);
    });

    test('deve retornar lista vazia quando não há DREs', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.dados).toEqual([]);
      expect(result.dados).toHaveLength(0);
    });

    test('deve lidar com erro ao obter DREs', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar DREs'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar DREs');
    });

    test('deve retornar todas as 13 DREs da cidade de São Paulo', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { codigo: 'DRE-BT', descricao: 'DRE Butantã' },
          { codigo: 'DRE-CL', descricao: 'DRE Campo Limpo' },
          { codigo: 'DRE-CS', descricao: 'DRE Capela do Socorro' },
          { codigo: 'DRE-FB', descricao: 'DRE Freguesia/Brasilândia' },
          { codigo: 'DRE-G', descricao: 'DRE Guaianases' },
          { codigo: 'DRE-IP', descricao: 'DRE Ipiranga' },
          { codigo: 'DRE-IQ', descricao: 'DRE Itaquera' },
          { codigo: 'DRE-JT', descricao: 'DRE Jaçanã/Tremembé' },
          { codigo: 'DRE-MP', descricao: 'DRE São Miguel Paulista' },
          { codigo: 'DRE-PE', descricao: 'DRE Penha' },
          { codigo: 'DRE-PJ', descricao: 'DRE Pirituba/Jaraguá' },
          { codigo: 'DRE-SA', descricao: 'DRE Santo Amaro' },
          { codigo: 'DRE-SM', descricao: 'DRE São Mateus' },
        ] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.dados).toHaveLength(13);
      expect(result.sucesso).toBe(true);
    });

    test('deve manter estrutura de dados DreDTO', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            codigo: 'DRE-001',
            descricao: 'DRE Teste',
            id: 1,
          } as DreDTO,
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.dados?.[0]).toHaveProperty('codigo');
      expect(result.dados?.[0]).toHaveProperty('descricao');
    });

    test('deve chamar API com parâmetros corretos para diferentes cenários', async () => {
      mockObterRegistro.mockResolvedValue({
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      } as any);

      await obterDREs();
      expect(mockObterRegistro).toHaveBeenLastCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: undefined },
      });

      await obterDREs(true);
      expect(mockObterRegistro).toHaveBeenLastCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: true },
      });

      await obterDREs(false);
      expect(mockObterRegistro).toHaveBeenLastCalledWith(URL_DEFAULT, {
        params: { exibirOpcaoTodos: false },
      });

      expect(mockObterRegistro).toHaveBeenCalledTimes(3);
    });

    test('deve retornar status 200 em caso de sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ codigo: 'DRE-001', descricao: 'DRE Teste' }] as DreDTO[],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.status).toBe(200);
      expect(result.sucesso).toBe(true);
    });

    test('deve lidar com erro de autenticação', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Não autorizado'],
        status: 401,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(401);
      expect(result.mensagens).toContain('Não autorizado');
    });

    test('deve lidar com timeout de requisição', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Timeout na requisição'],
        status: 504,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterDREs();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(504);
    });
  });
});
