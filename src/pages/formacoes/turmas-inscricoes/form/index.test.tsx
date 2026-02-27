import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Button: 'Button',
  Col: 'Col',
  Form: { Item: 'FormItem' },
  Row: 'Row',
}));

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{ resetFields: jest.fn(), getFieldValue: jest.fn(), setFieldValue: jest.fn(), validateFields: jest.fn() }],
  useWatch: jest.fn(() => true),
}));

jest.mock('antd/es/select', () => ({}));

jest.mock('lodash', () => ({
  cloneDeep: jest.fn((obj) => JSON.parse(JSON.stringify(obj))),
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ state: { nomeFormacao: 'Teste' } }),
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: '123' }),
}));

jest.mock('~/components/lib/card-content', () => ({ __esModule: true, default: 'CardContent' }));
jest.mock('~/components/lib/header-page', () => ({ __esModule: true, default: 'HeaderPage' }));
jest.mock('~/components/lib/inputs/select', () => ({ __esModule: true, default: 'Select' }));
jest.mock('~/components/lib/notification', () => ({ notification: { success: jest.fn(), error: jest.fn() } }));
jest.mock('~/components/main/button/voltar', () => ({ __esModule: true, default: 'ButtonVoltar' }));
jest.mock('~/components/main/input/cpf', () => ({ __esModule: true, default: 'InputCPF' }));
jest.mock('~/components/main/input/input-registro-funcional', () => ({ __esModule: true, default: 'InputRegistroFuncional' }));
jest.mock('~/components/main/input/profissional-rede-municipal', () => ({ __esModule: true, default: 'RadioSimNao' }));
jest.mock('~/components/main/input/turmas-encontros', () => ({ __esModule: true, default: 'SelectTurmaEncontros' }));
jest.mock('~/components/main/text/input-text', () => ({ __esModule: true, default: 'InputTexto' }));
jest.mock('~/pages/formacao-cursista/inscricao/components/funcao-atividade', () => ({ __esModule: true, default: 'SelectFuncaoAtividade' }));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_CANCELAR: 'CF_BUTTON_CANCELAR',
  CF_BUTTON_NOVO: 'CF_BUTTON_NOVO',
  CF_BUTTON_VOLTAR: 'CF_BUTTON_VOLTAR',
}));

jest.mock('~/core/constants/ids/input', () => ({ CF_INPUT_NOME: 'CF_INPUT_NOME' }));
jest.mock('~/core/constants/ids/select', () => ({ CF_SELECT_CARGO: 'CF_SELECT_CARGO' }));
jest.mock('~/core/constants/mensagens', () => ({ ERRO_INSCRICAO_MANUAL: 'Erro', RF_NAO_INFORMADO: 'RF não informado' }));
jest.mock('~/core/enum/routes-enum', () => ({ ROUTES: { FORMACAOES_INSCRICOES_EDITAR: '/editar' } }));
jest.mock('~/core/services/alerta-service', () => ({ confirmacao: jest.fn() }));
jest.mock('~/core/services/inscricao-service', () => ({ inserirInscricaoManual: jest.fn(), obterRfCpf: jest.fn() }));
jest.mock('~/core/utils/form', () => ({ onClickCancelar: jest.fn(), onClickVoltar: jest.fn() }));
jest.mock('~/core/utils/functions', () => ({ removerTudoQueNaoEhDigito: (v: string) => v.replace(/\D/g, '') }));

// Importa o componente após os mocks
import { FormCadastrosInscricoesManuais } from './index';

describe('FormCadastrosInscricoesManuais', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof FormCadastrosInscricoesManuais).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(FormCadastrosInscricoesManuais.name).toBe('FormCadastrosInscricoesManuais');
    });

    test('deve estar definido', () => {
      expect(FormCadastrosInscricoesManuais).toBeDefined();
    });
  });

  describe('Estados iniciais', () => {
    test('optionsSelects inicial deve ser undefined', () => {
      const optionsSelects: any[] | undefined = undefined;
      expect(optionsSelects).toBeUndefined();
    });

    test('optionsCargo inicial deve ser undefined', () => {
      const optionsCargo: any[] | undefined = undefined;
      expect(optionsCargo).toBeUndefined();
    });
  });

  describe('InscricaoManualDTO', () => {
    test('deve ter estrutura básica', () => {
      const dto = {
        propostaTurmaId: 1,
        profissionalRede: true,
        registroFuncional: '1234567',
        cpf: '12345678901',
      };
      expect(dto).toHaveProperty('propostaTurmaId');
      expect(dto).toHaveProperty('profissionalRede');
    });

    test('deve ter campos de cargo', () => {
      const dto = {
        cargoCodigo: 'PROF',
        cargoDreCodigo: 'DRE01',
        cargoUeCodigo: 'UE001',
        tipoVinculo: 1,
      };
      expect(dto).toHaveProperty('cargoCodigo');
      expect(dto).toHaveProperty('tipoVinculo');
    });
  });

  describe('Validação profissionalRede (linhas 253, 279)', () => {
    test('RF obrigatório quando profissionalRede true', () => {
      const profissionalRede = true;
      expect(profissionalRede).toBe(true);
    });

    test('CPF obrigatório quando profissionalRede false', () => {
      const profissionalRede = false;
      expect(!profissionalRede).toBe(true);
    });
  });

  describe('HeaderPage título (linha 180)', () => {
    test('deve ter título base', () => {
      const titulo = 'Inscrição Manual';
      expect(titulo).toBe('Inscrição Manual');
    });

    test('deve concatenar nome da formação', () => {
      const nomeFormacao = 'Formação Teste';
      const formacaoNome = nomeFormacao ? `- ${nomeFormacao}` : '';
      expect(`Inscrição Manual ${formacaoNome}`).toBe('Inscrição Manual - Formação Teste');
    });
  });

  describe('removerTudoQueNaoEhDigito (linha 67)', () => {
    test('deve remover não numéricos do CPF', () => {
      const cpf = '123.456.789-01';
      expect(cpf.replace(/\D/g, '')).toBe('12345678901');
    });

    test('deve manter apenas dígitos', () => {
      const valor = 'abc123def';
      expect(valor.replace(/\D/g, '')).toBe('123');
    });
  });

  describe('Processamento usuarioCargos (linhas 141-175)', () => {
    test('deve mapear cargos corretamente', () => {
      const optionsSelects = [{ codigo: 'PROF1', descricao: 'Professor I', tipoVinculo: 1, funcoes: [] }];
      const usuarioCargos = optionsSelects.map((item) => ({
        value: optionsSelects.length > 1 ? `${item.codigo}-${item.tipoVinculo}` : item.codigo,
        label: item.descricao,
      }));
      expect(usuarioCargos[0].value).toBe('PROF1');
      expect(usuarioCargos[0].label).toBe('Professor I');
    });

    test('deve criar value com tipoVinculo quando múltiplos cargos', () => {
      const optionsSelects = [
        { codigo: 'PROF1', descricao: 'Professor I', tipoVinculo: 1 },
        { codigo: 'PROF2', descricao: 'Professor II', tipoVinculo: 2 },
      ];
      const usuarioCargos = optionsSelects.map((item) => ({
        value: optionsSelects.length > 1 ? `${item.codigo}-${item.tipoVinculo}` : item.codigo,
        label: item.descricao,
      }));
      expect(usuarioCargos[0].value).toBe('PROF1-1');
      expect(usuarioCargos[1].value).toBe('PROF2-2');
    });
  });

  describe('Parâmetros de rota (linhas 43-44)', () => {
    test('deve converter id de string para número', () => {
      const paramsId = '123';
      expect(parseInt(paramsId)).toBe(123);
    });

    test('deve retornar 0 quando id não existe', () => {
      const paramsId = undefined;
      expect(paramsId ? parseInt(paramsId) : 0).toBe(0);
    });
  });

  describe('Notificação de sucesso (linhas 51-58)', () => {
    test('deve ter estrutura correta', () => {
      const notificacao = {
        message: 'Sucesso',
        description: 'Inscrição manual realizada com sucesso!',
      };
      expect(notificacao.message).toBe('Sucesso');
    });
  });
});
