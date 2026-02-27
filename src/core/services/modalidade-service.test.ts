import { obterModalidades, URL_DEFAULT } from './modalidade-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('ModalidadeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL_DEFAULT', () => {
    test('deve ter a URL base correta', () => {
      expect(URL_DEFAULT).toBe('v1');
    });
  });

  describe('obterModalidades', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Presencial' },
          { id: 2, descricao: 'EAD' },
          { id: 3, descricao: 'Híbrido' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/Modalidade`);
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar lista de modalidades com sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Presencial' },
          { id: 2, descricao: 'EAD' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.sucesso).toBe(true);
      expect(result.dados).toHaveLength(2);
      expect(result.dados?.[0].descricao).toBe('Presencial');
      expect(result.dados?.[1].descricao).toBe('EAD');
    });

    test('deve retornar lista vazia quando não há modalidades', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.dados).toEqual([]);
      expect(result.sucesso).toBe(true);
    });

    test('deve retornar erro quando a API falhar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar modalidades'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar modalidades');
      expect(result.status).toBe(500);
    });

    test('deve retornar erro 404 quando endpoint não encontrado', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Endpoint não encontrado'],
        status: 404,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(404);
    });

    test('deve retornar todas as modalidades com ids e descrições', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Presencial' },
          { id: 2, descricao: 'EAD' },
          { id: 3, descricao: 'Híbrido' },
          { id: 4, descricao: 'Semipresencial' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.dados).toHaveLength(4);
      result.dados?.forEach((modalidade) => {
        expect(modalidade).toHaveProperty('id');
        expect(modalidade).toHaveProperty('descricao');
        expect(typeof modalidade.id).toBe('number');
        expect(typeof modalidade.descricao).toBe('string');
      });
    });

    test('deve ser chamado uma única vez', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Presencial' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterModalidades();

      expect(mockObterRegistro).toHaveBeenCalledTimes(1);
    });

    test('deve ser chamado múltiplas vezes independentemente', async () => {
      const mockResponse1 = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Presencial' }],
        mensagens: [],
        status: 200,
      };

      const mockResponse2 = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Presencial' },
          { id: 2, descricao: 'EAD' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockResponse1 as any)
        .mockResolvedValueOnce(mockResponse2 as any);

      const result1 = await obterModalidades();
      const result2 = await obterModalidades();

      expect(result1.dados).toHaveLength(1);
      expect(result2.dados).toHaveLength(2);
      expect(mockObterRegistro).toHaveBeenCalledTimes(2);
    });

    test('deve manter estrutura de RetornoListagemDTO', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Modalidade Teste' },
          { id: 2, descricao: 'Outra Modalidade' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result).toHaveProperty('sucesso');
      expect(result).toHaveProperty('dados');
      expect(result).toHaveProperty('mensagens');
      expect(result).toHaveProperty('status');
    });

    test('deve lidar com dados null', async () => {
      const mockResponse = {
        sucesso: true,
        dados: null,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.dados).toBeNull();
      expect(result.sucesso).toBe(true);
    });

    test('deve lidar com mensagens de sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Presencial' }],
        mensagens: ['Modalidades carregadas com sucesso'],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.mensagens).toHaveLength(1);
      expect(result.mensagens?.[0]).toBe('Modalidades carregadas com sucesso');
    });

    test('deve lidar com múltiplas mensagens de erro', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro de conexão', 'Timeout na requisição', 'Servidor indisponível'],
        status: 503,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.mensagens).toHaveLength(3);
      expect(result.status).toBe(503);
    });

    test('deve retornar modalidades com descrições diferentes', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Presencial' },
          { id: 2, descricao: 'EAD - Educação a Distância' },
          { id: 3, descricao: 'Híbrido (Presencial + EAD)' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterModalidades();

      expect(result.dados).toHaveLength(3);
      expect(result.dados?.[0].descricao).toBe('Presencial');
      expect(result.dados?.[1].descricao).toBe('EAD - Educação a Distância');
      expect(result.dados?.[2].descricao).toBe('Híbrido (Presencial + EAD)');
    });

    test('deve verificar URL completa da chamada', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterModalidades();

      expect(mockObterRegistro).toHaveBeenCalledWith('v1/Modalidade');
    });
  });

  describe('Tratamento de Promise', () => {
    test('deve retornar uma Promise', () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = obterModalidades();

      expect(result).toBeInstanceOf(Promise);
    });

    test('deve resolver a Promise com dados corretos', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Presencial' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await expect(obterModalidades()).resolves.toEqual(mockResponse);
    });

    test('deve rejeitar a Promise em caso de erro', async () => {
      const mockError = new Error('Erro de rede');

      mockObterRegistro.mockRejectedValueOnce(mockError);

      await expect(obterModalidades()).rejects.toThrow('Erro de rede');
    });
  });
});
