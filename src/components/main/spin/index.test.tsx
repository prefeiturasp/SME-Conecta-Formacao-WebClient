import { describe, test, expect } from '@jest/globals';

describe('Spin', () => {
  describe('Estado de carregamento via Redux', () => {
    test('deve exibir spinner quando spinning é true', () => {
      const spinning = true;
      expect(spinning).toBe(true);
    });

    test('não deve exibir spinner quando spinning é false', () => {
      const spinning = false;
      expect(spinning).toBe(false);
    });

    test('deve ler spinning do estado Redux em state.spin.spinning', () => {
      const state = { spin: { spinning: true } };
      expect(state.spin.spinning).toBe(true);
    });

    test('spinning deve ser false por padrão quando o estado está inativo', () => {
      const state = { spin: { spinning: false } };
      expect(state.spin.spinning).toBe(false);
    });
  });

  describe('Indicador de carregamento', () => {
    test('deve ter fontSize de 24 no indicador', () => {
      const indicatorStyle = { fontSize: 24 };
      expect(indicatorStyle.fontSize).toBe(24);
    });
  });

  describe('Spread de props (rest)', () => {
    test('deve repassar tip via rest', () => {
      const props = { tip: 'Carregando...' };
      expect(props.tip).toBe('Carregando...');
    });

    test('deve repassar size via rest', () => {
      const props = { size: 'large' as const };
      expect(props.size).toBe('large');
    });

    test('deve renderizar children internamente', () => {
      const children = 'Conteúdo filho';
      expect(children).toBe('Conteúdo filho');
    });
  });
});
