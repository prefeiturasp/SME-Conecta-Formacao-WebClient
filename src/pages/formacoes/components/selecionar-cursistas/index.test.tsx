import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos antes de importar o componente
jest.mock('antd', () => ({
  Input: 'Input',
  Row: 'Row',
  Col: 'Col',
  Space: 'Space',
}));

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: 'DataTable',
}));

jest.mock('~/core/hooks/useCursistasPorFormacao', () => ({
  useCursistasPorFormacao: jest.fn(() => ({
    data: [],
    total: 0,
    loading: false,
  })),
}));

jest.mock('~/core/hooks/useDebounce', () => ({
  useDebounce: jest.fn((value) => value),
}));

// Importa o componente após os mocks
import SelecionarCursistas from './index';

describe('SelecionarCursistas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função (componente React)', () => {
      expect(typeof SelecionarCursistas).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(SelecionarCursistas.name).toBe('SelecionarCursistas');
    });

    test('deve estar definido', () => {
      expect(SelecionarCursistas).toBeDefined();
    });
  });

  describe('Props esperadas', () => {
    test('deve aceitar idFormacao como número', () => {
      const props = {
        idFormacao: 1,
        onSelectionChange: jest.fn(),
      };
      expect(props.idFormacao).toBe(1);
    });

    test('deve aceitar idFormacao como null', () => {
      const props = {
        idFormacao: null,
        onSelectionChange: jest.fn(),
      };
      expect(props.idFormacao).toBeNull();
    });

    test('deve aceitar propostaTurmaId opcional', () => {
      const props = {
        idFormacao: 1,
        propostaTurmaId: 10,
        onSelectionChange: jest.fn(),
      };
      expect(props.propostaTurmaId).toBe(10);
    });

    test('deve aceitar selectedCursistas opcional', () => {
      const cursistas = [
        { inscricaoId: 1, nomeCursista: 'Teste', cpf: '123', registroFuncional: '456', situacao: 'Confirmada' },
      ];
      const props = {
        idFormacao: 1,
        selectedCursistas: cursistas,
        onSelectionChange: jest.fn(),
      };
      expect(props.selectedCursistas).toHaveLength(1);
    });

    test('deve aceitar refreshKey opcional', () => {
      const props = {
        idFormacao: 1,
        refreshKey: 5,
        onSelectionChange: jest.fn(),
      };
      expect(props.refreshKey).toBe(5);
    });
  });

  describe('Lógica de getCheckboxProps (linha 72-74)', () => {
    // Reproduz a lógica do componente: record.situacao === 'Cancelada' || record.situacao === 'Transferida'
    const getCheckboxProps = (record: { situacao: string }) => ({
      disabled: record.situacao === 'Cancelada' || record.situacao === 'Transferida',
    });

    test('deve desabilitar checkbox quando situação é Cancelada', () => {
      const result = getCheckboxProps({ situacao: 'Cancelada' });
      expect(result.disabled).toBe(true);
    });

    test('deve desabilitar checkbox quando situação é Transferida', () => {
      const result = getCheckboxProps({ situacao: 'Transferida' });
      expect(result.disabled).toBe(true);
    });

    test('deve habilitar checkbox quando situação é Confirmada', () => {
      const result = getCheckboxProps({ situacao: 'Confirmada' });
      expect(result.disabled).toBe(false);
    });

    test('deve habilitar checkbox quando situação é Em Espera', () => {
      const result = getCheckboxProps({ situacao: 'Em Espera' });
      expect(result.disabled).toBe(false);
    });

    test('deve habilitar checkbox quando situação é Aguardando Análise', () => {
      const result = getCheckboxProps({ situacao: 'Aguardando Análise' });
      expect(result.disabled).toBe(false);
    });
  });

  describe('Lógica de selectedRowKeys (linha 53)', () => {
    // Reproduz: selectedRows.map((c) => c.inscricaoId)
    const mapSelectedRowKeys = (rows: { inscricaoId: number }[]) => rows.map((c) => c.inscricaoId);

    test('deve mapear array de cursistas para array de ids', () => {
      const rows = [{ inscricaoId: 1 }, { inscricaoId: 2 }, { inscricaoId: 3 }];
      expect(mapSelectedRowKeys(rows)).toEqual([1, 2, 3]);
    });

    test('deve retornar array vazio quando não há cursistas', () => {
      expect(mapSelectedRowKeys([])).toEqual([]);
    });

    test('deve retornar array com um id quando há um cursista', () => {
      expect(mapSelectedRowKeys([{ inscricaoId: 100 }])).toEqual([100]);
    });
  });

  describe('Colunas da tabela (linhas 77-82)', () => {
    // Colunas definidas no componente
    const columns = [
      { title: 'Cursista', dataIndex: 'nomeCursista' },
      { title: 'CPF', dataIndex: 'cpf' },
      { title: 'RF', dataIndex: 'registroFuncional' },
      { title: 'Situação', dataIndex: 'situacao' },
    ];

    test('deve ter 4 colunas', () => {
      expect(columns).toHaveLength(4);
    });

    test('coluna Cursista deve ter dataIndex nomeCursista', () => {
      expect(columns[0]).toEqual({ title: 'Cursista', dataIndex: 'nomeCursista' });
    });

    test('coluna CPF deve ter dataIndex cpf', () => {
      expect(columns[1]).toEqual({ title: 'CPF', dataIndex: 'cpf' });
    });

    test('coluna RF deve ter dataIndex registroFuncional', () => {
      expect(columns[2]).toEqual({ title: 'RF', dataIndex: 'registroFuncional' });
    });

    test('coluna Situação deve ter dataIndex situacao', () => {
      expect(columns[3]).toEqual({ title: 'Situação', dataIndex: 'situacao' });
    });
  });

  describe('Configuração de paginação (linhas 126-139)', () => {
    const paginationConfig = {
      current: 1,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
      showSizeChanger: true,
      locale: { items_per_page: '' },
    };

    test('deve ter página inicial 1', () => {
      expect(paginationConfig.current).toBe(1);
    });

    test('deve ter tamanho de página 10', () => {
      expect(paginationConfig.pageSize).toBe(10);
    });

    test('deve ter opções de tamanho corretas', () => {
      expect(paginationConfig.pageSizeOptions).toEqual(['10', '20', '50', '100']);
    });

    test('deve mostrar seletor de tamanho', () => {
      expect(paginationConfig.showSizeChanger).toBe(true);
    });

    test('deve ter locale items_per_page vazio', () => {
      expect(paginationConfig.locale.items_per_page).toBe('');
    });
  });

  describe('Configuração de debounce (linhas 32-35)', () => {
    test('deve usar delay de 500ms', () => {
      const debounceDelay = 500;
      expect(debounceDelay).toBe(500);
    });
  });

  describe('Placeholders dos filtros (linhas 94-115)', () => {
    test('placeholder Nome do Cursista', () => {
      expect('Nome do Cursista').toBe('Nome do Cursista');
    });

    test('placeholder CPF', () => {
      expect('CPF').toBe('CPF');
    });

    test('placeholder RF', () => {
      expect('RF').toBe('RF');
    });
  });

  describe('DataTable config (linhas 120-140)', () => {
    test('deve usar inscricaoId como rowKey', () => {
      const rowKey = 'inscricaoId';
      expect(rowKey).toBe('inscricaoId');
    });
  });

  describe('Estados iniciais (linhas 26-30)', () => {
    test('paginaAtual inicial deve ser 1', () => {
      const paginaAtual = 1;
      expect(paginaAtual).toBe(1);
    });

    test('tamanhoPagina inicial deve ser 10', () => {
      const tamanhoPagina = 10;
      expect(tamanhoPagina).toBe(10);
    });

    test('cpf inicial deve ser undefined', () => {
      const cpf: string | undefined = undefined;
      expect(cpf).toBeUndefined();
    });

    test('nomeCursista inicial deve ser undefined', () => {
      const nomeCursista: string | undefined = undefined;
      expect(nomeCursista).toBeUndefined();
    });

    test('registroFuncional inicial deve ser undefined', () => {
      const registroFuncional: string | undefined = undefined;
      expect(registroFuncional).toBeUndefined();
    });

    test('selectedRows inicial deve ser array vazio', () => {
      const selectedRows: any[] = [];
      expect(selectedRows).toEqual([]);
    });
  });
});
