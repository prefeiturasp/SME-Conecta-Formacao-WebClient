import {
  obterTiposAreaPromotora,
  obterAreaPromotoraLista,
  obterAreaPromotoraPorId,
  alterarAreaPromotora,
  inserirAreaPromotora,
  deletarAreaPromotora,
  obterUsuarioRedeParceria,
} from './area-promotora-service';
import { AreaPromotoraDTO } from '../dto/area-promotora-dto';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

import { obterRegistro, alterarRegistro, inserirRegistro, deletarRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockDeletarRegistro = deletarRegistro as jest.MockedFunction<typeof deletarRegistro>;

describe('AreaPromotoraService', () => {
  const URL_DEFAULT = 'v1/AreaPromotora';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('obterTiposAreaPromotora', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Tipo 1' },
          { id: 2, descricao: 'Tipo 2' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      await obterTiposAreaPromotora();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/tipos`);
    });

    test('deve retornar o resultado da API', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Tipo A' },
          { id: 2, descricao: 'Tipo B' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterTiposAreaPromotora();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterAreaPromotoraLista', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Área 1' },
          { id: 2, descricao: 'Área 2' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      await obterAreaPromotoraLista();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/lista`);
    });

    test('deve retornar o resultado da API', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 10, descricao: 'Área X' },
          { id: 20, descricao: 'Área Y' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterAreaPromotoraLista();

      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterAreaPromotoraPorId', () => {
    test('deve chamar obterRegistro com id numérico', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: 'Área Teste',
          tipo: 1,
        },
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      await obterAreaPromotoraPorId(1);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/1`);
    });

    test('deve chamar obterRegistro com id string', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nome: 'Área Teste',
          tipo: 1,
        },
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      await obterAreaPromotoraPorId('123');

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/123`);
    });

    test('deve retornar o resultado da API', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 5,
          nome: 'Área Específica',
          tipo: 2,
        },
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterAreaPromotoraPorId(5);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarAreaPromotora', () => {
    test('deve chamar alterarRegistro com id e dados', async () => {
      const mockData: AreaPromotoraDTO = {
        id: 1,
        nome: 'Área Alterada',
        tipo: 1,
      };
      const mockResponse = {
        sucesso: true,
        dados: mockData,
        mensagens: [],
        status: 200,
      };
      mockAlterarRegistro.mockResolvedValueOnce(mockResponse);

      await alterarAreaPromotora(1, mockData);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/1`, mockData);
    });

    test('deve funcionar com id string', async () => {
      const mockData: AreaPromotoraDTO = {
        id: 1,
        nome: 'Área Alterada',
        tipo: 2,
      };
      const mockResponse = {
        sucesso: true,
        dados: mockData,
        mensagens: [],
        status: 200,
      };
      mockAlterarRegistro.mockResolvedValueOnce(mockResponse);

      await alterarAreaPromotora('100', mockData);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/100`, mockData);
    });

    test('deve retornar o resultado da API', async () => {
      const mockData: AreaPromotoraDTO = {
        id: 1,
        nome: 'Área Teste',
        tipo: 1,
      };
      const mockResponse = {
        sucesso: true,
        dados: mockData,
        mensagens: [],
        status: 200,
      };
      mockAlterarRegistro.mockResolvedValueOnce(mockResponse);

      const result = await alterarAreaPromotora(1, mockData);

      expect(result).toEqual(mockResponse);
    });
  });

  describe('inserirAreaPromotora', () => {
    test('deve chamar inserirRegistro com os dados', async () => {
      const mockData: AreaPromotoraDTO = {
        nome: 'Nova Área',
        tipo: 1,
      };
      const mockResponse = {
        sucesso: true,
        dados: { ...mockData, id: 10 },
        mensagens: [],
        status: 200,
      };
      mockInserirRegistro.mockResolvedValueOnce(mockResponse);

      await inserirAreaPromotora(mockData);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_DEFAULT, mockData);
    });

    test('deve retornar o resultado da API com id gerado', async () => {
      const mockData: AreaPromotoraDTO = {
        nome: 'Área Nova',
        tipo: 2,
      };
      const mockResponse = {
        sucesso: true,
        dados: { ...mockData, id: 99 },
        mensagens: [],
        status: 200,
      };
      mockInserirRegistro.mockResolvedValueOnce(mockResponse);

      const result = await inserirAreaPromotora(mockData);

      expect(result).toEqual(mockResponse);
      expect(result.dados?.id).toBe(99);
    });

    test('deve funcionar com diferentes tipos de área', async () => {
      const mockData: AreaPromotoraDTO = {
        nome: 'Área Tipo 3',
        tipo: 3,
      };
      const mockResponse = {
        sucesso: true,
        dados: { ...mockData, id: 50 },
        mensagens: [],
        status: 200,
      };
      mockInserirRegistro.mockResolvedValueOnce(mockResponse);

      await inserirAreaPromotora(mockData);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_DEFAULT, mockData);
    });
  });

  describe('deletarAreaPromotora', () => {
    test('deve chamar deletarRegistro com id numérico', async () => {
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };
      mockDeletarRegistro.mockResolvedValueOnce(mockResponse);

      await deletarAreaPromotora(1);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/1`);
    });

    test('deve chamar deletarRegistro com id string', async () => {
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };
      mockDeletarRegistro.mockResolvedValueOnce(mockResponse);

      await deletarAreaPromotora('456');

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/456`);
    });

    test('deve retornar sucesso quando deletar com êxito', async () => {
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };
      mockDeletarRegistro.mockResolvedValueOnce(mockResponse);

      const result = await deletarAreaPromotora(10);

      expect(result).toEqual(mockResponse);
      expect(result.dados).toBe(true);
    });

    test('deve retornar falha quando não conseguir deletar', async () => {
      const mockResponse = {
        sucesso: false,
        dados: false,
        mensagens: ['Erro ao deletar'],
        status: 400,
      };
      mockDeletarRegistro.mockResolvedValueOnce(mockResponse);

      const result = await deletarAreaPromotora(999);

      expect(result).toEqual(mockResponse);
      expect(result.sucesso).toBe(false);
    });
  });

  describe('obterUsuarioRedeParceria', () => {
    test('deve chamar obterRegistro com a URL correta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Rede 1' },
          { id: 2, descricao: 'Rede 2' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      await obterUsuarioRedeParceria();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_DEFAULT}/lista/rede-parceria`);
    });

    test('deve retornar lista de redes de parceria', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 10, descricao: 'Rede A' },
          { id: 20, descricao: 'Rede B' },
          { id: 30, descricao: 'Rede C' },
        ],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterUsuarioRedeParceria();

      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(3);
    });

    test('deve retornar lista vazia quando não há redes', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };
      mockObterRegistro.mockResolvedValueOnce(mockResponse);

      const result = await obterUsuarioRedeParceria();

      expect(result).toEqual(mockResponse);
      expect(result.dados).toHaveLength(0);
    });
  });

  describe('Integração entre métodos', () => {
    test('deve criar, buscar, alterar e deletar área promotora', async () => {
      const novaArea: AreaPromotoraDTO = {
        nome: 'Área de Teste',
        tipo: 1,
      };

      // Inserir
      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { ...novaArea, id: 100 },
        mensagens: [],
        status: 200,
      });

      const resultInsert = await inserirAreaPromotora(novaArea);
      expect(resultInsert.dados?.id).toBe(100);

      // Buscar
      mockObterRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { ...novaArea, id: 100 },
        mensagens: [],
        status: 200,
      });

      const resultGet = await obterAreaPromotoraPorId(100);
      expect(resultGet.dados?.id).toBe(100);

      // Alterar
      const areaAlterada = { ...novaArea, id: 100, nome: 'Área Alterada' };
      mockAlterarRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: areaAlterada,
        mensagens: [],
        status: 200,
      });

      const resultUpdate = await alterarAreaPromotora(100, areaAlterada);
      expect(resultUpdate.dados?.nome).toBe('Área Alterada');

      // Deletar
      mockDeletarRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      });

      const resultDelete = await deletarAreaPromotora(100);
      expect(resultDelete.dados).toBe(true);
    });
  });
});
