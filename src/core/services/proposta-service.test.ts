import * as propostaService from './proposta-service';
import { PropostaDTO } from '../dto/proposta-dto';
import { DevolverPropostaDTO } from '../dto/devolver-proposta-dto';
import { PropostaRegenteDTO } from '../dto/proposta-regente-dto';
import { PropostaTutorDTO } from '../dto/proposta-tutor-dto';
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
});
