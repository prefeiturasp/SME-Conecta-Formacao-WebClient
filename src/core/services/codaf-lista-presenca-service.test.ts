import {
  obterListaPresencaCodaf,
  obterSituacoesCodaf,
  criarCodafListaPresenca,
  atualizarCodafListaPresenca,
  obterCodafListaPresencaPorId,
  obterInscritosTurma,
  verificarTurmaPossuiLista,
  deletarRetificacao,
  baixarModeloTermoResponsabilidade,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
  URL_API_CODAF_LISTA_PRESENCA,
  CodafListaPresencaFiltroDTO,
  CriarCodafListaPresencaDTO,
  InscritoDTO,
  RetificacaoDTO,
  AnexoTemporarioDTO,
} from './codaf-lista-presenca-service';

jest.mock('./api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
  ApiResult: jest.fn(),
  default: {
    get: jest.fn(),
  },
}));

import { obterRegistro, inserirRegistro, alterarRegistro, deletarRegistro } from './api';
import api from './api';
const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;
const mockDeletarRegistro = deletarRegistro as jest.MockedFunction<typeof deletarRegistro>;
const mockApiGet = api.get as jest.MockedFunction<typeof api.get>;

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

  describe('criarCodafListaPresenca', () => {
    test('deve criar lista de presença sem retificações', async () => {
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 85,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const dados: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação teste',
        inscritos,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Lista criada com sucesso' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await criarCodafListaPresenca(dados);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, dados);
      expect(result).toEqual(mockResponse);
    });

    test('deve criar lista de presença com retificações', async () => {
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 85,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const retificacoes: RetificacaoDTO[] = [
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 10,
          dataRetificacao: '2024-01-15',
        },
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 15,
          dataRetificacao: '2024-02-01',
        },
      ];

      const dados: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação teste',
        inscritos,
        retificacoes,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Lista criada com sucesso' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await criarCodafListaPresenca(dados);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, dados);
      expect(result).toEqual(mockResponse);
      expect(result.dados).toBeDefined();
    });

    test('deve criar lista de presença com múltiplas retificações', async () => {
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 90,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const retificacoes: RetificacaoDTO[] = [
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 5,
          dataRetificacao: '2024-01-10',
        },
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 8,
          dataRetificacao: '2024-01-20',
        },
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 12,
          dataRetificacao: '2024-02-05',
        },
      ];

      const dados: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação com 3 retificações',
        inscritos,
        retificacoes,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await criarCodafListaPresenca(dados);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_API_CODAF_LISTA_PRESENCA, dados);
      expect(result.sucesso).toBe(true);
    });
  });

  describe('atualizarCodafListaPresenca', () => {
    test('deve atualizar lista de presença sem retificações', async () => {
      const id = 1;
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 90,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const dados: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação atualizada',
        inscritos,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Lista atualizada com sucesso' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await atualizarCodafListaPresenca(id, dados);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/${id}`,
        dados,
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve atualizar lista de presença com retificações', async () => {
      const id = 1;
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 90,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const retificacoes: RetificacaoDTO[] = [
        {
          id: 1,
          codafListaPresencaId: 1,
          paginaRetificacaoDom: 10,
          dataRetificacao: '2024-01-15',
        },
      ];

      const dados: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação atualizada',
        inscritos,
        retificacoes,
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Lista atualizada com sucesso' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await atualizarCodafListaPresenca(id, dados);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/${id}`,
        dados,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterCodafListaPresencaPorId', () => {
    test('deve obter lista de presença por ID', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          propostaId: 10,
          propostaTurmaId: 20,
          numeroHomologacao: 100,
          nomeFormacao: 'Formação Teste',
          codigoFormacao: 1001,
          numeroComunicado: 50,
          dataPublicacao: '2024-01-01',
          paginaComunicadoDom: 5,
          dataPublicacaoDom: '2024-01-02',
          codigoCursoEol: 123,
          codigoNivel: 1,
          observacao: 'Observação',
          status: 1,
          alteradoEm: null,
          alteradoPor: null,
          alteradoLogin: null,
          criadoEm: '2024-01-01T10:00:00',
          criadoPor: 'Admin',
          criadoLogin: 'admin@teste.com',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterCodafListaPresencaPorId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_CODAF_LISTA_PRESENCA}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterInscritosTurma', () => {
    test('deve obter inscritos de uma turma com paginação padrão', async () => {
      const turmaId = 10;
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [
            {
              id: 1,
              cpf: '12345678900',
              nome: 'João Silva',
              percentualFrequencia: 85,
              conceitoFinal: 'S',
              atividadeObrigatorio: true,
              aprovado: true,
            },
          ],
          totalPaginas: 1,
          totalRegistros: 1,
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await obterInscritosTurma(turmaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/inscritos-turma/${turmaId}`,
        {
          params: {
            numeroPagina: 1,
            numeroRegistros: 9999,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve obter inscritos com paginação customizada', async () => {
      const turmaId = 10;
      const numeroPagina = 2;
      const numeroRegistros = 50;

      const mockResponse = {
        sucesso: true,
        dados: {
          items: [],
          totalPaginas: 1,
          totalRegistros: 0,
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await obterInscritosTurma(turmaId, numeroPagina, numeroRegistros);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/inscritos-turma/${turmaId}`,
        {
          params: {
            numeroPagina: 2,
            numeroRegistros: 50,
          },
        },
      );
    });
  });

  describe('verificarTurmaPossuiLista', () => {
    test('deve verificar se turma possui lista sem lista de presença ID', async () => {
      const propostaTurmaId = 10;
      const mockResponse = {
        sucesso: true,
        dados: false,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await verificarTurmaPossuiLista(propostaTurmaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/turmas/${propostaTurmaId}/possui-lista`,
        {
          data: {},
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve verificar se turma possui lista com lista de presença ID', async () => {
      const propostaTurmaId = 10;
      const listaPresencaId = 5;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await verificarTurmaPossuiLista(propostaTurmaId, listaPresencaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/turmas/${propostaTurmaId}/possui-lista`,
        {
          data: { listaPresencaId: 5 },
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletarRetificacao', () => {
    test('deve deletar retificação por ID', async () => {
      const retificacaoId = 5;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await deletarRetificacao(retificacaoId);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/retificacoes/${retificacaoId}`,
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve deletar retificação por ID em string', async () => {
      const retificacaoId = '10';
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await deletarRetificacao(retificacaoId);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/retificacoes/${retificacaoId}`,
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve retornar erro ao deletar retificação inexistente', async () => {
      const retificacaoId = 999;
      const mockResponse = {
        sucesso: false,
        dados: false,
        mensagens: ['Retificação não encontrada'],
        status: 404,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await deletarRetificacao(retificacaoId);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Retificação não encontrada');
    });
  });

  describe('Integração - Fluxo completo com retificações', () => {
    test('deve criar e depois atualizar uma lista de presença com retificações', async () => {
      const inscritos: InscritoDTO[] = [
        {
          inscricaoId: 1,
          percentualFrequencia: 85,
          conceitoFinal: 'S',
          atividadeObrigatorio: true,
          aprovado: true,
        },
      ];

      const dadosCriacao: CriarCodafListaPresencaDTO = {
        propostaId: 1,
        propostaTurmaId: 10,
        dataPublicacao: '2024-01-01',
        dataPublicacaoDom: '2024-01-02',
        numeroComunicado: 100,
        paginaComunicadoDom: 5,
        codigoCursoEol: 123,
        codigoNivel: 1,
        observacao: 'Observação inicial',
        inscritos,
      };

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      } as any);

      const resultCriacao = await criarCodafListaPresenca(dadosCriacao);
      expect(resultCriacao.sucesso).toBe(true);

      const retificacoes: RetificacaoDTO[] = [
        {
          id: 0,
          codafListaPresencaId: 0,
          paginaRetificacaoDom: 10,
          dataRetificacao: '2024-01-15',
        },
      ];

      const dadosAtualizacao: CriarCodafListaPresencaDTO = {
        ...dadosCriacao,
        observacao: 'Observação atualizada',
        retificacoes,
      };

      mockAlterarRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 200,
      } as any);

      const resultAtualizacao = await atualizarCodafListaPresenca(1, dadosAtualizacao);
      expect(resultAtualizacao.sucesso).toBe(true);
    });
  });

  describe('baixarModeloTermoResponsabilidade', () => {
    test('deve baixar modelo do termo de responsabilidade com sucesso', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'content-disposition': 'attachment; filename="Modelo_Termo_Responsabilidade.docx"',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await baixarModeloTermoResponsabilidade();

      expect(mockApiGet).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/termo-responsabilidade/modelo`,
        {
          responseType: 'arraybuffer',
        },
      );
      expect(result.data).toEqual(mockArrayBuffer);
      expect(result.status).toBe(200);
    });

    test('deve retornar dados do arquivo com headers corretos', async () => {
      const mockArrayBuffer = new ArrayBuffer(1024);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'content-disposition': 'attachment; filename="Termo.docx"',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await baixarModeloTermoResponsabilidade();

      expect(result.headers['content-type']).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
      expect(result.headers['content-disposition']).toContain('attachment');
      expect(result.headers['content-disposition']).toContain('filename');
    });

    test('deve retornar erro quando falhar ao baixar modelo', async () => {
      const mockError = {
        response: {
          status: 500,
          data: 'Erro ao gerar arquivo',
        },
      };

      mockApiGet.mockRejectedValueOnce(mockError);

      await expect(baixarModeloTermoResponsabilidade()).rejects.toEqual(mockError);
    });

    test('deve retornar erro 404 quando modelo não encontrado', async () => {
      const mockError = {
        response: {
          status: 404,
          data: 'Modelo não encontrado',
        },
      };

      mockApiGet.mockRejectedValueOnce(mockError);

      await expect(baixarModeloTermoResponsabilidade()).rejects.toEqual(mockError);
    });

    test('deve chamar API com responseType arraybuffer', async () => {
      const mockResponse = {
        data: new ArrayBuffer(8),
        status: 200,
        headers: {},
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      await baixarModeloTermoResponsabilidade();

      expect(mockApiGet).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          responseType: 'arraybuffer',
        }),
      );
    });

    test('deve retornar arquivo com tamanho correto', async () => {
      const fileSize = 2048;
      const mockArrayBuffer = new ArrayBuffer(fileSize);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-length': fileSize.toString(),
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await baixarModeloTermoResponsabilidade();

      expect(result.data.byteLength).toBe(fileSize);
      expect(result.headers['content-length']).toBe(fileSize.toString());
    });
  });

  describe('fazerUploadAnexoCodaf', () => {
    test('deve fazer upload de anexo com sucesso', async () => {
      const formData = new FormData();
      formData.append('file', new Blob(['conteúdo']), 'anexo.pdf');

      const configuracaoHeader = {
        headers: { 'content-type': 'multipart/form-data' },
      };

      const mockResponse: AnexoTemporarioDTO = {
        arquivoCodigo: '077667eb-830f-4276-b585-f3ab718d5bb1',
        nomeArquivo: 'anexo.pdf',
        extensao: '.pdf',
        urlDownload: 'https://example.com/anexo.pdf',
        contentType: 'application/pdf',
        tamanhoBytes: 1024,
      };

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: true,
        dados: mockResponse,
        mensagens: [],
        status: 201,
      } as any);

      const result = await fazerUploadAnexoCodaf(formData, configuracaoHeader);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/anexos/temporarios`,
        formData,
        configuracaoHeader,
      );
      expect(result.sucesso).toBe(true);
      expect(result.dados?.arquivoCodigo).toBe('077667eb-830f-4276-b585-f3ab718d5bb1');
    });

    test('deve retornar erro ao fazer upload de arquivo inválido', async () => {
      const formData = new FormData();
      const configuracaoHeader = {};

      mockInserirRegistro.mockResolvedValueOnce({
        sucesso: false,
        dados: null,
        mensagens: ['Arquivo inválido'],
        status: 400,
      } as any);

      const result = await fazerUploadAnexoCodaf(formData, configuracaoHeader);

      expect(result.sucesso).toBe(false);
      expect(result.mensagens).toContain('Arquivo inválido');
    });

    test('deve fazer upload de múltiplos anexos', async () => {
      const formData1 = new FormData();
      formData1.append('file', new Blob(['conteúdo1']), 'anexo1.pdf');

      const formData2 = new FormData();
      formData2.append('file', new Blob(['conteúdo2']), 'anexo2.pdf');

      const configuracaoHeader = {};

      mockInserirRegistro
        .mockResolvedValueOnce({
          sucesso: true,
          dados: {
            arquivoCodigo: 'codigo1',
            nomeArquivo: 'anexo1.pdf',
            extensao: '.pdf',
            urlDownload: 'url1',
            contentType: 'application/pdf',
            tamanhoBytes: 100,
          },
          mensagens: [],
          status: 201,
        } as any)
        .mockResolvedValueOnce({
          sucesso: true,
          dados: {
            arquivoCodigo: 'codigo2',
            nomeArquivo: 'anexo2.pdf',
            extensao: '.pdf',
            urlDownload: 'url2',
            contentType: 'application/pdf',
            tamanhoBytes: 200,
          },
          mensagens: [],
          status: 201,
        } as any);

      const result1 = await fazerUploadAnexoCodaf(formData1, configuracaoHeader);
      const result2 = await fazerUploadAnexoCodaf(formData2, configuracaoHeader);

      expect(result1.dados?.arquivoCodigo).toBe('codigo1');
      expect(result2.dados?.arquivoCodigo).toBe('codigo2');
      expect(mockInserirRegistro).toHaveBeenCalledTimes(2);
    });
  });

  describe('obterAnexoCodafParaDownload', () => {
    test('deve baixar anexo com sucesso', async () => {
      const arquivoCodigo = '077667eb-830f-4276-b585-f3ab718d5bb1';
      const mockArrayBuffer = new ArrayBuffer(1024);
      const mockResponse = {
        data: mockArrayBuffer,
        status: 200,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="anexo.pdf"',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await obterAnexoCodafParaDownload(arquivoCodigo);

      expect(mockApiGet).toHaveBeenCalledWith(
        `${URL_API_CODAF_LISTA_PRESENCA}/anexos/${arquivoCodigo}`,
        {
          responseType: 'arraybuffer',
        },
      );
      expect(result.data).toEqual(mockArrayBuffer);
      expect(result.status).toBe(200);
    });

    test('deve retornar erro 404 quando anexo não encontrado', async () => {
      const arquivoCodigo = 'codigo-inexistente';
      const mockError = {
        response: {
          status: 404,
          data: 'Anexo não encontrado',
        },
      };

      mockApiGet.mockRejectedValueOnce(mockError);

      await expect(obterAnexoCodafParaDownload(arquivoCodigo)).rejects.toEqual(mockError);
    });

    test('deve retornar anexo com headers corretos', async () => {
      const arquivoCodigo = 'test-codigo';
      const mockResponse = {
        data: new ArrayBuffer(2048),
        status: 200,
        headers: {
          'content-type': 'application/pdf',
          'content-disposition': 'attachment; filename="documento.pdf"',
          'content-length': '2048',
        },
      };

      mockApiGet.mockResolvedValueOnce(mockResponse as any);

      const result = await obterAnexoCodafParaDownload(arquivoCodigo);

      expect(result.headers['content-type']).toBe('application/pdf');
      expect(result.headers['content-disposition']).toContain('attachment');
      expect(result.headers['content-length']).toBe('2048');
    });
  });
});
