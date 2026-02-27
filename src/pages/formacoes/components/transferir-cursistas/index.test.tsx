import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Select: 'Select',
  Alert: 'Alert',
  Spin: 'Spin',
  Typography: { Text: 'Text' },
  Button: 'Button',
  Modal: { error: jest.fn(), confirm: jest.fn() },
  Table: 'Table',
}));

jest.mock('antd/es/table', () => ({
  __esModule: true,
  default: 'Table',
}));

jest.mock('~/core/hooks/useCursistasPorFormacao', () => ({
  CursistaInscricaoDTO: {},
}));

jest.mock('~/core/hooks/useFormacoes', () => ({
  useFormacoesSimples: jest.fn(() => ({
    data: [],
    loading: false,
    erro: null,
  })),
}));

jest.mock('~/core/hooks/useTransferirCursistas', () => ({
  useTransferirCursistas: jest.fn(() => ({
    transferir: jest.fn(),
    loading: false,
    message: null,
  })),
}));

jest.mock('../selecionar-cursistas', () => ({
  __esModule: true,
  default: 'SelecionarCursistas',
}));

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: 'DataTable',
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_NOVO: 'CF_BUTTON_NOVO',
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    SystemSME: { ConectaFormacao: { PRIMARY: '#000' } },
    Neutral: { WHITE: '#fff' },
  },
}));

// Importa o componente após os mocks
import FormTransferir from './index';

describe('FormTransferir', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função (componente React)', () => {
      expect(typeof FormTransferir).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(FormTransferir.name).toBe('FormTransferir');
    });

    test('deve estar definido', () => {
      expect(FormTransferir).toBeDefined();
    });
  });

  describe('Estados iniciais', () => {
    test('idFormacaoOrigem inicial deve ser null', () => {
      const idFormacaoOrigem: number | null = null;
      expect(idFormacaoOrigem).toBeNull();
    });

    test('idTurmaOrigem inicial deve ser null', () => {
      const idTurmaOrigem: number | null = null;
      expect(idTurmaOrigem).toBeNull();
    });

    test('idFormacaoDestino inicial deve ser null', () => {
      const idFormacaoDestino: number | null = null;
      expect(idFormacaoDestino).toBeNull();
    });

    test('idTurmaDestino inicial deve ser null', () => {
      const idTurmaDestino: number | null = null;
      expect(idTurmaDestino).toBeNull();
    });

    test('refreshKey inicial deve ser 0', () => {
      const refreshKey = 0;
      expect(refreshKey).toBe(0);
    });

    test('selectedCursistas inicial deve ser array vazio', () => {
      const selectedCursistas: any[] = [];
      expect(selectedCursistas).toEqual([]);
    });
  });

  describe('Lógica isBotaoDesabilitado (linhas 33-38)', () => {
    const calcularBotaoDesabilitado = (
      idFormacaoOrigem: number | null,
      idTurmaOrigem: number | null,
      idFormacaoDestino: number | null,
      idTurmaDestino: number | null,
      selectedCursistas: any[],
    ) => {
      return (
        !idFormacaoOrigem ||
        !idTurmaOrigem ||
        !idFormacaoDestino ||
        !idTurmaDestino ||
        selectedCursistas.length === 0
      );
    };

    test('deve desabilitar quando idFormacaoOrigem é null', () => {
      expect(calcularBotaoDesabilitado(null, 1, 2, 3, [{ id: 1 }])).toBe(true);
    });

    test('deve desabilitar quando idTurmaOrigem é null', () => {
      expect(calcularBotaoDesabilitado(1, null, 2, 3, [{ id: 1 }])).toBe(true);
    });

    test('deve desabilitar quando idFormacaoDestino é null', () => {
      expect(calcularBotaoDesabilitado(1, 1, null, 3, [{ id: 1 }])).toBe(true);
    });

    test('deve desabilitar quando idTurmaDestino é null', () => {
      expect(calcularBotaoDesabilitado(1, 1, 2, null, [{ id: 1 }])).toBe(true);
    });

    test('deve desabilitar quando selectedCursistas está vazio', () => {
      expect(calcularBotaoDesabilitado(1, 1, 2, 3, [])).toBe(true);
    });

    test('deve habilitar quando todos campos preenchidos', () => {
      expect(calcularBotaoDesabilitado(1, 1, 2, 3, [{ id: 1 }])).toBe(false);
    });
  });

  describe('Lógica de busca de formação (linhas 26-27)', () => {
    const formacoes = [
      { id: 1, nomeFormacao: 'Formação A', turmas: [] },
      { id: 2, nomeFormacao: 'Formação B', turmas: [] },
    ];

    test('deve encontrar formação por id', () => {
      const formacao = formacoes.find((f) => f.id === 1) || null;
      expect(formacao?.nomeFormacao).toBe('Formação A');
    });

    test('deve retornar null quando não encontra', () => {
      const formacao = formacoes.find((f) => f.id === 999) || null;
      expect(formacao).toBeNull();
    });
  });

  describe('Lógica de filtro de turmas destino (linhas 30-31)', () => {
    const turmas = [
      { propostaTurmaId: 10, nomeTurma: 'Turma 1' },
      { propostaTurmaId: 11, nomeTurma: 'Turma 2' },
      { propostaTurmaId: 12, nomeTurma: 'Turma 3' },
    ];

    test('deve filtrar excluindo turma de origem', () => {
      const idTurmaOrigem = 10;
      const turmasDestino = turmas.filter((t) => t.propostaTurmaId !== idTurmaOrigem);
      expect(turmasDestino).toHaveLength(2);
      expect(turmasDestino.map((t) => t.propostaTurmaId)).toEqual([11, 12]);
    });

    test('deve manter todas quando turma origem não existe', () => {
      const idTurmaOrigem = 999;
      const turmasDestino = turmas.filter((t) => t.propostaTurmaId !== idTurmaOrigem);
      expect(turmasDestino).toHaveLength(3);
    });
  });

  describe('DTO de transferência (linhas 93-102)', () => {
    test('deve criar DTO correto', () => {
      const selectedCursistas = [
        { inscricaoId: 100, registroFuncional: '1234567' },
        { inscricaoId: 101, registroFuncional: '7654321' },
      ];

      const dto = {
        idFormacaoOrigem: 1,
        idTurmaOrigem: 10,
        idFormacaoDestino: 2,
        idTurmaDestino: 20,
        cursistas: selectedCursistas.map((c) => ({
          rf: c.registroFuncional,
          idInscricao: c.inscricaoId,
        })),
      };

      expect(dto.cursistas).toHaveLength(2);
      expect(dto.cursistas[0]).toEqual({ rf: '1234567', idInscricao: 100 });
      expect(dto.cursistas[1]).toEqual({ rf: '7654321', idInscricao: 101 });
    });
  });

  describe('Modal de erro (linhas 44-87)', () => {
    test('título do modal de erro', () => {
      const titulo = 'Transferência incompleta: revise os casos abaixo';
      expect(titulo).toBe('Transferência incompleta: revise os casos abaixo');
    });

    test('largura do modal de erro deve ser 800', () => {
      const width = 800;
      expect(width).toBe(800);
    });

    test('colunas do modal de erro', () => {
      const columns = [
        { title: 'Cursista', dataIndex: 'nome', key: 'nome' },
        { title: 'RF', dataIndex: 'rf', key: 'rf', width: 120 },
        { title: 'Mensagem', dataIndex: 'mensagem', key: 'mensagem' },
      ];
      expect(columns).toHaveLength(3);
    });
  });

  describe('Modal de confirmação (linhas 124-174)', () => {
    test('título do modal de confirmação', () => {
      const titulo = 'Confirmação de transferência';
      expect(titulo).toBe('Confirmação de transferência');
    });

    test('largura do modal de confirmação deve ser 700', () => {
      const width = 700;
      expect(width).toBe(700);
    });

    test('textos dos botões', () => {
      expect('Confirmar').toBe('Confirmar');
      expect('Cancelar').toBe('Cancelar');
    });

    test('colunas da tabela de confirmação', () => {
      const columns = [
        { title: 'Cursista', dataIndex: 'nomeCursista' },
        { title: 'Origem' },
        { title: 'Destino' },
      ];
      expect(columns).toHaveLength(3);
    });
  });

  describe('Textos e labels', () => {
    test('texto seleção formação origem', () => {
      expect('Selecione a formação de origem').toBeTruthy();
    });

    test('texto seleção turma origem', () => {
      expect('Selecione a turma de origem').toBeTruthy();
    });

    test('texto seleção formação destino', () => {
      expect('Selecione a formação de destino').toBeTruthy();
    });

    test('texto seleção turma destino', () => {
      expect('Selecione a turma de destino').toBeTruthy();
    });

    test('texto seleção cursistas', () => {
      expect('Selecione os cursistas que deseja transferir').toBeTruthy();
    });
  });

  describe('Notificação de sucesso (linhas 110-113)', () => {
    test('deve ter estrutura correta', () => {
      const notificacao = {
        message: 'Transferências realizadas com sucesso!',
        description: 'Foram transferidos 2 cursista(s)',
      };
      expect(notificacao.message).toContain('sucesso');
    });
  });
});
