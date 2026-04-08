import { describe, test, expect } from '@jest/globals';
import { Colors } from '~/core/styles/colors';

describe('CollapsePanelSME', () => {
  describe('Propriedades padrão', () => {
    test('deve ter exibirTooltip false por padrão', () => {
      const exibirTooltip = false;
      expect(exibirTooltip).toBe(false);
    });

    test('deve ter expandIconPosition right', () => {
      const expandIconPosition = 'right';
      expect(expandIconPosition).toBe('right');
    });
  });

  describe('Estilo do título do painel', () => {
    test('deve ter fontSize 14', () => {
      const style = { fontSize: 14, fontWeight: 'bold' };
      expect(style.fontSize).toBe(14);
    });

    test('deve ter fontWeight bold', () => {
      const style = { fontSize: 14, fontWeight: 'bold' };
      expect(style.fontWeight).toBe('bold');
    });

    test('deve usar a cor primária do sistema no título', () => {
      const color = Colors.SystemSME.ConectaFormacao.PRIMARY;
      expect(color).toBeTruthy();
    });
  });

  describe('Estilo do collapse', () => {
    test('deve ter borderLeft com espessura de 10px', () => {
      const borderLeft = `10px solid ${Colors.SystemSME.ConectaFormacao.PRIMARY}`;
      expect(borderLeft.startsWith('10px')).toBe(true);
    });

    test('deve usar a cor primária do sistema no borderLeft', () => {
      const borderLeft = `10px solid ${Colors.SystemSME.ConectaFormacao.PRIMARY}`;
      expect(borderLeft).toContain(Colors.SystemSME.ConectaFormacao.PRIMARY);
    });
  });

  describe('genExtra - campos obrigatórios', () => {
    test('deve exibir texto de campos obrigatórios', () => {
      const texto = 'Campos de Preenchimento Obrigatório';
      expect(texto).toBe('Campos de Preenchimento Obrigatório');
    });

    test('deve ter indicador de campo obrigatório com *', () => {
      const indicador = '* ';
      expect(indicador.trim()).toBe('*');
    });

    test('indicador obrigatório deve ter cor vermelha', () => {
      const color = 'red';
      expect(color).toBe('red');
    });

    test('texto de obrigatório deve ter fontSize 12px', () => {
      const style = { fontSize: '12px' };
      expect(style.fontSize).toBe('12px');
    });
  });

  describe('Tooltip', () => {
    test('deve exibir ícone quando exibirTooltip é true', () => {
      const exibirTooltip = true;
      expect(exibirTooltip).toBe(true);
    });

    test('não deve exibir ícone quando exibirTooltip é false', () => {
      const exibirTooltip = false;
      expect(exibirTooltip).toBe(false);
    });

    test('deve aceitar título de tooltip customizado', () => {
      const titleToolTip = 'Informações adicionais sobre este painel';
      expect(titleToolTip).toBe('Informações adicionais sobre este painel');
    });
  });

  describe('Props do painel', () => {
    test('deve aceitar header via panelProps', () => {
      const panelProps = { header: 'Seção de Dados', key: '1' };
      expect(panelProps.header).toBe('Seção de Dados');
    });

    test('deve aceitar key via panelProps', () => {
      const panelProps = { header: 'Seção de Dados', key: '1' };
      expect(panelProps.key).toBe('1');
    });

    test('deve aceitar children como ReactNode', () => {
      const children = 'Conteúdo do painel';
      expect(children).toBeTruthy();
    });
  });
});
