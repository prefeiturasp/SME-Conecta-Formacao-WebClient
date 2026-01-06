import importacaoArquivoService from './importacao-arquivo-service';

jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
}));

import { inserirRegistro, obterRegistro, alterarRegistro } from './api';

const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;

describe('ImportacaoArquivoService', () => {
  const URL_IMPORTACAO_ARQUIVO = 'v1/ImportacaoArquivo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('importarArquivoInscricaoCursista', () => {
    test('deve importar arquivo de inscrição de cursista com sucesso', async () => {
      const file = new File(['conteúdo do arquivo'], 'inscricoes.csv', { type: 'text/csv' });
      const propostaId = 1;

      const mockResponse = {
        sucesso: true,
        dados: {
          arquivoImportacaoId: 100,
          totalRegistros: 50,
          registrosProcessados: 50,
        },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.importarArquivoInscricaoCursista(
        file,
        propostaId,
      );

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=${propostaId}`,
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'content-type': 'multipart/form-data' },
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve criar FormData corretamente ao importar arquivo', async () => {
      const file = new File(['dados'], 'teste.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const propostaId = 5;

      const mockResponse = {
        sucesso: true,
        dados: { arquivoImportacaoId: 200 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      await importacaoArquivoService.importarArquivoInscricaoCursista(file, propostaId);

      const callArgs = mockInserirRegistro.mock.calls[0];
      const formData = callArgs[1] as FormData;

      expect(formData).toBeInstanceOf(FormData);
      expect(callArgs[0]).toBe(
        `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=${propostaId}`,
      );
    });

    test('deve lidar com erro ao importar arquivo', async () => {
      const file = new File(['dados inválidos'], 'erro.csv', { type: 'text/csv' });
      const propostaId = 1;

      const mockResponse = {
        sucesso: false,
        dados: null,
        mensagens: ['Formato de arquivo inválido'],
        status: 400,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.importarArquivoInscricaoCursista(
        file,
        propostaId,
      );

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Formato de arquivo inválido');
    });

    test('deve importar arquivo para diferentes propostas', async () => {
      const file = new File(['dados'], 'inscricoes.csv', { type: 'text/csv' });

      mockInserirRegistro.mockResolvedValue({
        sucesso: true,
        dados: { arquivoImportacaoId: 1 },
        mensagens: [],
        status: 201,
      } as any);

      await importacaoArquivoService.importarArquivoInscricaoCursista(file, 1);
      await importacaoArquivoService.importarArquivoInscricaoCursista(file, 2);
      await importacaoArquivoService.importarArquivoInscricaoCursista(file, 3);

      expect(mockInserirRegistro).toHaveBeenNthCalledWith(
        1,
        `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=1`,
        expect.any(FormData),
        expect.any(Object),
      );
      expect(mockInserirRegistro).toHaveBeenNthCalledWith(
        2,
        `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=2`,
        expect.any(FormData),
        expect.any(Object),
      );
      expect(mockInserirRegistro).toHaveBeenNthCalledWith(
        3,
        `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=3`,
        expect.any(FormData),
        expect.any(Object),
      );
    });
  });

  describe('buscarInconsistencias', () => {
    test('deve buscar inconsistências de uma importação', async () => {
      const propostaId = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [
            {
              linha: 5,
              cpf: '12345678900',
              erro: 'CPF já cadastrado',
            },
            {
              linha: 10,
              cpf: '98765432100',
              erro: 'Cursista não encontrado',
            },
          ],
          totalRegistros: 2,
          totalPaginas: 1,
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.buscarInconsistencias(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_IMPORTACAO_ARQUIVO}/${propostaId}/registros-inconsistencia`,
      );
      expect(result).toEqual(mockResponse);
      expect(result.dados?.items).toHaveLength(2);
    });

    test('deve retornar lista vazia quando não há inconsistências', async () => {
      const propostaId = 1;
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

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.buscarInconsistencias(propostaId);

      expect(result.dados?.items).toEqual([]);
      expect(result.dados?.totalRegistros).toBe(0);
    });
  });

  describe('continuarProcessamento', () => {
    test('deve continuar processamento de importação', async () => {
      const arquivoImportacaoId = 100;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: ['Processamento continuado com sucesso'],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.continuarProcessamento(arquivoImportacaoId);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_IMPORTACAO_ARQUIVO}/${arquivoImportacaoId}/continuar`,
      );
      expect(result).toEqual(mockResponse);
      expect(result.dados).toBe(true);
    });

    test('deve continuar processamento para diferentes importações', async () => {
      mockAlterarRegistro.mockResolvedValue({
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      } as any);

      await importacaoArquivoService.continuarProcessamento(100);
      await importacaoArquivoService.continuarProcessamento(200);

      expect(mockAlterarRegistro).toHaveBeenCalledTimes(2);
      expect(mockAlterarRegistro).toHaveBeenNthCalledWith(
        1,
        `${URL_IMPORTACAO_ARQUIVO}/100/continuar`,
      );
      expect(mockAlterarRegistro).toHaveBeenNthCalledWith(
        2,
        `${URL_IMPORTACAO_ARQUIVO}/200/continuar`,
      );
    });

    test('deve lidar com erro ao continuar processamento', async () => {
      const arquivoImportacaoId = 999;
      const mockResponse = {
        sucesso: false,
        dados: false,
        mensagens: ['Importação não encontrada'],
        status: 404,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.continuarProcessamento(arquivoImportacaoId);

      expect(result.sucesso).toBe(false);
      expect(result.status).toBe(404);
    });
  });

  describe('cancelarProcessamento', () => {
    test('deve cancelar processamento de importação', async () => {
      const arquivoImportacaoId = 100;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: ['Processamento cancelado com sucesso'],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.cancelarProcessamento(arquivoImportacaoId);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_IMPORTACAO_ARQUIVO}/${arquivoImportacaoId}/cancelar`,
      );
      expect(result).toEqual(mockResponse);
      expect(result.dados).toBe(true);
    });

    test('deve cancelar processamento para diferentes importações', async () => {
      mockAlterarRegistro.mockResolvedValue({
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      } as any);

      await importacaoArquivoService.cancelarProcessamento(50);
      await importacaoArquivoService.cancelarProcessamento(60);
      await importacaoArquivoService.cancelarProcessamento(70);

      expect(mockAlterarRegistro).toHaveBeenCalledTimes(3);
    });

    test('deve lidar com erro ao cancelar processamento', async () => {
      const arquivoImportacaoId = 888;
      const mockResponse = {
        sucesso: false,
        dados: false,
        mensagens: ['Não é possível cancelar processamento concluído'],
        status: 400,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await importacaoArquivoService.cancelarProcessamento(arquivoImportacaoId);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Não é possível cancelar processamento concluído');
    });
  });

  describe('Integração entre métodos', () => {
    test('deve importar, verificar inconsistências e continuar processamento', async () => {
      const file = new File(['dados'], 'inscricoes.csv', { type: 'text/csv' });
      const propostaId = 1;

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { arquivoImportacaoId: 100 },
        mensagens: [],
        status: 201,
      } as any);

      const resultImport = await importacaoArquivoService.importarArquivoInscricaoCursista(
        file,
        propostaId,
      );
      expect(resultImport.sucesso).toBe(true);

      mockObterRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { items: [], totalRegistros: 0 },
        mensagens: [],
        status: 200,
      } as any);

      const resultInconsistencias =
        await importacaoArquivoService.buscarInconsistencias(propostaId);
      expect(resultInconsistencias.dados?.items).toHaveLength(0);

      mockAlterarRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      } as any);

      const resultContinuar = await importacaoArquivoService.continuarProcessamento(100);
      expect(resultContinuar.dados).toBe(true);
    });

    test('deve importar, verificar inconsistências e cancelar se houver erros', async () => {
      const file = new File(['dados'], 'inscricoes.csv', { type: 'text/csv' });
      const propostaId = 1;

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { arquivoImportacaoId: 200 },
        mensagens: [],
        status: 201,
      } as any);

      const resultImport = await importacaoArquivoService.importarArquivoInscricaoCursista(
        file,
        propostaId,
      );

      mockObterRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: {
          items: [{ linha: 1, cpf: '123', erro: 'CPF inválido' }],
          totalRegistros: 1,
        },
        mensagens: [],
        status: 200,
      } as any);

      const resultInconsistencias =
        await importacaoArquivoService.buscarInconsistencias(propostaId);
      expect(resultInconsistencias.dados?.items).toHaveLength(1);

      mockAlterarRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      } as any);

      const resultCancelar = await importacaoArquivoService.cancelarProcessamento(200);
      expect(resultCancelar.dados).toBe(true);
    });
  });
});
