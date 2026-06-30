import {
  alterarCodafSuplementar,
  criarCodafSuplementar,
  deletarRetificacao,
  excluirCodafSuplementar,
  fazerUploadAnexoCodaf,
  obterCodafOriginal,
  obterCodafSuplementar,
  obterCodafSuplementarPorId,
  URL_API_CODAF_SUPLEMENTAR,
  CodafSuplementarFiltroDTO,
  CriarCodafSuplementarDTO,
  AlterarCodafSuplementarDTO,
  InscritoDTO,
} from './codaf-suplementar-service';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
  ApiResult: jest.fn(),
}));

import { alterarRegistro, deletarRegistro, inserirRegistro, obterRegistro } from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;
const mockDeletarRegistro = deletarRegistro as jest.MockedFunction<typeof deletarRegistro>;

describe('CodafSuplementarService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL_API_CODAF_SUPLEMENTAR', () => {
    test('deve ter a URL correta', () => {
      expect(URL_API_CODAF_SUPLEMENTAR).toBe('v1/CodafSuplementar');
    });
  });

  describe('obterCodafSuplementar', () => {
    test('deve chamar obterRegistro com paginação padrão', async () => {
      const filtros: CodafSuplementarFiltroDTO = {};

      await obterCodafSuplementar(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_SUPLEMENTAR, {
        params: {
          NumeroPagina: 1,
          NumeroRegistros: 10,
        },
      });
    });

    test('deve incluir filtros válidos', async () => {
      const filtros: CodafSuplementarFiltroDTO = {
        NomeFormacao: 'Formação Teste',
        CodigoFormacao: 123,
        NumeroHomologacao: 456,
        PropostaTurmaId: 789,
        AreaPromotoraId: 10,
        Status: 0,
        NumeroPagina: 2,
        NumeroRegistros: 20,
      };

      await obterCodafSuplementar(filtros);

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_API_CODAF_SUPLEMENTAR, {
        params: {
          NomeFormacao: 'Formação Teste',
          CodigoFormacao: 123,
          NumeroHomologacao: 456,
          PropostaTurmaId: 789,
          AreaPromotoraId: 10,
          Status: 0,
          NumeroPagina: 2,
          NumeroRegistros: 20,
        },
      });
    });

    test('não deve incluir DataEnvioDf para suplemento', async () => {
      const filtros: CodafSuplementarFiltroDTO = {
        DataEnvioDf: '2024-12-26',
      };

      await obterCodafSuplementar(filtros);

      const params = mockObterRegistro.mock.calls[0][1]?.params;
      expect(params).not.toHaveProperty('DataEnvioDf');
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

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCodafSuplementar({});

      expect(result).toEqual(mockResponse);
    });
  });

  describe('criarCodafSuplementar', () => {
    test('deve chamar inserirRegistro com URL e payload', async () => {
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 90,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const dados: CriarCodafSuplementarDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação',
        inscritos,
        codafId: 99,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await criarCodafSuplementar(dados);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_SUPLEMENTAR, dados);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterCodafOriginal', () => {
    test('deve chamar obterRegistro com rota de codaf original', async () => {
      const codafId = 55;
      const mockResponse = {
        sucesso: true,
        dados: {},
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCodafOriginal(codafId);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/codaf/${codafId}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterCodafSuplementarPorId', () => {
    test('deve chamar obterRegistro com rota por id', async () => {
      const id = 77;
      const mockResponse = {
        sucesso: true,
        dados: {},
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCodafSuplementarPorId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarCodafSuplementar', () => {
    test('deve chamar alterarRegistro com id e payload', async () => {
      const id = 8;
      const dados: AlterarCodafSuplementarDTO = {
        codafId: 99,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Atualização',
        inscritos: [
          {
            inscricaoId: 1,
            percentualFrequencia: 100,
            conceitoFinal: 'S',
            atividadeObrigatorio: true,
            aprovado: true,
          },
        ],
      };

      const mockResponse = {
        sucesso: true,
        dados: { id },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await alterarCodafSuplementar(id, dados);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/${id}`, dados);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('excluirCodafSuplementar', () => {
    test('deve chamar deletarRegistro com id', async () => {
      const id = 42;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await excluirCodafSuplementar(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('fazerUploadAnexoCodaf', () => {
    test('deve chamar inserirRegistro com formData e configuração de header', async () => {
      const formData = new FormData();
      formData.append('arquivo', new Blob(['conteudo'], { type: 'text/plain' }), 'arquivo.txt');

      const configuracaoHeader = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const mockResponse = {
        sucesso: true,
        dados: {
          arquivoCodigo: 'abc123',
          nomeArquivo: 'arquivo.txt',
          extensao: '.txt',
          urlDownload: 'https://teste/arquivo.txt',
          contentType: 'text/plain',
          tamanhoBytes: 10,
        },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await fazerUploadAnexoCodaf(formData, configuracaoHeader);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_SUPLEMENTAR}/anexos/temporarios`,
        formData,
        configuracaoHeader,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletarRetificacao', () => {
    test('deve deletar retificação por id number', async () => {
      const id = 12;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await deletarRetificacao(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/retificacoes/${id}`);
      expect(result).toEqual(mockResponse);
    });

    test('deve deletar retificação por id string', async () => {
      const id = '13';
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await deletarRetificacao(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_SUPLEMENTAR}/retificacoes/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
