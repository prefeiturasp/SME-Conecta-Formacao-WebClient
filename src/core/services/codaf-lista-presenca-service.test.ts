import {
  obterListaPresencaCodaf,
  obterSituacoesCodaf,
  URL_API_CODAF_LISTA_PRESENCA,
  CodafListaPresencaFiltroDTO,
} from './codaf-lista-presenca-service';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
  ApiResult: jest.fn(),
}));

import { obterRegistro } from './api';
const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('CodafListaPresencaService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL_API_CODAF_LISTA_PRESENCA', () => {
    test('deve ter a URL correta', () => {
      expect(URL_API_CODAF_LISTA_PRESENCA).toBe('v1/CodafListaPresenca');
    });
  });

  describe('obterListaPresencaCodaf', () => {
    test('deve chamar obterRegistro com parâmetros mínimos', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {};

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: {
          NumeroPagina: 1,
          NumeroRegistros: 10,
        },
      });
    });

    test('deve usar valores padrão para paginação quando não informados', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        NomeFormacao: 'Teste',
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          NumeroPagina: 1,
          NumeroRegistros: 10,
          NomeFormacao: 'Teste',
        }),
      });
    });

    test('deve incluir NomeFormacao quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        NomeFormacao: 'Formação Teste',
        NumeroPagina: 2,
        NumeroRegistros: 20,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          NomeFormacao: 'Formação Teste',
          NumeroPagina: 2,
          NumeroRegistros: 20,
        }),
      });
    });

    test('deve incluir CodigoFormacao quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        CodigoFormacao: 123,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          CodigoFormacao: 123,
        }),
      });
    });

    test('deve incluir NumeroHomologacao quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        NumeroHomologacao: 456,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          NumeroHomologacao: 456,
        }),
      });
    });

    test('deve incluir PropostaTurmaId quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        PropostaTurmaId: 789,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          PropostaTurmaId: 789,
        }),
      });
    });

    test('deve incluir AreaPromotoraId quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        AreaPromotoraId: 10,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          AreaPromotoraId: 10,
        }),
      });
    });

    test('deve incluir Status quando fornecido como 0', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        Status: 0,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          Status: 0,
        }),
      });
    });

    test('deve incluir Status quando fornecido como número positivo', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        Status: 1,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          Status: 1,
        }),
      });
    });

    test('deve incluir DataEnvioDf quando fornecido', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        DataEnvioDf: '2024-01-15',
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: expect.objectContaining({
          DataEnvioDf: '2024-01-15',
        }),
      });
    });

    test('deve incluir todos os filtros quando todos são fornecidos', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        NomeFormacao: 'Formação Completa',
        CodigoFormacao: 100,
        NumeroHomologacao: 200,
        PropostaTurmaId: 300,
        AreaPromotoraId: 400,
        Status: 2,
        DataEnvioDf: '2024-12-26',
        NumeroPagina: 5,
        NumeroRegistros: 50,
      };

      await obterListaPresencaCodaf(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, {
        params: {
          NomeFormacao: 'Formação Completa',
          CodigoFormacao: 100,
          NumeroHomologacao: 200,
          PropostaTurmaId: 300,
          AreaPromotoraId: 400,
          Status: 2,
          DataEnvioDf: '2024-12-26',
          NumeroPagina: 5,
          NumeroRegistros: 50,
        },
      });
    });

    test('não deve incluir campos undefined ou null nos params', async () => {
      const filtros: CodafListaPresencaFiltroDTO = {
        NomeFormacao: null,
        CodigoFormacao: null,
      };

      await obterListaPresencaCodaf(filtros);

      const params = mockObterRegistro.mock.calls[0][1]?.params;
      expect(params).not.toHaveProperty('NomeFormacao');
      expect(params).not.toHaveProperty('CodigoFormacao');
    });

    test('deve retornar o resultado da API', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [],
          totalRegistros: 0,
          totalPaginas: 0,
        },
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterListaPresencaCodaf({});

      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterSituacoesCodaf', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      mockObterRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      });

      await obterSituacoesCodaf();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_LISTA_PRESENCA}/situacao`);
    });

    test('deve retornar o resultado da API', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Iniciado' },
          { id: 2, descricao: 'Finalizado' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterSituacoesCodaf();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('CodafListaPresencaFiltroDTO Type', () => {
    test('deve permitir criar objeto com todos os campos opcionais', () => {
      const filtro: CodafListaPresencaFiltroDTO = {};
      expect(filtro).toBeDefined();
    });

    test('deve permitir criar objeto com campos específicos', () => {
      const filtro: CodafListaPresencaFiltroDTO = {
        NomeFormacao: 'Teste',
        Status: 1,
      };
      expect(filtro.NomeFormacao).toBe('Teste');
      expect(filtro.Status).toBe(1);
    });
  });
});
