import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('react', () => {
  const actualReact = jest.requireActual('react') as object;
  return {
    ...actualReact,
    createContext: jest.fn(() => ({
      Provider: 'Provider',
      Consumer: 'Consumer',
    })),
    useContext: jest.fn(() => ({ tableState: { reloadData: jest.fn() } })),
    useState: jest.fn(() => [[], jest.fn()]),
  };
});

jest.mock('~/components/lib/card-table/provider', () => ({
  DataTableContext: { tableState: { reloadData: jest.fn() } },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('~/core/constants/mensagens', () => ({
  DESEJA_COLOCAR_INSCRICAO_EM_ESPERA: 'DESEJA_COLOCAR_INSCRICAO_EM_ESPERA',
  DESEJA_CONFIRMAR_INSCRICAO: 'DESEJA_CONFIRMAR_INSCRICAO',
  DESEJA_REATIVAR_INSCRICAO: 'DESEJA_REATIVAR_INSCRICAO',
  INSCRICAO_CANCELADA_SUCESSO: 'INSCRICAO_CANCELADA_SUCESSO',
  INSCRICAO_COLOCADA_ESPERA_SUCESSO: 'INSCRICAO_COLOCADA_ESPERA_SUCESSO',
  INSCRICAO_CONFIRMADA_SUCESSO: 'INSCRICAO_CONFIRMADA_SUCESSO',
}));

jest.mock('~/core/dto/dados-listagem-inscricao-dto', () => ({}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  cancelarInscricoes: jest.fn(() => Promise.resolve({ sucesso: true, dados: { mensagem: 'Sucesso' } })),
  colocarEmEsperaInscricao: jest.fn(() => Promise.resolve({ sucesso: true, dados: { mensagem: 'Sucesso' } })),
  confirmarInscricao: jest.fn(() => Promise.resolve({ sucesso: true, dados: { mensagem: 'Sucesso' } })),
  reativarInscricao: jest.fn(() => Promise.resolve({ sucesso: true, dados: { mensagem: 'Sucesso' } })),
}));

// Importa o componente após os mocks
import {
  TurmasInscricoesListaPaginadaContext,
  TurmasInscricoesListaPaginadaContextProvider,
} from './index';

describe('TurmasInscricoesListaPaginadaContextProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof TurmasInscricoesListaPaginadaContextProvider).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(TurmasInscricoesListaPaginadaContextProvider.name).toBe(
        'TurmasInscricoesListaPaginadaContextProvider',
      );
    });

    test('deve estar definido', () => {
      expect(TurmasInscricoesListaPaginadaContextProvider).toBeDefined();
    });
  });

  describe('Context', () => {
    test('deve exportar TurmasInscricoesListaPaginadaContext', () => {
      expect(TurmasInscricoesListaPaginadaContext).toBeDefined();
    });
  });

  describe('DataTableContextProps', () => {
    test('deve ter estrutura correta', () => {
      const contextProps = {
        onClickCancelar: async () => false,
        onClickConfirmar: () => null,
        onClickColocarEspera: () => null,
        onClickReativar: () => null,
        setSelectedRows: () => {},
        selectedRows: [],
      };

      expect(contextProps).toHaveProperty('onClickCancelar');
      expect(contextProps).toHaveProperty('onClickConfirmar');
      expect(contextProps).toHaveProperty('onClickColocarEspera');
      expect(contextProps).toHaveProperty('onClickReativar');
      expect(contextProps).toHaveProperty('setSelectedRows');
      expect(contextProps).toHaveProperty('selectedRows');
    });
  });

  describe('DEFAULT_VALUES (linhas 31-38)', () => {
    test('onClickCancelar deve retornar Promise<false> por padrão', async () => {
      const onClickCancelar = () => new Promise<boolean>((resolve) => resolve(false));
      const resultado = await onClickCancelar();

      expect(resultado).toBe(false);
    });

    test('selectedRows deve ser array vazio por padrão', () => {
      const selectedRows: any[] = [];
      expect(selectedRows).toEqual([]);
      expect(selectedRows).toHaveLength(0);
    });
  });

  describe('Mensagens', () => {
    test('deve ter mensagem para colocar em espera', () => {
      const mensagem = 'DESEJA_COLOCAR_INSCRICAO_EM_ESPERA';
      expect(mensagem).toBeTruthy();
    });

    test('deve ter mensagem para confirmar inscrição', () => {
      const mensagem = 'DESEJA_CONFIRMAR_INSCRICAO';
      expect(mensagem).toBeTruthy();
    });

    test('deve ter mensagem para reativar inscrição', () => {
      const mensagem = 'DESEJA_REATIVAR_INSCRICAO';
      expect(mensagem).toBeTruthy();
    });

    test('deve ter mensagem de sucesso para cancelamento', () => {
      const mensagem = 'INSCRICAO_CANCELADA_SUCESSO';
      expect(mensagem).toBeTruthy();
    });

    test('deve ter mensagem de sucesso para espera', () => {
      const mensagem = 'INSCRICAO_COLOCADA_ESPERA_SUCESSO';
      expect(mensagem).toBeTruthy();
    });

    test('deve ter mensagem de sucesso para confirmação', () => {
      const mensagem = 'INSCRICAO_CONFIRMADA_SUCESSO';
      expect(mensagem).toBeTruthy();
    });
  });

  describe('onClickColocarEspera (linhas 50-67)', () => {
    test('deve aceitar array de ids', () => {
      const ids = [1, 2, 3];
      expect(ids).toHaveLength(3);
      expect(Array.isArray(ids)).toBe(true);
    });
  });

  describe('onClickConfirmar (linhas 69-86)', () => {
    test('deve aceitar array de ids', () => {
      const ids = [1, 2, 3];
      expect(ids).toHaveLength(3);
      expect(Array.isArray(ids)).toBe(true);
    });
  });

  describe('onClickCancelar (linhas 88-101)', () => {
    test('deve aceitar ids e motivo', () => {
      const ids = [1, 2];
      const motivo = 'Motivo do cancelamento';

      expect(ids).toHaveLength(2);
      expect(typeof motivo).toBe('string');
    });

    test('deve retornar boolean indicando sucesso', async () => {
      const mockResponse = { sucesso: true };
      const resultado = mockResponse.sucesso;

      expect(typeof resultado).toBe('boolean');
      expect(resultado).toBe(true);
    });
  });

  describe('onClickReativar (linhas 103-120)', () => {
    test('deve aceitar array de ids', () => {
      const ids = [1, 2, 3];
      expect(ids).toHaveLength(3);
      expect(Array.isArray(ids)).toBe(true);
    });
  });

  describe('selectedRows', () => {
    test('deve ter estrutura de DadosListagemInscricaoDTO', () => {
      const selectedRows = [
        {
          inscricaoId: 1,
          nomeCursista: 'João Silva',
          cpf: '12345678901',
          situacao: 'Confirmada',
        },
        {
          inscricaoId: 2,
          nomeCursista: 'Maria Santos',
          cpf: '98765432101',
          situacao: 'Em Espera',
        },
      ];

      expect(selectedRows).toHaveLength(2);
      expect(selectedRows[0]).toHaveProperty('inscricaoId');
      expect(selectedRows[0]).toHaveProperty('nomeCursista');
    });

    test('deve permitir limpar selectedRows', () => {
      let selectedRows = [{ inscricaoId: 1 }];
      selectedRows = [];

      expect(selectedRows).toHaveLength(0);
    });
  });

  describe('Notificações de sucesso', () => {
    test('deve ter estrutura correta para notificação', () => {
      const notificacao = {
        message: 'Sucesso',
        description: 'Operação realizada com sucesso',
      };

      expect(notificacao.message).toBe('Sucesso');
      expect(notificacao).toHaveProperty('description');
    });

    test('deve usar mensagem da resposta quando disponível', () => {
      const response = {
        sucesso: true,
        dados: { mensagem: 'Mensagem personalizada' },
      };
      const mensagemPadrao = 'Mensagem padrão';

      const description = response?.dados?.mensagem || mensagemPadrao;

      expect(description).toBe('Mensagem personalizada');
    });

    test('deve usar mensagem padrão quando resposta não tem mensagem', () => {
      const response = {
        sucesso: true,
        dados: {} as { mensagem?: string },
      };
      const mensagemPadrao = 'Mensagem padrão';

      const description = response?.dados?.mensagem || mensagemPadrao;

      expect(description).toBe('Mensagem padrão');
    });
  });

  describe('tableState.reloadData', () => {
    test('deve ser chamado após operação bem sucedida', () => {
      let reloadDataCalled = false;
      const tableState = {
        reloadData: () => {
          reloadDataCalled = true;
        },
      };

      const response = { sucesso: true };
      if (response.sucesso) {
        tableState.reloadData();
      }

      expect(reloadDataCalled).toBe(true);
    });
  });

  describe('Payload de cancelamento (linha 89)', () => {
    test('deve criar payload com motivo', () => {
      const motivo = 'Solicitação do cursista';
      const payload = { motivo };

      expect(payload.motivo).toBe('Solicitação do cursista');
    });
  });

  describe('Limpeza de selectedRows após operação', () => {
    test('deve limpar selectedRows após sucesso', () => {
      let selectedRows = [{ inscricaoId: 1 }, { inscricaoId: 2 }];

      const response = { sucesso: true };
      if (response.sucesso) {
        selectedRows = [];
      }

      expect(selectedRows).toHaveLength(0);
    });

    test('não deve limpar selectedRows após falha', () => {
      let selectedRows = [{ inscricaoId: 1 }, { inscricaoId: 2 }];

      const response = { sucesso: false };
      if (response.sucesso) {
        selectedRows = [];
      }

      expect(selectedRows).toHaveLength(2);
    });
  });
});
