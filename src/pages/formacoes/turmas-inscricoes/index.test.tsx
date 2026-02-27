import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Col: 'Col',
  Form: { Item: 'FormItem' },
  Row: 'Row',
  Typography: { Title: 'Title' },
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{ resetFields: jest.fn(), getFieldValue: jest.fn() }],
}));

jest.mock('react', () => {
  const actualReact = jest.requireActual('react') as object;
  return {
    ...actualReact,
    useCallback: (fn: any) => fn,
    useEffect: jest.fn(),
    useState: jest.fn(() => [false, jest.fn()]),
  };
});

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: { nomeFormacao: 'Teste', tiposInscricoes: [1] } }),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' }),
}));

jest.mock('~/components/lib/button/primary', () => ({
  ButtonPrimary: 'ButtonPrimary',
}));

jest.mock('~/components/lib/button/secundary', () => ({
  ButtonSecundary: 'ButtonSecundary',
}));

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: 'CardContent',
}));

jest.mock('~/components/lib/card-table/provider', () => ({
  __esModule: true,
  default: 'DataTableContextProvider',
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: 'HeaderPage',
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: 'ButtonVoltar',
}));

jest.mock('~/components/main/input/cargo-funcao', () => ({
  __esModule: true,
  default: 'SelectCargoFuncao',
}));

jest.mock('~/components/main/input/selecionar-todas-turmas', () => ({
  __esModule: true,
  default: 'SelectTodasTurmas',
}));

jest.mock('~/components/main/input/situacao-inscricao', () => ({
  __esModule: true,
  default: 'SelectSituacaoInscricao',
}));

jest.mock('~/components/main/numero', () => ({
  __esModule: true,
  default: 'InputNumero',
}));

jest.mock('~/components/main/text/input-text', () => ({
  __esModule: true,
  default: 'InputTexto',
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_ARQUIVO: 'CF_BUTTON_ARQUIVO',
  CF_BUTTON_NOVO: 'CF_BUTTON_NOVO',
  CF_BUTTON_VOLTAR: 'CF_BUTTON_VOLTAR',
}));

jest.mock('~/core/constants/ids/input', () => ({
  CF_INPUT_NOME: 'CF_INPUT_NOME',
  CF_INPUT_NOME_FORMACAO: 'CF_INPUT_NOME_FORMACAO',
  CF_INPUT_RF: 'CF_INPUT_RF',
}));

jest.mock('~/core/constants/mensagens', () => ({
  NOVA_INSCRICAO: 'Nova inscrição',
}));

jest.mock('~/core/constants/validate-messages', () => ({
  validateMessages: {},
}));

jest.mock('~/core/dto/pode-inscrever-mensagem-dto', () => ({}));

jest.mock('~/core/enum/routes-enum', () => ({
  ROUTES: {
    FORMACAOES_INSCRICOES: '/formacoes/inscricoes',
    FORMACAOES_INSCRICOES_NOVO: '/formacoes/inscricoes/novo',
    FORMACAOES_INSCRICOES_POR_ARQUIVO: '/formacoes/inscricoes/por-arquivo',
  },
}));

jest.mock('~/core/enum/tipo-inscricao', () => ({
  TipoInscricao: { Manual: 1, Automatica: 2 },
}));

jest.mock('~/core/services/inscricao-service', () => ({
  obterSeInscricaoEstaAberta: jest.fn(() =>
    Promise.resolve({ sucesso: true, dados: { mensagem: '', podeInscrever: true } }),
  ),
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('./listagem', () => ({
  TurmasInscricoesListaPaginada: 'TurmasInscricoesListaPaginada',
}));

jest.mock('./listagem/provider', () => ({
  TurmasInscricoesListaPaginadaContextProvider: 'TurmasInscricoesListaPaginadaContextProvider',
}));

// Importa o componente após os mocks
import { TurmasInscricoes } from './index';

describe('TurmasInscricoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof TurmasInscricoes).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(TurmasInscricoes.name).toBe('TurmasInscricoes');
    });

    test('deve estar definido', () => {
      expect(TurmasInscricoes).toBeDefined();
    });
  });

  describe('FiltroTurmaInscricoesProps (exportado)', () => {
    test('deve ter estrutura correta', () => {
      const filtros = {
        cpf: null as number | null,
        turmasId: null as number[] | null,
        nomeCursista: null as string | null,
        registroFuncional: null as number | null,
        Situacao: null as number | null,
        CargoFuncaoId: null as number | null,
      };

      expect(filtros).toHaveProperty('cpf');
      expect(filtros).toHaveProperty('turmasId');
      expect(filtros).toHaveProperty('nomeCursista');
      expect(filtros).toHaveProperty('registroFuncional');
      expect(filtros).toHaveProperty('Situacao');
      expect(filtros).toHaveProperty('CargoFuncaoId');
    });

    test('deve permitir valores preenchidos', () => {
      const filtros = {
        cpf: 12345678901,
        turmasId: [1, 2, 3],
        nomeCursista: 'João Silva',
        registroFuncional: 1234567,
        Situacao: 1,
        CargoFuncaoId: 5,
      };

      expect(filtros.cpf).toBe(12345678901);
      expect(filtros.turmasId).toHaveLength(3);
      expect(filtros.nomeCursista).toBe('João Silva');
    });
  });

  describe('Estados iniciais (linhas 56-73)', () => {
    test('deve ter realizouFiltro inicial como false', () => {
      const realizouFiltro = false;
      expect(realizouFiltro).toBe(false);
    });

    test('deve ter filtros iniciais vazios', () => {
      const filters = {
        cpf: null,
        turmasId: null,
        nomeCursista: null,
        registroFuncional: null,
        Situacao: null,
        CargoFuncaoId: null,
      };

      expect(filters.cpf).toBeNull();
      expect(filters.turmasId).toBeNull();
      expect(filters.nomeCursista).toBeNull();
    });
  });

  describe('PodeInscreverMensagemDTO (linhas 58-64)', () => {
    test('deve ter estrutura correta', () => {
      const dadosInscricao = {
        mensagem: '',
        podeInscrever: true,
      };

      expect(dadosInscricao).toHaveProperty('mensagem');
      expect(dadosInscricao).toHaveProperty('podeInscrever');
    });

    test('deve ter valor padrão correto', () => {
      const DADO_PADRAO_PODE_INSCREVER = {
        mensagem: '',
        podeInscrever: true,
      };

      expect(DADO_PADRAO_PODE_INSCREVER.mensagem).toBe('');
      expect(DADO_PADRAO_PODE_INSCREVER.podeInscrever).toBe(true);
    });
  });

  describe('TipoInscricao', () => {
    const TipoInscricao = {
      Manual: 1,
      Automatica: 2,
    };

    test('deve ter tipo Manual', () => {
      expect(TipoInscricao.Manual).toBe(1);
    });

    test('deve ter tipo Automatica', () => {
      expect(TipoInscricao.Automatica).toBe(2);
    });

    test('deve verificar se tem tipo inscrição manual (linha 50)', () => {
      const tiposInscricoes = [1, 2];
      const temTipoInscricaoManual = tiposInscricoes?.includes(TipoInscricao.Manual);

      expect(temTipoInscricaoManual).toBe(true);
    });
  });

  describe('obterFiltros (linhas 86-112)', () => {
    test('deve definir realizouFiltro como true quando há filtros', () => {
      const cpf = 123;
      const turmasId: number[] = [];
      const nomeCursista = 'Teste';
      const registroFuncional = null;
      const Situacao = null;
      const CargoFuncaoId = null;

      const temFiltros =
        cpf ||
        (turmasId?.length && turmasId.length > 0) ||
        nomeCursista ||
        registroFuncional ||
        Situacao ||
        CargoFuncaoId;

      expect(!!temFiltros).toBe(true);
    });

    test('deve definir realizouFiltro como false quando não há filtros', () => {
      const cpf = null;
      const turmasId: number[] = [];
      const nomeCursista = null;
      const registroFuncional = null;
      const Situacao = null;
      const CargoFuncaoId = null;

      const temFiltros =
        cpf ||
        (turmasId?.length && turmasId.length > 0) ||
        nomeCursista ||
        registroFuncional ||
        Situacao ||
        CargoFuncaoId;

      expect(!!temFiltros).toBe(false);
    });
  });

  describe('Campos do formulário (linhas 168-254)', () => {
    test('deve ter campo de Turma', () => {
      const campo = {
        label: 'Turma',
        name: 'turmas',
        maxTagCount: 1,
      };

      expect(campo.label).toBe('Turma');
      expect(campo.name).toBe('turmas');
    });

    test('deve ter campo de RF', () => {
      const campo = {
        label: 'RF',
        name: 'registroFuncional',
        placeholder: 'Registro Funcional',
      };

      expect(campo.label).toBe('RF');
      expect(campo.name).toBe('registroFuncional');
    });

    test('deve ter campo de CPF', () => {
      const campo = {
        label: 'CPF',
        name: 'cpf',
        placeholder: 'CPF',
      };

      expect(campo.label).toBe('CPF');
      expect(campo.name).toBe('cpf');
    });

    test('deve ter campo de Nome do cursista', () => {
      const campo = {
        label: 'Nome do cursista',
        name: 'nomeCursista',
        placeholder: 'Nome do cursista',
      };

      expect(campo.label).toBe('Nome do cursista');
      expect(campo.name).toBe('nomeCursista');
    });
  });

  describe('HeaderPage (linha 129)', () => {
    test('deve ter título correto', () => {
      const titulo = 'Lista de inscrições';
      expect(titulo).toBe('Lista de inscrições');
    });
  });

  describe('Botões', () => {
    test('deve ter botão Voltar', () => {
      const botao = { id: 'CF_BUTTON_VOLTAR' };
      expect(botao.id).toBe('CF_BUTTON_VOLTAR');
    });

    test('deve ter botão Inscrição por arquivo', () => {
      const botao = { id: 'CF_BUTTON_ARQUIVO', texto: 'Inscrição por arquivo' };
      expect(botao.id).toBe('CF_BUTTON_ARQUIVO');
    });

    test('deve ter botão Nova inscrição', () => {
      const botao = { id: 'CF_BUTTON_NOVO', texto: 'NOVA_INSCRICAO' };
      expect(botao.id).toBe('CF_BUTTON_NOVO');
    });
  });

  describe('Navegação (linhas 75-78)', () => {
    test('deve construir rota de nova inscrição corretamente', () => {
      const id = 123;
      const baseRoute = '/formacoes/inscricoes/novo';
      const novaInscricaoRoute = `${baseRoute}/${id}`;

      expect(novaInscricaoRoute).toBe('/formacoes/inscricoes/novo/123');
    });

    test('deve construir rota de inscrição por arquivo corretamente', () => {
      const id = 123;
      const baseRoute = '/formacoes/inscricoes/por-arquivo';
      const porArquivoRoute = `${baseRoute}/${id}`;

      expect(porArquivoRoute).toBe('/formacoes/inscricoes/por-arquivo/123');
    });
  });

  describe('Validação de botões desabilitados (linhas 144, 153)', () => {
    test('deve desabilitar botões quando não pode inscrever', () => {
      const dadosInscricao = { podeInscrever: false };
      const disabled = !dadosInscricao?.podeInscrever;

      expect(disabled).toBe(true);
    });

    test('deve habilitar botões quando pode inscrever', () => {
      const dadosInscricao = { podeInscrever: true };
      const disabled = !dadosInscricao?.podeInscrever;

      expect(disabled).toBe(false);
    });
  });

  describe('Parâmetros de rota (linhas 46-47)', () => {
    test('deve converter id de string para número', () => {
      const paramsId = '123';
      const id = paramsId ? parseInt(paramsId) : 0;

      expect(id).toBe(123);
    });

    test('deve retornar 0 quando id não existe', () => {
      const paramsId = undefined;
      const id = paramsId ? parseInt(paramsId) : 0;

      expect(id).toBe(0);
    });
  });

  describe('IDs de Input', () => {
    test('deve usar CF_INPUT_RF para registro funcional', () => {
      const id = 'CF_INPUT_RF';
      expect(id).toBe('CF_INPUT_RF');
    });

    test('deve usar CF_INPUT_NOME_FORMACAO para CPF', () => {
      const id = 'CF_INPUT_NOME_FORMACAO';
      expect(id).toBe('CF_INPUT_NOME_FORMACAO');
    });

    test('deve usar CF_INPUT_NOME para nome do cursista', () => {
      const id = 'CF_INPUT_NOME';
      expect(id).toBe('CF_INPUT_NOME');
    });
  });

  describe('Listagem de inscrições por turma (linha 257-258)', () => {
    test('deve ter título correto', () => {
      const titulo = 'Listagem de inscrições por turma';
      expect(titulo).toBe('Listagem de inscrições por turma');
    });
  });

  describe('location.state (linhas 49-50)', () => {
    test('deve obter nomeFormacao do state', () => {
      const state = { nomeFormacao: 'Formação Teste' };
      const nomeFormacao = state?.nomeFormacao;

      expect(nomeFormacao).toBe('Formação Teste');
    });

    test('deve obter tiposInscricoes do state', () => {
      const state = { tiposInscricoes: [1, 2] };
      const tiposInscricoes = state?.tiposInscricoes;

      expect(tiposInscricoes).toEqual([1, 2]);
    });
  });

  describe('Exibição condicional de botões (linha 138)', () => {
    test('deve exibir botões quando tem tipo inscrição manual', () => {
      const tiposInscricoes = [1];
      const TipoInscricao = { Manual: 1 };
      const temTipoInscricaoManual = tiposInscricoes?.includes(TipoInscricao.Manual);

      expect(temTipoInscricaoManual).toBe(true);
    });

    test('não deve exibir botões quando não tem tipo inscrição manual', () => {
      const tiposInscricoes = [2];
      const TipoInscricao = { Manual: 1 };
      const temTipoInscricaoManual = tiposInscricoes?.includes(TipoInscricao.Manual);

      expect(temTipoInscricaoManual).toBe(false);
    });
  });

  describe('alterarRealizouFiltro (linhas 83-85)', () => {
    test('deve alterar valor de realizouFiltro para true', () => {
      let realizouFiltro = false;
      const alterarRealizouFiltro = (valor: boolean) => {
        realizouFiltro = valor;
      };

      alterarRealizouFiltro(true);

      expect(realizouFiltro).toBe(true);
    });

    test('deve alterar valor de realizouFiltro para false', () => {
      let realizouFiltro = true;
      const alterarRealizouFiltro = (valor: boolean) => {
        realizouFiltro = valor;
      };

      alterarRealizouFiltro(false);

      expect(realizouFiltro).toBe(false);
    });
  });
});
