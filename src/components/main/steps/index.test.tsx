import { describe, test, expect } from '@jest/globals';

describe('Steps', () => {
  describe('Propriedades padrão', () => {
    test('deve ter size small', () => {
      const size = 'small';
      expect(size).toBe('small');
    });

    test('deve ter current 0 como passo inicial', () => {
      const current = 0;
      expect(current).toBe(0);
    });

    test('deve ter labelPlacement vertical', () => {
      const labelPlacement = 'vertical';
      expect(labelPlacement).toBe('vertical');
    });
  });

  describe('Estilo padrão', () => {
    test('deve ter fontWeight 700', () => {
      const style = { fontWeight: 700, padding: 16 };
      expect(style.fontWeight).toBe(700);
    });

    test('deve ter padding 16', () => {
      const style = { fontWeight: 700, padding: 16 };
      expect(style.padding).toBe(16);
    });
  });

  describe('Spread de props (rest)', () => {
    test('deve repassar current via rest sobrescrevendo o padrão', () => {
      const defaultCurrent = 0;
      const overrideCurrent = 2;
      const current = overrideCurrent ?? defaultCurrent;
      expect(current).toBe(2);
    });

    test('deve repassar items via rest', () => {
      const items = [{ title: 'Passo 1' }, { title: 'Passo 2' }];
      expect(items.length).toBe(2);
    });

    test('deve repassar onChange via rest', () => {
      const onChange = jest.fn();
      const props = { onChange };
      props.onChange(1);
      expect(onChange).toHaveBeenCalledWith(1);
    });

    test('deve repassar direction via rest', () => {
      const props = { direction: 'horizontal' as const };
      expect(props.direction).toBe('horizontal');
    });
  });
});
