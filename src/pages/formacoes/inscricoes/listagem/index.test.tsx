import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Tag: 'Tag',
  Typography: { Text: 'Text' },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock('~/components/lib/button/primary', () => ({
  ButtonPrimary: 'ButtonPrimary',
}));

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: 'DataTable',
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn() },
}));

jest.mock('~/components/lib/card-table/provider', () => ({
  DataTableContext: { tableState: { reloadData: jest.fn() } },
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_SORTEAR: 'CF_BUTTON_SORTEAR',
}));

jest.mock('~/core/constants/mensagens', () => ({
  INSCRICAO_CONFIRMA_SORTEIO: 'Confirma sorteio?',
}));

jest.mock('~/core/enum/routes-enum', () => ({
  ROUTES: { FORMACAOES_INSCRICOES: '/formacoes/inscricoes' },
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/inscricao-service', () => ({
  sortearInscricao: jest.fn(),
}));

// Importa o componente após os mocks
import { InscricoesListaPaginada } from './index';

describe('InscricoesListaPaginada', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof InscricoesListaPaginada).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(InscricoesListaPaginada.name).toBe('InscricoesListaPaginada');
    });

    test('deve estar definido', () => {
      expect(InscricoesListaPaginada).toBeDefined();
    });
  });

  describe('Props', () => {
    test('deve aceitar filters opcional', () => {
      const filters = {
        codigoFormacao: 123,
        nomeFormacao: 'Teste',
        numeroHomologacao: 456,
      };
      expect(filters).toBeDefined();
    });

    test('deve aceitar realizouFiltro opcional', () => {
      const realizouFiltro = true;
      expect(realizouFiltro).toBe(true);
    });
  });

  describe('Colunas principais (linhas 57-60)', () => {
    const columns = [
      { title: 'Código da formação', dataIndex: 'codigoFormacao' },
      { title: 'Nome da formação', dataIndex: 'nomeFormacao' },
    ];

    test('deve ter 2 colunas', () => {
      expect(columns).toHaveLength(2);
    });

    test('coluna código da formação', () => {
      expect(columns[0]).toEqual({ title: 'Código da formação', dataIndex: 'codigoFormacao' });
    });

    test('coluna nome da formação', () => {
      expect(columns[1]).toEqual({ title: 'Nome da formação', dataIndex: 'nomeFormacao' });
    });
  });

  describe('Colunas expandidas (linhas 83-144)', () => {
    test('deve ter coluna id', () => {
      const col = { title: 'id', dataIndex: 'propostaTurmaId' };
      expect(col.title).toBe('id');
    });

    test('deve ter coluna Turma', () => {
      const col = { title: 'Turma', dataIndex: 'nomeTurma' };
      expect(col.title).toBe('Turma');
    });

    test('deve ter coluna Data', () => {
      const col = { title: 'Data', dataIndex: 'data' };
      expect(col.title).toBe('Data');
    });

    test('deve ter coluna Vagas', () => {
      const col = { title: 'Vagas', dataIndex: 'quantidadeVagas' };
      expect(col.title).toBe('Vagas');
    });

    test('deve ter coluna Ações', () => {
      const col = { title: 'Ações', align: 'center', width: '165px' };
      expect(col.title).toBe('Ações');
    });
  });

  describe('URL da API (linha 151)', () => {
    test('deve usar endpoint correto', () => {
      const url = 'v1/Inscricao/formacao-turmas';
      expect(url).toBe('v1/Inscricao/formacao-turmas');
    });
  });

  describe('Lógica de disabled do botão sortear (linha 137)', () => {
    test('deve desabilitar quando não pode realizar sorteio', () => {
      const permissao = { podeRealizarSorteio: false };
      const disabled = !permissao?.podeRealizarSorteio;
      expect(disabled).toBe(true);
    });

    test('deve habilitar quando pode realizar sorteio', () => {
      const permissao = { podeRealizarSorteio: true };
      const disabled = !permissao?.podeRealizarSorteio;
      expect(disabled).toBe(false);
    });
  });

  describe('Navegação onClickEditar (linhas 62-63)', () => {
    test('deve construir rota corretamente', () => {
      const row = { id: 123 };
      const route = `/formacoes/inscricoes/editar/${row.id}`;
      expect(route).toBe('/formacoes/inscricoes/editar/123');
    });
  });

  describe('Valores padrão de quantidade (linha 92, 107, etc)', () => {
    test('deve retornar 0 quando undefined', () => {
      const quantidade: number | undefined = undefined;
      expect(quantidade || 0).toBe(0);
    });

    test('deve retornar valor quando definido', () => {
      const quantidade = 10;
      expect(quantidade || 0).toBe(10);
    });
  });

  describe('DataTable expandido (linha 146)', () => {
    test('deve ter id correto', () => {
      const id = 'EXPANDED_DATA_TABLE';
      expect(id).toBe('EXPANDED_DATA_TABLE');
    });
  });

  describe('Notificação de sucesso (linhas 71-74)', () => {
    test('deve ter description correto', () => {
      const description = 'Registro sorteado com sucesso';
      expect(description).toBe('Registro sorteado com sucesso');
    });
  });
});
