import {
  obterCargosFuncoes,
  obterPublicoAlvo,
  obterFuncaoEspecifica,
  URL_API_CARGO_FUNCAO,
} from './cargo-funcao-service';
import { CargoFuncaoTipo } from '../enum/cargo-funcao-tipo';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
}));

import { obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;

describe('CargoFuncaoService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL_API_CARGO_FUNCAO', () => {
    test('deve ter a URL correta', () => {
      expect(URL_API_CARGO_FUNCAO).toBe('v1/CargoFuncao');
    });
  });

  describe('obterCargosFuncoes', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo },
          { id: 2, descricao: 'Coordenador', tipo: CargoFuncaoTipo.Funcao },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCargosFuncoes();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CARGO_FUNCAO);
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar lista vazia quando não há cargos/funções', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCargosFuncoes();

      expect(result.dados).toEqual([]);
      expect(result.sucesso).toBe(true);
    });

    test('deve retornar erro quando a API falhar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar cargos e funções'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCargosFuncoes();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar cargos e funções');
    });
  });

  describe('obterPublicoAlvo', () => {
    test('deve chamar obterRegistro com a URL correta sem parâmetro', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo },
          { id: 2, descricao: 'Diretor', tipo: CargoFuncaoTipo.Cargo },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPublicoAlvo();

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Cargo}`,
        {
          params: { exibirOpcaoOutros: undefined },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve chamar obterRegistro com exibirOpcaoOutros true', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo },
          { id: 999, descricao: 'Outros', tipo: CargoFuncaoTipo.Cargo },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPublicoAlvo(true);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Cargo}`,
        {
          params: { exibirOpcaoOutros: true },
        },
      );
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(2);
    });

    test('deve chamar obterRegistro com exibirOpcaoOutros false', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPublicoAlvo(false);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Cargo}`,
        {
          params: { exibirOpcaoOutros: false },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar erro quando a API falhar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar público-alvo'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPublicoAlvo();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar público-alvo');
    });
  });

  describe('obterFuncaoEspecifica', () => {
    test('deve chamar obterRegistro com a URL correta sem parâmetro', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Coordenador Pedagógico', tipo: CargoFuncaoTipo.Funcao },
          { id: 2, descricao: 'Assistente de Diretor', tipo: CargoFuncaoTipo.Funcao },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterFuncaoEspecifica();

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Funcao}`,
        {
          params: { exibirOpcaoOutros: undefined },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve chamar obterRegistro com exibirOpcaoOutros true', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Coordenador Pedagógico', tipo: CargoFuncaoTipo.Funcao },
          { id: 999, descricao: 'Outros', tipo: CargoFuncaoTipo.Funcao },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterFuncaoEspecifica(true);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Funcao}`,
        {
          params: { exibirOpcaoOutros: true },
        },
      );
      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(2);
    });

    test('deve chamar obterRegistro com exibirOpcaoOutros false', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Coordenador Pedagógico', tipo: CargoFuncaoTipo.Funcao }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterFuncaoEspecifica(false);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Funcao}`,
        {
          params: { exibirOpcaoOutros: false },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar lista vazia quando não há funções', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterFuncaoEspecifica();

      expect(result.dados).toEqual([]);
      expect(result.sucesso).toBe(true);
    });

    test('deve retornar erro quando a API falhar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Erro ao buscar funções específicas'],
        status: 500,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterFuncaoEspecifica();

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Erro ao buscar funções específicas');
    });
  });

  describe('Integração entre métodos', () => {
    test('deve obter todos os cargos/funções e depois filtrar por tipo', async () => {
      const mockResponseTodos = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo },
          { id: 2, descricao: 'Coordenador', tipo: CargoFuncaoTipo.Funcao },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponseTodos as any);

      const resultTodos = await obterCargosFuncoes();
      expect(resultTodos.dados).toHaveLength(2);

      const mockResponseCargos = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponseCargos as any);

      const resultCargos = await obterPublicoAlvo();
      expect(resultCargos.dados).toHaveLength(1);

      const mockResponseFuncoes = {
        sucesso: true,
        dados: [{ id: 2, descricao: 'Coordenador', tipo: CargoFuncaoTipo.Funcao }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponseFuncoes as any);

      const resultFuncoes = await obterFuncaoEspecifica();
      expect(resultFuncoes.dados).toHaveLength(1);

      expect(mockObterRegistro).toHaveBeenCalledTimes(3);
    });

    test('deve chamar obterPublicoAlvo e obterFuncaoEspecifica com mesmos parâmetros', async () => {
      const mockResponseCargos = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Professor', tipo: CargoFuncaoTipo.Cargo }],
        mensagens: [],
        status: 200,
      };

      const mockResponseFuncoes = {
        sucesso: true,
        dados: [{ id: 2, descricao: 'Coordenador', tipo: CargoFuncaoTipo.Funcao }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro
        .mockResolvedValueOnce(mockResponseCargos as any)
        .mockResolvedValueOnce(mockResponseFuncoes as any);

      await obterPublicoAlvo(true);
      await obterFuncaoEspecifica(true);

      expect(mockObterRegistro).toHaveBeenCalledTimes(2);
      expect(mockObterRegistro).toHaveBeenNthCalledWith(
        1,
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Cargo}`,
        { params: { exibirOpcaoOutros: true } },
      );
      expect(mockObterRegistro).toHaveBeenNthCalledWith(
        2,
        `${URL_API_CARGO_FUNCAO}/tipo/${CargoFuncaoTipo.Funcao}`,
        { params: { exibirOpcaoOutros: true } },
      );
    });
  });

  describe('Tratamento de dados', () => {
    test('deve manter estrutura de dados consistente', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          {
            id: 1,
            descricao: 'Professor de Educação Infantil',
            tipo: CargoFuncaoTipo.Cargo,
            outros: 'campo extra',
          },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterPublicoAlvo();

      expect(result.dados?.[0]).toHaveProperty('id');
      expect(result.dados?.[0]).toHaveProperty('descricao');
      expect(result.dados?.[0]).toHaveProperty('tipo');
    });

    test('deve lidar com resposta null de dados', async () => {
      const mockResponse = {
        sucesso: true,
        dados: null,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCargosFuncoes();

      expect(result.dados).toBeNull();
      expect(result.sucesso).toBe(true);
    });
  });
});
