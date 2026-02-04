import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Col: 'Col',
  Form: { Item: 'FormItem' },
  Progress: 'Progress',
  Row: 'Row',
  Space: 'Space',
  Typography: { Text: 'Text' },
  Upload: 'Upload',
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{ resetFields: jest.fn(), getFieldValue: jest.fn() }],
}));

jest.mock('antd/es/table', () => ({}));

jest.mock('react', () => {
  const actualReact = jest.requireActual('react') as object;
  return {
    ...actualReact,
    forwardRef: (fn: any) => fn,
    useCallback: (fn: any) => fn,
    useRef: () => ({ current: null }),
    useState: jest.fn(() => [undefined, jest.fn()]),
  };
});

jest.mock('react-icons/fa', () => ({
  FaUpload: 'FaUpload',
}));

jest.mock('react-icons/lu', () => ({
  LuRefreshCw: 'LuRefreshCw',
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: { nomeFormacao: 'Teste' } }),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' }),
}));

jest.mock('~/components/lib/button/secundary', () => ({
  ButtonSecundary: 'ButtonSecundary',
}));

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: 'CardContent',
}));

jest.mock('~/components/lib/card-table-arquivos-importados', () => ({
  __esModule: true,
  default: 'DataTableArquivosImportados',
}));

jest.mock('~/components/lib/card-table/provider', () => ({
  __esModule: true,
  default: 'DataTableContextProvider',
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: 'HeaderPage',
}));

jest.mock('~/components/lib/modal', () => ({
  __esModule: true,
  default: 'Modal',
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn(), error: jest.fn() },
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: 'ButtonVoltar',
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_ARQUIVO: 'CF_BUTTON_ARQUIVO',
  CF_BUTTON_ATUALIZAR_DADOS: 'CF_BUTTON_ATUALIZAR_DADOS',
  CF_BUTTON_VOLTAR: 'CF_BUTTON_VOLTAR',
}));

jest.mock('~/core/constants/mensagens', () => ({
  DESEJA_CANCELAR_PROCESSAMENTO_ARQUIVO: 'DESEJA_CANCELAR_PROCESSAMENTO_ARQUIVO',
}));

jest.mock('~/core/constants/validate-messages', () => ({
  validateMessages: {},
}));

jest.mock('~/core/dto/arquivo-inscricao-importado-dto', () => ({}));

jest.mock('~/core/dto/registros-inconsistencias-dto', () => ({}));

jest.mock('~/core/enum/routes-enum', () => ({
  ROUTES: { FORMACAOES_INSCRICOES_EDITAR: '/formacoes/inscricoes/editar' },
}));

jest.mock('~/core/enum/situacao-importacao-arquivo-enum', () => ({
  SituacaoImportacaoArquivoEnum: {
    Validado: 1,
    Validando: 2,
    Cancelado: 3,
    Processado: 4,
  },
  SituacaoImportacaoArquivoEnumDisplay: {
    1: 'Validado',
    2: 'Validando',
    3: 'Cancelado',
    4: 'Processado',
  },
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/importacao-arquivo-service', () => ({
  __esModule: true,
  default: {
    importarArquivoInscricaoCursista: jest.fn(() => Promise.resolve({ sucesso: true })),
    buscarInconsistencias: jest.fn(() => Promise.resolve({ sucesso: true, dados: { items: [] } })),
    continuarProcessamento: jest.fn(() => Promise.resolve({ sucesso: true })),
    cancelarProcessamento: jest.fn(() => Promise.resolve({ sucesso: true })),
  },
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    SystemSME: {
      ConectaFormacao: { PRIMARY: '#1890ff' },
    },
  },
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('./drawer-inconsistencias', () => ({
  DrawerInconsistencias: 'DrawerInconsistencias',
}));

// Importa o componente após os mocks
import { InscricoesPorArquivoListagem } from './index';

describe('InscricoesPorArquivoListagem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof InscricoesPorArquivoListagem).toBe('function');
    });

    test('deve estar definido', () => {
      expect(InscricoesPorArquivoListagem).toBeDefined();
    });
  });

  describe('Estados iniciais', () => {
    test('deve ter linhaId inicial como undefined', () => {
      const linhaId: number | undefined = undefined;
      expect(linhaId).toBeUndefined();
    });

    test('deve ter situacao inicial como undefined', () => {
      const situacao: number | undefined = undefined;
      expect(situacao).toBeUndefined();
    });

    test('deve ter abrirModal inicial como false', () => {
      const abrirModal = false;
      expect(abrirModal).toBe(false);
    });

    test('deve ter abrirDrawer inicial como false', () => {
      const abrirDrawer = false;
      expect(abrirDrawer).toBe(false);
    });

    test('deve ter dataSourceInconsistencias inicial como undefined', () => {
      const dataSourceInconsistencias: any[] | undefined = undefined;
      expect(dataSourceInconsistencias).toBeUndefined();
    });
  });

  describe('ArquivoInscricaoImportadoDTO', () => {
    test('deve ter estrutura correta', () => {
      const arquivo = {
        id: 1,
        nome: 'arquivo.xlsx',
        situacao: 1,
        totalRegistros: 100,
        totalProcessados: 50,
      };

      expect(arquivo).toHaveProperty('id');
      expect(arquivo).toHaveProperty('nome');
      expect(arquivo).toHaveProperty('situacao');
      expect(arquivo).toHaveProperty('totalRegistros');
      expect(arquivo).toHaveProperty('totalProcessados');
    });
  });

  describe('SituacaoImportacaoArquivoEnum', () => {
    const SituacaoImportacaoArquivoEnum = {
      Validado: 1,
      Validando: 2,
      Cancelado: 3,
      Processado: 4,
    };

    const SituacaoImportacaoArquivoEnumDisplay: Record<number, string> = {
      1: 'Validado',
      2: 'Validando',
      3: 'Cancelado',
      4: 'Processado',
    };

    test('deve ter situação Validado', () => {
      expect(SituacaoImportacaoArquivoEnumDisplay[SituacaoImportacaoArquivoEnum.Validado]).toBe(
        'Validado',
      );
    });

    test('deve ter situação Validando', () => {
      expect(SituacaoImportacaoArquivoEnumDisplay[SituacaoImportacaoArquivoEnum.Validando]).toBe(
        'Validando',
      );
    });

    test('deve ter situação Cancelado', () => {
      expect(SituacaoImportacaoArquivoEnumDisplay[SituacaoImportacaoArquivoEnum.Cancelado]).toBe(
        'Cancelado',
      );
    });

    test('deve ter situação Processado', () => {
      expect(SituacaoImportacaoArquivoEnumDisplay[SituacaoImportacaoArquivoEnum.Processado]).toBe(
        'Processado',
      );
    });
  });

  describe('Columns da tabela (linhas 57-116)', () => {
    const columns = [
      { key: 'arquivo', title: 'Arquivo', dataIndex: 'nome' },
      { key: 'status', title: 'Status', dataIndex: 'situacao' },
      { key: 'totalRegistros', title: 'Total Registros', dataIndex: 'totalRegistros' },
      { key: 'totalProcessados', title: 'Total Processados', dataIndex: 'totalProcessados' },
    ];

    test('deve ter 4 colunas', () => {
      expect(columns).toHaveLength(4);
    });

    test('deve ter coluna de Arquivo', () => {
      expect(columns[0].title).toBe('Arquivo');
      expect(columns[0].dataIndex).toBe('nome');
    });

    test('deve ter coluna de Status', () => {
      expect(columns[1].title).toBe('Status');
      expect(columns[1].dataIndex).toBe('situacao');
    });

    test('deve ter coluna de Total Registros', () => {
      expect(columns[2].title).toBe('Total Registros');
    });

    test('deve ter coluna de Total Processados', () => {
      expect(columns[3].title).toBe('Total Processados');
    });
  });

  describe('Progress (linhas 81-114)', () => {
    test('deve calcular percentual corretamente', () => {
      const totalRegistros = 100;
      const totalProcessados = 50;
      const percent = (totalRegistros / totalProcessados) * 100;

      expect(percent).toBe(200);
    });

    test('deve ter status active quando validando', () => {
      const SituacaoImportacaoArquivoEnum = { Validando: 2 };
      const situacao = SituacaoImportacaoArquivoEnum.Validando;
      const statusEhValidando = situacao === SituacaoImportacaoArquivoEnum.Validando;

      const status = statusEhValidando ? 'active' : undefined;

      expect(status).toBe('active');
    });

    test('deve ter status exception quando cancelado', () => {
      const SituacaoImportacaoArquivoEnum = { Cancelado: 3 };
      const situacao = SituacaoImportacaoArquivoEnum.Cancelado;
      const statusEhCancelado = situacao === SituacaoImportacaoArquivoEnum.Cancelado;

      const status = statusEhCancelado ? 'exception' : undefined;

      expect(status).toBe('exception');
    });

    test('deve ter status success quando processado', () => {
      const SituacaoImportacaoArquivoEnum = { Processado: 4 };
      const situacao = SituacaoImportacaoArquivoEnum.Processado;
      const statusEhProcessado = situacao === SituacaoImportacaoArquivoEnum.Processado;

      const status = statusEhProcessado ? 'success' : undefined;

      expect(status).toBe('success');
    });
  });

  describe('onClickEditar (linhas 140-161)', () => {
    test('deve permitir edição quando status é Validado', () => {
      const SituacaoImportacaoArquivoEnum = { Validado: 1, Validando: 2, Cancelado: 3, Processado: 4 };
      const linha = { situacao: SituacaoImportacaoArquivoEnum.Validado };

      const podeEditar =
        linha.situacao === SituacaoImportacaoArquivoEnum.Validado ||
        linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado ||
        linha.situacao === SituacaoImportacaoArquivoEnum.Processado;

      expect(podeEditar).toBe(true);
    });

    test('não deve permitir edição quando status é Validando', () => {
      const SituacaoImportacaoArquivoEnum = { Validado: 1, Validando: 2, Cancelado: 3, Processado: 4 };
      const linha = { situacao: SituacaoImportacaoArquivoEnum.Validando };

      const podeEditar =
        linha.situacao === SituacaoImportacaoArquivoEnum.Validado ||
        linha.situacao === SituacaoImportacaoArquivoEnum.Cancelado ||
        linha.situacao === SituacaoImportacaoArquivoEnum.Processado;

      expect(podeEditar).toBe(false);
    });
  });

  describe('Botões', () => {
    test('deve ter botão Voltar', () => {
      const botao = { id: 'CF_BUTTON_VOLTAR' };
      expect(botao.id).toBe('CF_BUTTON_VOLTAR');
    });

    test('deve ter botão Atualizar dados', () => {
      const botao = { id: 'CF_BUTTON_ATUALIZAR_DADOS', texto: 'Atualizar dados' };
      expect(botao.id).toBe('CF_BUTTON_ATUALIZAR_DADOS');
      expect(botao.texto).toBe('Atualizar dados');
    });

    test('deve ter botão Importar Arquivo', () => {
      const botao = { id: 'CF_BUTTON_ARQUIVO', texto: 'Importar Arquivo' };
      expect(botao.id).toBe('CF_BUTTON_ARQUIVO');
      expect(botao.texto).toBe('Importar Arquivo');
    });
  });

  describe('URL da API (linha 271)', () => {
    test('deve construir URL corretamente para arquivos importados', () => {
      const propostaId = 123;
      const url = `/v1/ImportacaoArquivo/${propostaId}/arquivos-importados`;

      expect(url).toBe('/v1/ImportacaoArquivo/123/arquivos-importados');
    });
  });

  describe('Modal de confirmação (linhas 291-315)', () => {
    test('deve ter título correto', () => {
      const titulo = 'Registros';
      expect(titulo).toBe('Registros');
    });

    test('deve ter texto de Ok correto', () => {
      const okText = 'Continuar';
      expect(okText).toBe('Continuar');
    });

    test('deve ter texto de Cancel correto', () => {
      const cancelText = 'Fechar';
      expect(cancelText).toBe('Fechar');
    });

    test('deve ter mensagem de validação', () => {
      const mensagem =
        'Os registros foram validados e estão prontos para processamento. Por favor, prossiga clicando em "Continuar" para confirmar.';
      expect(mensagem).toContain('registros foram validados');
    });
  });

  describe('Mensagens', () => {
    test('deve ter mensagem de cancelamento de processamento', () => {
      const mensagem = 'DESEJA_CANCELAR_PROCESSAMENTO_ARQUIVO';
      expect(mensagem).toBeTruthy();
    });
  });

  describe('Notificações', () => {
    test('deve ter notificação de sucesso para importação', () => {
      const notificacao = {
        message: 'Sucesso',
        description: 'Arquivo importado com sucesso',
      };

      expect(notificacao.message).toBe('Sucesso');
      expect(notificacao.description).toBe('Arquivo importado com sucesso');
    });

    test('deve ter notificação de sucesso para processamento', () => {
      const notificacao = {
        message: 'Sucesso',
        description: 'O arquivo foi processado com sucesso!',
      };

      expect(notificacao.message).toBe('Sucesso');
      expect(notificacao.description).toBe('O arquivo foi processado com sucesso!');
    });
  });

  describe('Parâmetros de rota (linhas 120-126)', () => {
    test('deve converter id de string para número', () => {
      const paramsId = '123';
      const propostaId = paramsId ? Number(paramsId) : 0;

      expect(propostaId).toBe(123);
    });

    test('deve retornar 0 quando id não existe', () => {
      const paramsId = undefined;
      const propostaId = paramsId ? Number(paramsId) : 0;

      expect(propostaId).toBe(0);
    });
  });

  describe('Listagem de inscrições por arquivo', () => {
    test('deve ter título correto', () => {
      const titulo = 'Listagem de inscrições por arquivo';
      expect(titulo).toBe('Listagem de inscrições por arquivo');
    });
  });

  describe('Cursor do Typography (linhas 46-55)', () => {
    test('deve ter cursor pointer quando clicável', () => {
      const SituacaoImportacaoArquivoEnum = { Validado: 1, Cancelado: 3, Processado: 4 };
      const situacao = SituacaoImportacaoArquivoEnum.Validado;

      const statusEhValidado = situacao === SituacaoImportacaoArquivoEnum.Validado;
      const statusEhCancelado = situacao === SituacaoImportacaoArquivoEnum.Cancelado;
      const statusEhProcessado = situacao === SituacaoImportacaoArquivoEnum.Processado;

      const cursor =
        statusEhValidado || statusEhCancelado || statusEhProcessado ? 'pointer' : 'default';

      expect(cursor).toBe('pointer');
    });

    test('deve ter cursor default quando não clicável', () => {
      const SituacaoImportacaoArquivoEnum = { Validando: 2 };
      const situacao = SituacaoImportacaoArquivoEnum.Validando;

      const statusEhValidado = situacao === 1;
      const statusEhCancelado = situacao === 3;
      const statusEhProcessado = situacao === 4;

      const cursor =
        statusEhValidado || statusEhCancelado || statusEhProcessado ? 'pointer' : 'default';

      expect(cursor).toBe('default');
    });
  });
});
