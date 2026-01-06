import * as inscricaoService from './inscricao-service';
import { InscricaoDTO } from '../dto/inscricao-dto';
import { InscricaoManualDTO } from '../dto/inscricao-manual-dto';
import { DadosVinculoInscricaoDTO } from '../dto/dados-usuario-inscricao-dto';
import { InscricaoMotivoCancelamentoDTO } from '../dto/inscricao-motivo-cancelamento-dto';

jest.mock('./api', () => ({
  inserirRegistro: jest.fn(),
  obterRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
}));

import { inserirRegistro, obterRegistro, alterarRegistro } from './api';

const mockInserirRegistro = inserirRegistro as jest.MockedFunction<typeof inserirRegistro>;
const mockObterRegistro = obterRegistro as jest.MockedFunction<typeof obterRegistro>;
const mockAlterarRegistro = alterarRegistro as jest.MockedFunction<typeof alterarRegistro>;

describe('InscricaoService', () => {
  const URL_INSCRICAO = 'v1/Inscricao';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('inserirInscricao', () => {
    test('deve inserir nova inscrição', async () => {
      const params: InscricaoDTO = {
        propostaId: 1,
        turmaId: 10,
        cpf: '12345678900',
      } as InscricaoDTO;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1, mensagem: 'Inscrição realizada com sucesso' },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.inserirInscricao(params);

      expect(mockInserirRegistro).toHaveBeenCalledWith(URL_INSCRICAO, params);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('inserirInscricaoManual', () => {
    test('deve inserir inscrição manual com notificação', async () => {
      const params: InscricaoManualDTO = {
        propostaId: 1,
        turmaId: 10,
        cpf: '12345678900',
      } as InscricaoManualDTO;
      const mostrarNotificacao = true;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.inserirInscricaoManual(params, mostrarNotificacao);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/manual`,
        params,
        undefined,
        mostrarNotificacao,
      );
      expect(result).toEqual(mockResponse);
    });

    test('deve inserir inscrição manual sem notificação', async () => {
      const params: InscricaoManualDTO = {
        propostaId: 1,
        turmaId: 10,
        cpf: '12345678900',
      } as InscricaoManualDTO;

      const mockResponse = {
        sucesso: true,
        dados: { id: 1 },
        mensagens: [],
        status: 201,
      };

      mockInserirRegistro.mockResolvedValueOnce(mockResponse as any);

      await inscricaoService.inserirInscricaoManual(params);

      expect(mockInserirRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/manual`,
        params,
        undefined,
        undefined,
      );
    });
  });

  describe('obterDadosInscricao', () => {
    test('deve obter dados de inscrição', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          cargoFuncoes: [],
          componentesCurriculares: [],
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterDadosInscricao();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/dados-inscricao`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterDadosInscricaoProposta', () => {
    test('deve obter dados de inscrição da proposta', async () => {
      const propostaId = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          propostaId: 1,
          nomeFormacao: 'Formação Teste',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterDadosInscricaoProposta(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/dados-inscricao-proposta/${propostaId}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterRfCpf', () => {
    test('deve buscar cursista por CPF quando tem mais de 7 caracteres', async () => {
      const cpf = '12345678900';
      const mockResponse = {
        sucesso: true,
        dados: {
          cpf: '12345678900',
          nome: 'Cursista Teste',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterRfCpf(cpf);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/cursista`, {
        params: { cpf },
      });
      expect(result).toEqual(mockResponse);
    });

    test('deve buscar cursista por RF quando tem 7 caracteres ou menos', async () => {
      const rf = '1234567';
      const mockResponse = {
        sucesso: true,
        dados: {
          registroFuncional: '1234567',
          nome: 'Cursista Teste',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterRfCpf(rf);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/cursista`, {
        params: { registroFuncional: rf },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterInscricao', () => {
    test('deve obter lista de inscrições', async () => {
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [],
          totalRegistros: 0,
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterInscricao();

      expect(mockObterRegistro).toHaveBeenCalledWith(URL_INSCRICAO);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterInscricaoId', () => {
    test('deve obter inscrição por id', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          items: [
            {
              id: 1,
              propostaId: 10,
            },
          ],
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterInscricaoId(id);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/${id}`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('cancelarInscricao', () => {
    test('deve cancelar inscrição individual', async () => {
      const id = 1;
      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.cancelarInscricao(id);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/${id}/cancelar`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterTurmasInscricao', () => {
    test('deve obter turmas disponíveis para inscrição', async () => {
      const propostaId = 1;
      const codigoDre = 'DRE-123';
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Turma A' },
          { id: 2, descricao: 'Turma B' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterTurmasInscricao(propostaId, codigoDre);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/turmas/${propostaId}`, {
        params: { codigoDre },
      });
      expect(result).toEqual(mockResponse);
    });

    test('deve obter turmas sem filtro de DRE', async () => {
      const propostaId = 1;
      const mockResponse = {
        sucesso: true,
        dados: [],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      await inscricaoService.obterTurmasInscricao(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/turmas/${propostaId}`, {
        params: { codigoDre: undefined },
      });
    });
  });

  describe('obterTiposInscricao', () => {
    test('deve obter tipos de inscrição', async () => {
      const mockResponse = {
        sucesso: true,
        dados: [
          { id: 1, descricao: 'Optativa' },
          { id: 2, descricao: 'Automática' },
        ],
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterTiposInscricao();

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/tipos`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('alterarVinculo', () => {
    test('deve alterar vínculo da inscrição', async () => {
      const params: DadosVinculoInscricaoDTO = {
        id: 1,
        cargoFuncaoId: 10,
      } as DadosVinculoInscricaoDTO;

      const mockResponse = {
        sucesso: true,
        dados: true,
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.alterarVinculo(params);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/${params.id}/alterar-vinculo`,
        params,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('obterSeInscricaoEstaAberta', () => {
    test('deve verificar se inscrição está aberta', async () => {
      const propostaId = 1;
      const mockResponse = {
        sucesso: true,
        dados: {
          podeInscrever: true,
          mensagem: 'Inscrições abertas',
        },
        mensagens: [],
        status: 200,
      };

      mockObterRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.obterSeInscricaoEstaAberta(propostaId);

      expect(mockObterRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/${propostaId}/abertas`);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('colocarEmEsperaInscricao', () => {
    test('deve colocar inscrições em espera', async () => {
      const ids = [1, 2, 3];
      const mockResponse = {
        sucesso: true,
        dados: { mensagem: 'Inscrições em espera' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.colocarEmEsperaInscricao(ids);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/em-espera`,
        null,
        { params: { ids } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('confirmarInscricao', () => {
    test('deve confirmar inscrições', async () => {
      const ids = [1, 2];
      const mockResponse = {
        sucesso: true,
        dados: { mensagem: 'Inscrições confirmadas' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.confirmarInscricao(ids);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/confirmar`,
        null,
        { params: { ids } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reativarInscricao', () => {
    test('deve reativar inscrições', async () => {
      const ids = [5, 6];
      const mockResponse = {
        sucesso: true,
        dados: { mensagem: 'Inscrições reativadas' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.reativarInscricao(ids);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/reativar`,
        null,
        { params: { ids } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('cancelarInscricoes', () => {
    test('deve cancelar múltiplas inscrições com motivo', async () => {
      const ids = [1, 2, 3];
      const motivo: InscricaoMotivoCancelamentoDTO = {
        motivoCancelamento: 'Desistência do cursista',
      };
      const mockResponse = {
        sucesso: true,
        dados: { mensagem: 'Inscrições canceladas' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.cancelarInscricoes(ids, motivo);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(
        `${URL_INSCRICAO}/cancelar`,
        motivo,
        { params: { ids } },
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sortearInscricao', () => {
    test('deve sortear inscrições de uma proposta', async () => {
      const propostaId = 1;
      const mockResponse = {
        sucesso: true,
        dados: { mensagem: 'Sorteio realizado com sucesso' },
        mensagens: [],
        status: 200,
      };

      mockAlterarRegistro.mockResolvedValueOnce(mockResponse as any);

      const result = await inscricaoService.sortearInscricao(propostaId);

      expect(mockAlterarRegistro).toHaveBeenCalledWith(`${URL_INSCRICAO}/sortear/${propostaId}`);
      expect(result).toEqual(mockResponse);
    });
  });
});
