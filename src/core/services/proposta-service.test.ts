import * as propostaService from './proposta-service';
import { PropostaDTO } from '../dto/proposta-dto';
import { DevolverPropostaDTO } from '../dto/devolver-proposta-dto';
import { PropostaPareceristaConsideracaoCadastroDTO } from '../dto/parecer-proposta-dto';
import { PropostaRegenteDTO } from '../dto/proposta-regente-dto';
import { PropostaTutorDTO } from '../dto/proposta-tutor-dto';
import { PropostaEncontroDTO } from '../dto/proposta-encontro-dto';
import { PropostaFiltrosDTO } from '../dto/proposta-filtro-dto';
import { TipoFormacao } from '../enum/tipo-formacao';

jest.mock('./api', () => ({
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  alterarRegistroParcial: jest.fn(),
  deletarRegistro: jest.fn(),
}));

import {
  obterRegistro,
  inserirRegistro,
  alterarRegistro,
  alterarRegistroParcial,
  deletarRegistro,
} from './api';

const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;
const mockAlterarRegistroParcial = alterarRegistroParcial as jest.MockedFunction<
  typeof alterarRegistroParcial
>;
const mockDeletarRegistro = deletarRegistro as jest.MockedFunction<typeof deletarRegistro>;

describe('PropostaService', () => {
  const URL_API_PROPOSTA = 'v1/Proposta';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('autocompletarFormacao', () => {
    test('deve buscar formações para autocompletar', async () => {
      const termoBusca = 'matematica';
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [
            {
              propostaId: 1,
              numeroHomologacao: 100,
              nomeFormacao: 'Matemática Básica',
              codigoFormacao: 1001,
            },
          ],
          totalRegistros: 1,
          totalPaginas: 1,
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.autocompletarFormacao(termoBusca);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/autocompletar-formacao`,
        {
          params: {
            TermoBusca: termoBusca,
            NumeroPagina: 1,
            NumeroRegistros: 99999,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterCriterioValidacaoInscricao', () => {
    test('deve obter critérios de validação de inscrição', async () => {
      const exibirOpcaoOutros = true;
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Critério 1' },
          { id: 2, descricao: 'Critério 2' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result =
        await propostaService.obterCriterioValidacaoInscricao(exibirOpcaoOutros);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/criterio-validacao-inscricao`,
        { params: { exibirOpcaoOutros } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterFormacaoHomologada', () => {
    test('deve obter formações homologadas', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Formação A' },
          { id: 2, descricao: 'Formação B' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterFormacaoHomologada();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/formacao-homologada`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterFormato', () => {
    test('deve obter formatos por tipo de formação', async () => {
      const tipoFormacao = TipoFormacao.Curso;
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

      const result = await propostaService.obterFormato(tipoFormacao);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/formatos/tipo-formacao/${tipoFormacao}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterSituacoes', () => {
    test('deve obter situações de proposta', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Rascunho' },
          { id: 2, descricao: 'Publicada' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterSituacoes();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/situacao`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('inserirProposta', () => {
    test('deve inserir nova proposta', async () => {
      const params: PropostaDTO = {
        nomeFormacao: 'Nova Formação',
        tipoFormacao: TipoFormacao.Curso,
      } as PropostaDTO;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Proposta criada com sucesso' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.inserirProposta(params);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_API_PROPOSTA, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarProposta', () => {
    test('deve alterar proposta existente', async () => {
      const id = 1;
      const params: PropostaDTO = {
        nomeFormacao: 'Formação Atualizada',
      } as PropostaDTO;
      const mostrarNotificacao = true;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Proposta alterada' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.alterarProposta(id, params, mostrarNotificacao);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${id}`,
        params,
        undefined,
        mostrarNotificacao,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('devolverProposta', () => {
    test('deve devolver proposta para correção', async () => {
      const id = 1;
      const params: DevolverPropostaDTO = {
        motivo: 'Necessita ajustes',
      };

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Proposta devolvida' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.devolverProposta(id, params);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/devolver-proposta/${id}`,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('enviarPropostaAnalise', () => {
    test('deve enviar proposta para análise', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: 1,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistroParcial.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.enviarPropostaAnalise(id);

      expect(mockAlterarRegistroParcial).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${id}/enviar`,
        undefined,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterPropostaPorId', () => {
    test('deve obter proposta por id', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          id: 1,
          nomeFormacao: 'Formação Teste',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterPropostaPorId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deletarProposta', () => {
    test('deve deletar proposta', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.deletarProposta(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('salvarPropostaProfissionalRegente', () => {
    test('deve salvar regente da proposta', async () => {
      const propostaId = 1;
      const params: PropostaRegenteDTO = {
        registroFuncional: '12345',
        nome: 'Regente Teste',
      } as PropostaRegenteDTO;

      const mockResponse = {
        sucesso: true,
        dados: 1,
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarPropostaProfissionalRegente(params, propostaId);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/regente`,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('salvarPropostaProfissionalTutor', () => {
    test('deve salvar tutor da proposta', async () => {
      const propostaId = 1;
      const params: PropostaTutorDTO = {
        registroFuncional: '54321',
        nome: 'Tutor Teste',
      } as PropostaTutorDTO;

      const mockResponse = {
        sucesso: true,
        dados: 1,
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarPropostaProfissionalTutor(params, propostaId);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/tutor`,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('excluirRegente', () => {
    test('deve excluir regente', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.excluirRegente(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/regente/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('excluirTutor', () => {
    test('deve excluir tutor', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.excluirTutor(id);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/tutor/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('aprovarConsideracoesPareceristas', () => {
    test('deve aprovar considerações dos pareceristas', async () => {
      const propostaId = 1;
      const justificativa = 'Aprovado conforme análise';
      const mockResponse = {
        sucesso: true,
        dados: 1,
        mensagens: [],
        status: 200,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.aprovarConsideracoesPareceristas(
        propostaId,
        justificativa,
      );

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/parecerista/aprovar`,
        { justificativa },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('recusarConsideracoesPareceristas', () => {
    test('deve recusar considerações dos pareceristas', async () => {
      const propostaId = 1;
      const justificativa = 'Recusado por motivos técnicos';
      const mockResponse = {
        sucesso: true,
        dados: 1,
        mensagens: [],
        status: 200,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.recusarConsideracoesPareceristas(
        propostaId,
        justificativa,
      );

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/parecerista/recusar`,
        { justificativa },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('autocompletarFormacaoComCodaf', () => {
    test('deve buscar formações com CODAF para autocompletar', async () => {
      const termoBusca = 'formacao';
      const mockResponse = {
        sucesso: true,
        dados: { items: [], totalRegistros: 0, totalPaginas: 0 },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.autocompletarFormacaoComCodaf(termoBusca);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/autocompletar-formacao`,
        {
          params: {
            TermoBusca: termoBusca,
            ComCodaf: true,
            NumeroPagina: 1,
            NumeroRegistros: 99999,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterRoteiroPropostaFormativa', () => {
    test('deve obter roteiro da proposta formativa', async () => {
      const mockResponse = {
        sucesso: true,
        dados: { id: 1, descricao: 'Roteiro A' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterRoteiroPropostaFormativa();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/roteiro`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterDadosCadastrante', () => {
    test('deve obter dados do cadastrante com propostaId', async () => {
      const propostaId = 5;
      const mockResponse = {
        sucesso: true,
        dados: { nome: 'Cadastrante X', email: 'x@email.com' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterDadosCadastrante(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/informacoes-cadastrante`,
        { params: { propostaId } },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve obter dados do cadastrante sem propostaId', async () => {
      const mockResponse = {
        sucesso: true,
        dados: { nome: 'Cadastrante Y', email: 'y@email.com' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterDadosCadastrante();

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/informacoes-cadastrante`,
        { params: { propostaId: undefined } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterComunicadoAcaoInformatica', () => {
    test('deve obter comunicado de ação formativa por id', async () => {
      const id = 10;
      const mockResponse = {
        sucesso: true,
        dados: { id: 10, descricao: 'Comunicado' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterComunicadoAcaoInformatica(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/comunicado-acao-formativa/${id}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterTipoFormacao', () => {
    test('deve obter tipos de formação', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Curso' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterTipoFormacao();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/tipo-formacao`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterTipoInscricao', () => {
    test('deve obter tipos de inscrição', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Aberta' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterTipoInscricao();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/tipo-inscricao`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterTurmasDaProposta', () => {
    test('deve obter turmas de uma proposta', async () => {
      const id = 3;
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Turma A' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterTurmasDaProposta(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/${id}/turma`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterTipoEncontro', () => {
    test('deve obter tipos de encontro', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: 'Presencial' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterTipoEncontro();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/tipo-encontro`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterParecer', () => {
    test('deve obter parecer com filtro', async () => {
      const params = { propostaId: 1 } as PropostaPareceristaConsideracaoCadastroDTO;
      const mockResponse = {
        sucesso: true,
        dados: { id: 1, parecer: 'Aprovado' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterParecer(params as any);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/parecer`, {
        params,
      });
      expect(result).toEqual(mockResponse);
    });

    test('deve obter parecer sem filtro', async () => {
      const mockResponse = {
        sucesso: true,
        dados: null,
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterParecer();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/parecer`, {
        params: undefined,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('salvarParecer', () => {
    test('deve salvar parecer', async () => {
      const params: PropostaPareceristaConsideracaoCadastroDTO = {
        propostaId: 1,
        consideracao: 'Aprovado',
      } as PropostaPareceristaConsideracaoCadastroDTO;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Parecer salvo' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarParecer(params);

      expect(mockInserirRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/parecer`, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarParecer', () => {
    test('deve alterar parecer existente', async () => {
      const params: PropostaPareceristaConsideracaoCadastroDTO = {
        propostaId: 1,
        consideracao: 'Revisado',
      } as PropostaPareceristaConsideracaoCadastroDTO;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Parecer alterado' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.alterarParecer(params);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/parecer`, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('enviarParecer', () => {
    test('deve enviar parecer para o parecerista', async () => {
      const propostaId = 2;
      const mockResponse = {
        sucesso: true,
        dados: 2,
        mensagens: [],
        status: 200,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.enviarParecer(propostaId);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/parecerista/enviar`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterPropostaEncontrosPaginado', () => {
    test('deve obter encontros da proposta paginados', async () => {
      const propostaId = 4;
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterPropostaEncontrosPaginado(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/encontro`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('salvarPropostaEncontro', () => {
    test('deve salvar encontro da proposta', async () => {
      const propostaId = 4;
      const encontro = { data: '2025-01-01', local: 'Sede' } as PropostaEncontroDTO;
      const mockResponse = {
        sucesso: true,
        dados: 10,
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarPropostaEncontro(propostaId, encontro);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/encontro`,
        encontro,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removerPropostaEncontro', () => {
    test('deve remover encontro da proposta', async () => {
      const idEncontro = 7;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.removerPropostaEncontro(idEncontro);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/encontro/${idEncontro}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removerParecer', () => {
    test('deve remover parecer por id', async () => {
      const parecerId = 3;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.removerParecer(parecerId);

      expect(mockDeletarRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/parecer/${parecerId}`,
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve remover parecer sem id (undefined)', async () => {
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockDeletarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.removerParecer();

      expect(mockDeletarRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/parecer/undefined`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterNomeProfissional', () => {
    test('deve obter nome do profissional pelo registro funcional', async () => {
      const registroFunciona = '123456';
      const mockResponse = {
        sucesso: true,
        dados: 'João da Silva',
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterNomeProfissional(registroFunciona);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/nome-profissional/${registroFunciona}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterPropostaRegentePorId', () => {
    test('deve obter regente da proposta por id', async () => {
      const id = 8;
      const mockResponse = {
        sucesso: true,
        dados: { registroFuncional: '11111', nome: 'Regente A' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterPropostaRegentePorId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/regente/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterPropostaTutorPorId', () => {
    test('deve obter tutor da proposta por id', async () => {
      const id = 9;
      const mockResponse = {
        sucesso: true,
        dados: { registroFuncional: '22222', nome: 'Tutor B' },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterPropostaTutorPorId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/tutor/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterPropostasDashboard', () => {
    test('deve obter propostas do dashboard com filtros', async () => {
      const filters = { situacao: 1 } as PropostaFiltrosDTO;
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterPropostasDashboard(filters);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/dashboard`, {
        params: filters,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterRelatorioLaudaPublicacao', () => {
    test('deve obter relatório de lauda de publicação', async () => {
      const propostaId = 5;
      const mockResponse = {
        sucesso: true,
        dados: 'base64conteudo',
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterRelatorioLaudaPublicacao(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/relatorio/lauda-publicacao`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterRelatorioLaudaCompleta', () => {
    test('deve obter relatório de lauda completa', async () => {
      const propostaId = 5;
      const mockResponse = {
        sucesso: true,
        dados: 'base64conteudo',
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterRelatorioLaudaCompleta(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/relatorio/lauda-completa`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterSugestoes', () => {
    test('deve obter sugestões dos pareceristas da proposta', async () => {
      const propostaId = 6;
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterSugestoes(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/parecerista/sugestao`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('aprovarConsideracoesAdminDf', () => {
    test('deve aprovar considerações do Admin DF', async () => {
      const propostaId = 7;
      const justificativa = 'Aprovado pelo Admin DF';
      const mockResponse = {
        sucesso: true,
        dados: 7,
        mensagens: [],
        status: 200,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.aprovarConsideracoesAdminDf(propostaId, justificativa);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/aprovar`,
        { justificativa },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('recusarConsideracoesAdminDf', () => {
    test('deve recusar considerações do Admin DF', async () => {
      const propostaId = 8;
      const justificativa = 'Recusado pelo Admin DF';
      const mockResponse = {
        sucesso: true,
        dados: 8,
        mensagens: [],
        status: 200,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.recusarConsideracoesAdminDf(propostaId, justificativa);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/recusar`,
        { justificativa },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterCargaHorariaTotal', () => {
    test('deve obter lista de carga horária total', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [{ id: 1, descricao: '40h' }],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterCargaHorariaTotal();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_API_PROPOSTA}/horas-totais-proposta`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('pesquisarCursistasDaTurma', () => {
    test('deve pesquisar cursistas da turma com valores padrão', async () => {
      const termo = 'João';
      const propostaTurmaId = 10;
      const mockResponse = {
        sucesso: true,
        dados: { items: [], totalPaginas: 1, totalRegistros: 0 },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.pesquisarCursistasDaTurma(termo, propostaTurmaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/proposta-turmas/${propostaTurmaId}/inscritos/buscar`,
        {
          params: {
            termo,
            NumeroPagina: 1,
            NumeroRegistros: 20,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve pesquisar cursistas da turma com paginação customizada', async () => {
      const termo = 'Maria';
      const propostaTurmaId = 11;
      const numeroPagina = 2;
      const numeroRegistros = 50;
      const mockResponse = {
        sucesso: true,
        dados: { items: [], totalPaginas: 3, totalRegistros: 100 },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.pesquisarCursistasDaTurma(
        termo,
        propostaTurmaId,
        numeroPagina,
        numeroRegistros,
      );

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/proposta-turmas/${propostaTurmaId}/inscritos/buscar`,
        {
          params: {
            termo,
            NumeroPagina: numeroPagina,
            NumeroRegistros: numeroRegistros,
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterDetalhesPropostaComTurmasPorId', () => {
    test('deve obter detalhes da proposta com turmas com formacoesHomologas true', async () => {
      const propostaId = 12;
      const formacoesHomologas = true;
      const mockResponse = {
        sucesso: true,
        dados: { id: 12, nomeFormacao: 'Formação X', numeroFormacao: 100, turmas: [] },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterDetalhesPropostaComTurmasPorId(
        propostaId,
        formacoesHomologas,
      );

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/detalhes-com-turmas`,
        { params: { formacoesHomologas } },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve obter detalhes da proposta com turmas com formacoesHomologas false', async () => {
      const propostaId = 13;
      const formacoesHomologas = false;
      const mockResponse = {
        sucesso: true,
        dados: { id: 13, nomeFormacao: 'Formação Y', numeroFormacao: null, turmas: [] },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.obterDetalhesPropostaComTurmasPorId(
        propostaId,
        formacoesHomologas,
      );

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${propostaId}/detalhes-com-turmas`,
        { params: { formacoesHomologas } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('salvarNumeroHomologacao', () => {
    test('deve salvar número de homologação da proposta', async () => {
      const id = 15;
      const numeroHomologacao = 42;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistroParcial.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarNumeroHomologacao(id, numeroHomologacao);

      expect(mockAlterarRegistroParcial).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${id}/numero-homologacao`,
        { numeroHomologacao },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve salvar número de homologação nulo', async () => {
      const id = 16;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistroParcial.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarNumeroHomologacao(id, null);

      expect(mockAlterarRegistroParcial).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${id}/numero-homologacao`,
        { numeroHomologacao: null },
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve salvar número de homologação undefined (sem parâmetro)', async () => {
      const id = 17;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistroParcial.mockResolvedValueOnce(mockResponse as any);

      const result = await propostaService.salvarNumeroHomologacao(id);

      expect(mockAlterarRegistroParcial).toHaveBeenCalledWith(
        `${URL_API_PROPOSTA}/${id}/numero-homologacao`,
        { numeroHomologacao: undefined },
      );
      expect(result).toEqual(mockResponse);
    });
  });
});
