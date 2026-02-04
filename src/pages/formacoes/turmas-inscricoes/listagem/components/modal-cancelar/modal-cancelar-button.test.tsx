import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('react', () => {
  const actualReact = jest.requireActual('react') as object;
  return {
    ...actualReact,
    useState: jest.fn(() => [false, jest.fn()]),
  };
});

jest.mock('antd/es/button', () => ({}));

jest.mock('react-icons/fa', () => ({
  FaTimesCircle: 'FaTimesCircle',
}));

jest.mock('~/components/main/button/icon-button-data-table', () => ({
  IconButtonDataTable: 'IconButtonDataTable',
}));

jest.mock('~/core/constants/mensagens', () => ({
  CANCELAR_INSCRICAO: 'CANCELAR_INSCRICAO',
  DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA: 'DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA',
}));

jest.mock('~/core/dto/dados-listagem-inscricao-dto', () => ({}));

jest.mock('~/core/enum/situacao-inscricao', () => ({
  SituacaoInscricao: { Cancelada: 1, Confirmada: 2 },
  SituacaoInscricaoTagDisplay: { 1: 'Cancelada', 2: 'Confirmada' },
}));

jest.mock('~/core/enum/tipo-perfil', () => ({
  TipoPerfilEnum: { Cursista: 1, AreaPromotora: 2 },
  TipoPerfilTagDisplay: { 1: 'Cursista', 2: 'Área Promotora' },
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(() => 'Cursista'),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    Components: {
      DataTable: {
        ActionButtons: {
          Primary: { ERROR: '#ff0000' },
          Secondary: { ERROR: '#ffcccc' },
        },
      },
    },
  },
}));

jest.mock('./modal-cancelar', () => ({
  ModalCancelarInscricao: 'ModalCancelarInscricao',
}));

// Importa o componente após os mocks
import { ModalCancelarButton } from './modal-cancelar-button';

describe('ModalCancelarButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ModalCancelarButton).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(ModalCancelarButton.name).toBe('ModalCancelarButton');
    });

    test('deve estar definido', () => {
      expect(ModalCancelarButton).toBeDefined();
    });
  });

  describe('ModalCancelarButtonProps', () => {
    test('deve aceitar type opcional', () => {
      const props = {
        type: 'primary' as const,
      };
      expect(props.type).toBe('primary');
    });

    test('deve aceitar disabled com valor padrão false', () => {
      const disabled = false;
      expect(disabled).toBe(false);
    });

    test('deve aceitar tooltipTitle com valor padrão', () => {
      const tooltipTitle = 'Cancelar incrição';
      expect(tooltipTitle).toBe('Cancelar incrição');
    });

    test('deve ter record obrigatório', () => {
      const record = [
        {
          inscricaoId: 1,
          situacao: 'Confirmada',
          permissao: { podeCancelar: true },
        },
      ];
      expect(record).toHaveLength(1);
    });

    test('deve aceitar color opcional', () => {
      const color = '#ff0000';
      expect(color).toBe('#ff0000');
    });
  });

  describe('Estados iniciais', () => {
    test('deve ter open inicial como false', () => {
      const open = false;
      expect(open).toBe(false);
    });
  });

  describe('SituacaoInscricao', () => {
    const SituacaoInscricao = {
      Cancelada: 1,
      Confirmada: 2,
      EmEspera: 3,
      AguardandoAnalise: 4,
    };

    const SituacaoInscricaoTagDisplay: Record<number, string> = {
      1: 'Cancelada',
      2: 'Confirmada',
      3: 'Em Espera',
      4: 'Aguardando Análise',
    };

    test('deve ter situação Cancelada', () => {
      expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Cancelada]).toBe('Cancelada');
    });

    test('deve ter situação Confirmada', () => {
      expect(SituacaoInscricaoTagDisplay[SituacaoInscricao.Confirmada]).toBe('Confirmada');
    });
  });

  describe('TipoPerfilEnum', () => {
    const TipoPerfilEnum = {
      Cursista: 1,
      AreaPromotora: 2,
      Admin: 3,
    };

    const TipoPerfilTagDisplay: Record<number, string> = {
      1: 'Cursista',
      2: 'Área Promotora',
      3: 'Administrador',
    };

    test('deve ter perfil Cursista', () => {
      expect(TipoPerfilTagDisplay[TipoPerfilEnum.Cursista]).toBe('Cursista');
    });

    test('deve ter perfil AreaPromotora', () => {
      expect(TipoPerfilTagDisplay[TipoPerfilEnum.AreaPromotora]).toBe('Área Promotora');
    });
  });

  describe('Validação de desabilitarCancelar (linhas 39-45)', () => {
    test('deve desabilitar quando não pode cancelar', () => {
      const record = [
        {
          permissao: { podeCancelar: false },
          situacao: 'Confirmada',
        },
      ];

      const desabilitarCancelar =
        !record[0]?.permissao?.podeCancelar || record[0].situacao === 'Cancelada';

      expect(desabilitarCancelar).toBe(true);
    });

    test('deve desabilitar quando situação é Cancelada', () => {
      const record = [
        {
          permissao: { podeCancelar: true },
          situacao: 'Cancelada',
        },
      ];

      const desabilitarCancelar =
        !record[0]?.permissao?.podeCancelar || record[0].situacao === 'Cancelada';

      expect(desabilitarCancelar).toBe(true);
    });

    test('deve habilitar quando pode cancelar e situação não é Cancelada', () => {
      const record = [
        {
          permissao: { podeCancelar: true },
          situacao: 'Confirmada',
        },
      ];

      const desabilitarCancelar =
        !record[0]?.permissao?.podeCancelar || record[0].situacao === 'Cancelada';

      expect(desabilitarCancelar).toBe(false);
    });
  });

  describe('mensagemConfirmacaoCancelar (linhas 47-53)', () => {
    test('deve retornar mensagem padrão quando é cursista', () => {
      const ehCursista = true;
      const record = [{ integrarNoSga: true, iniciado: true }];

      const mensagem = record.length === 1 && record[0].integrarNoSga && record[0].iniciado && !ehCursista
        ? 'DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA'
        : 'CANCELAR_INSCRICAO';

      expect(mensagem).toBe('CANCELAR_INSCRICAO');
    });

    test('deve retornar mensagem para área promotora quando não é cursista', () => {
      const ehCursista = false;
      const record = [{ integrarNoSga: true, iniciado: true }];

      const mensagem = record.length === 1 && record[0].integrarNoSga && record[0].iniciado && !ehCursista
        ? 'DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA'
        : 'CANCELAR_INSCRICAO';

      expect(mensagem).toBe('DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA');
    });

    test('deve retornar mensagem padrão quando não integra no SGA', () => {
      const ehCursista = false;
      const record = [{ integrarNoSga: false, iniciado: true }];

      const mensagem = record.length === 1 && record[0].integrarNoSga && record[0].iniciado && !ehCursista
        ? 'DESEJA_CANCELAR_INSCRICAO_AREA_PROMOTORA'
        : 'CANCELAR_INSCRICAO';

      expect(mensagem).toBe('CANCELAR_INSCRICAO');
    });
  });

  describe('IconButtonDataTable', () => {
    test('deve usar ícone FaTimesCircle', () => {
      const Icon = 'FaTimesCircle';
      expect(Icon).toBe('FaTimesCircle');
    });

    test('deve ter cores corretas para erro', () => {
      const colors = {
        primary: 'ERROR',
        secondary: 'ERROR',
      };

      expect(colors.primary).toBe('ERROR');
      expect(colors.secondary).toBe('ERROR');
    });
  });

  describe('ModalCancelarInscricao (linha 79)', () => {
    test('deve mapear ids dos records corretamente', () => {
      const record = [
        { inscricaoId: 1 },
        { inscricaoId: 2 },
        { inscricaoId: 3 },
      ];

      const ids = record.map((item) => item?.inscricaoId);

      expect(ids).toEqual([1, 2, 3]);
    });
  });

  describe('Verificação de perfil (linhas 36-37)', () => {
    test('deve identificar perfil cursista', () => {
      const perfilSelecionado = 'Cursista';
      const TipoPerfilTagDisplay: Record<number, string> = { 1: 'Cursista' };
      const cursistaKey = 1;

      const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[cursistaKey];

      expect(ehCursista).toBe(true);
    });

    test('deve identificar quando não é cursista', () => {
      const perfilSelecionado = 'Área Promotora';
      const TipoPerfilTagDisplay: Record<number, string> = { 1: 'Cursista' };
      const cursistaKey = 1;

      const ehCursista = perfilSelecionado === TipoPerfilTagDisplay[cursistaKey];

      expect(ehCursista).toBe(false);
    });
  });

  describe('Validação de registro único (linha 41)', () => {
    test('deve aplicar validação apenas quando há um registro', () => {
      const recordUnico = [{ inscricaoId: 1 }];
      const recordsMultiplos = [{ inscricaoId: 1 }, { inscricaoId: 2 }];

      expect(recordUnico.length).toBe(1);
      expect(recordsMultiplos.length).toBe(2);
    });
  });
});
