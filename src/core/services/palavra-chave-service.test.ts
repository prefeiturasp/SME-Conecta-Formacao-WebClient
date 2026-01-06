import { obterPalavrasChave, URL_API_PALAVRA_CHAVE } from './palavra-chave-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('PalavraChaveService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL_API_PALAVRA_CHAVE', () => {
    test('deve ter a URL correta', () => {
      expect(URL_API_PALAVRA_CHAVE).toBe('v1/PalavraChave');
    });
  });

  describe('obterPalavrasChave', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Educação' },
          { id: 2, descricao: 'Tecnologia' },
          { id: 3, descricao: 'Inclusão' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_PALAVRA_CHAVE);
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar lista de palavras-chave com sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Pedagogia' },
          { id: 2, descricao: 'Metodologia' },
          { id: 3, descricao: 'Didática' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.sucesso).toBe(true);
      expect(result.dados).toHaveLength(3);
      expect(result.dados?.[0].descricao).toBe('Pedagogia');
      expect(result.dados?.[1].descricao).toBe('Metodologia');
      expect(result.dados?.[2].descricao).toBe('Didática');
    });

    test('deve retornar lista vazia quando não há palavras-chave', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toEqual([]);
      expect(result.sucesso).toBe(true);
    });

    test('deve retornar erro quando a API falhar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar palavras-chave'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar palavras-chave');
      expect(result.status).toBe(500);
    });

    test('deve retornar erro 404 quando endpoint não encontrado', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Recurso não encontrado'],
        status: 404,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(404);
    });

    test('deve retornar erro 401 quando não autenticado', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Não autorizado'],
        status: 401,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(401);
      expect(result.mensagens).toContain('Não autorizado');
    });

    test('deve retornar palavras-chave com ids e descrições', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'BNCC' },
          { id: 2, descricao: 'Alfabetização' },
          { id: 3, descricao: 'Currículo' },
          { id: 4, descricao: 'Avaliação' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(4);
      result.dados?.forEach((palavra) => {
        expect(palavra).toHaveProperty('id');
        expect(palavra).toHaveProperty('descricao');
        expect(typeof palavra.id).toBe('number');
        expect(typeof palavra.descricao).toBe('string');
      });
    });

    test('deve ser chamado uma única vez', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Teste' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterPalavrasChave();

      expect(mockObterRegistro).toHaveBeenCalledTimes(1);
    });

    test('deve ser chamado múltiplas vezes independentemente', async () => {
      const mockResponse1 = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Educação Infantil' }],
        mensagens: [],
        status: 200,
      };

      const mockResponse2 = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Educação Infantil' },
          { id: 2, descricao: 'Ensino Fundamental' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockResponse1 as any)
        .mockResolvedValueOnce(mockResponse2 as any);

      const result1 = await obterPalavrasChave();
      const result2 = await obterPalavrasChave();

      expect(result1.dados).toHaveLength(1);
      expect(result2.dados).toHaveLength(2);
      expect(mockObterRegistro).toHaveBeenCalledTimes(2);
    });

    test('deve manter estrutura de RetornoListagemDTO', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Gestão Escolar' },
          { id: 2, descricao: 'Formação Continuada' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

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

      const result = await obterPalavrasChave();

      expect(result.dados).toBeNull();
      expect(result.sucesso).toBe(true);
    });

    test('deve lidar com mensagens de sucesso', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Competências' }],
        mensagens: ['Palavras-chave carregadas com sucesso'],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.mensagens).toHaveLength(1);
      expect(result.mensagens?.[0]).toBe('Palavras-chave carregadas com sucesso');
    });

    test('deve lidar com múltiplas mensagens de erro', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro de conexão', 'Banco de dados indisponível', 'Tente novamente mais tarde'],
        status: 503,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.mensagens).toHaveLength(3);
      expect(result.status).toBe(503);
    });

    test('deve retornar palavras-chave com descrições variadas', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Educação Especial' },
          { id: 2, descricao: 'EJA - Educação de Jovens e Adultos' },
          { id: 3, descricao: 'Tecnologias Assistivas' },
          { id: 4, descricao: 'Diversidade' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(4);
      expect(result.dados?.[0].descricao).toBe('Educação Especial');
      expect(result.dados?.[1].descricao).toBe('EJA - Educação de Jovens e Adultos');
      expect(result.dados?.[2].descricao).toBe('Tecnologias Assistivas');
      expect(result.dados?.[3].descricao).toBe('Diversidade');
    });

    test('deve verificar URL completa da chamada', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterPalavrasChave();

      expect(mockObterRegistro).toHaveBeenCalledWith('v1/PalavraChave');
    });

    test('deve retornar grande quantidade de palavras-chave', async () => {
      const palavrasChave = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        descricao: `Palavra-chave ${i + 1}`,
      }));

      const mockResponse = {
        sucesso: true,
        dados: palavrasChave,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(50);
      expect(result.dados?.[0].descricao).toBe('Palavra-chave 1');
      expect(result.dados?.[49].descricao).toBe('Palavra-chave 50');
    });

    test('deve lidar com palavras-chave com caracteres especiais', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Educação & Tecnologia' },
          { id: 2, descricao: 'Língua Portuguesa - Gramática' },
          { id: 3, descricao: 'Matemática (Álgebra)' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(3);
      expect(result.dados?.[0].descricao).toContain('&');
      expect(result.dados?.[1].descricao).toContain('-');
      expect(result.dados?.[2].descricao).toContain('(');
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

      const result = obterPalavrasChave();

      expect(result).toBeInstanceOf(Promise);
    });

    test('deve resolver a Promise com dados corretos', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Inovação' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await expect(obterPalavrasChave()).resolves.toEqual(mockResponse);
    });

    test('deve rejeitar a Promise em caso de erro', async () => {
      const mockError = new Error('Erro de rede');

      mockObterRegistro.mockRejectedValueOnce(mockError);

      await expect(obterPalavrasChave()).rejects.toThrow('Erro de rede');
    });

    test('deve rejeitar a Promise com timeout', async () => {
      const mockError = new Error('Timeout na requisição');

      mockObterRegistro.mockRejectedValueOnce(mockError);

      await expect(obterPalavrasChave()).rejects.toThrow('Timeout na requisição');
    });
  });

  describe('Casos de uso específicos', () => {
    test('deve retornar palavras-chave ordenadas alfabeticamente', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 3, descricao: 'Avaliação' },
          { id: 1, descricao: 'BNCC' },
          { id: 2, descricao: 'Currículo' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(3);
      expect(result.dados?.[0].descricao).toBe('Avaliação');
      expect(result.dados?.[1].descricao).toBe('BNCC');
      expect(result.dados?.[2].descricao).toBe('Currículo');
    });

    test('deve retornar palavras-chave duplicadas se existirem', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Inclusão' },
          { id: 2, descricao: 'Inclusão' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPalavrasChave();

      expect(result.dados).toHaveLength(2);
      expect(result.dados?.[0].descricao).toBe('Inclusão');
      expect(result.dados?.[1].descricao).toBe('Inclusão');
    });
  });
});
