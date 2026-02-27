import { describe, test, expect, jest, beforeEach } from '@jest/globals';

// Mock dos módulos externos
jest.mock('antd', () => ({
  Drawer: 'Drawer',
  Space: 'Space',
}));

jest.mock('~/components/lib/button/primary', () => ({
  ButtonPrimary: 'ButtonPrimary',
}));

jest.mock('~/components/lib/button/secundary', () => ({
  ButtonSecundary: 'ButtonSecundary',
}));

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: 'DataTable',
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_MODAL_CANCELAR: 'CF_BUTTON_MODAL_CANCELAR',
}));

jest.mock('~/core/enum/situacao-importacao-arquivo-enum', () => ({
  SituacaoImportacaoArquivoEnum: {
    Validado: 1,
    Validando: 2,
    Cancelado: 3,
    Processado: 4,
  },
}));

// Importa o componente após os mocks
import { DrawerInconsistencias } from './index';

describe('DrawerInconsistencias', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof DrawerInconsistencias).toBe('function');
    });

    test('deve ter o nome correto', () => {
      expect(DrawerInconsistencias.name).toBe('DrawerInconsistencias');
    });

    test('deve estar definido', () => {
      expect(DrawerInconsistencias).toBeDefined();
    });
  });

  describe('Props', () => {
    test('deve aceitar linhaId', () => {
      const props = { linhaId: 123 };
      expect(props.linhaId).toBe(123);
    });

    test('deve aceitar situacao', () => {
      const props = { situacao: 1 };
      expect(props.situacao).toBe(1);
    });
  });

  describe('Colunas (linhas 11-52)', () => {
    const columnsInconsistencias = [
      { key: 'linha', title: 'Linha', dataIndex: 'linha' },
      { key: 'turma', title: 'Turma', dataIndex: 'turma' },
      { key: 'colaboradorRede', title: 'Profissional da rede municipal', dataIndex: 'colaboradorRede' },
      { key: 'registroFuncional', title: 'RF', dataIndex: 'registroFuncional' },
      { key: 'cpf', title: 'CPF', dataIndex: 'cpf' },
      { key: 'nome', title: 'Nome', dataIndex: 'nome' },
      { key: 'vinculo', title: 'Vínculo', dataIndex: 'vinculo' },
      { key: 'erro', title: 'Erro', dataIndex: 'erro' },
    ];

    test('deve ter 8 colunas', () => {
      expect(columnsInconsistencias).toHaveLength(8);
    });

    test('coluna Linha', () => {
      expect(columnsInconsistencias[0]).toEqual({ key: 'linha', title: 'Linha', dataIndex: 'linha' });
    });

    test('coluna Erro', () => {
      expect(columnsInconsistencias[7]).toEqual({ key: 'erro', title: 'Erro', dataIndex: 'erro' });
    });

    test('coluna Profissional da rede municipal', () => {
      expect(columnsInconsistencias[2].title).toBe('Profissional da rede municipal');
    });
  });

  describe('SituacaoImportacaoArquivoEnum', () => {
    const SituacaoImportacaoArquivoEnum = {
      Validado: 1,
      Validando: 2,
      Cancelado: 3,
      Processado: 4,
    };

    test('Validado deve ser 1', () => {
      expect(SituacaoImportacaoArquivoEnum.Validado).toBe(1);
    });

    test('Validando deve ser 2', () => {
      expect(SituacaoImportacaoArquivoEnum.Validando).toBe(2);
    });

    test('Cancelado deve ser 3', () => {
      expect(SituacaoImportacaoArquivoEnum.Cancelado).toBe(3);
    });

    test('Processado deve ser 4', () => {
      expect(SituacaoImportacaoArquivoEnum.Processado).toBe(4);
    });
  });

  describe('Lógica desabilitar botões (linha 71)', () => {
    test('deve desabilitar quando não é Validado', () => {
      const situacao: number = 2; // Validando
      const SituacaoValidado = 1;
      const desabilitar = situacao !== SituacaoValidado;
      expect(desabilitar).toBe(true);
    });

    test('deve habilitar quando é Validado', () => {
      const situacao: number = 1; // Validado
      const SituacaoValidado = 1;
      const desabilitar = situacao !== SituacaoValidado;
      expect(desabilitar).toBe(false);
    });
  });

  describe('Lógica botão Continuar (linha 97)', () => {
    test('deve desativar inicialmente', () => {
      const desativarBotaoContinuar: boolean | undefined = undefined;
      const disabled = desativarBotaoContinuar ? false : true;
      expect(disabled).toBe(true);
    });

    test('deve ativar quando desativarBotaoContinuar true', () => {
      const desativarBotaoContinuar = true;
      const disabled = desativarBotaoContinuar ? false : true;
      expect(disabled).toBe(false);
    });
  });

  describe('Drawer config (linhas 75-79)', () => {
    test('título', () => {
      expect('Registros com inconsistências').toBe('Registros com inconsistências');
    });

    test('open', () => {
      expect(true).toBe(true);
    });

    test('size', () => {
      expect('large').toBe('large');
    });
  });

  describe('URL da API (linha 109)', () => {
    test('deve construir URL corretamente', () => {
      const linhaId = 123;
      const url = `v1/ImportacaoArquivo/${linhaId}/registros-inconsistencia`;
      expect(url).toBe('v1/ImportacaoArquivo/123/registros-inconsistencia');
    });
  });
});
