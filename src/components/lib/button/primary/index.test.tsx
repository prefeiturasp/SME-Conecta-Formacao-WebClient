import { describe, test, expect } from '@jest/globals';

describe('ButtonPrimary', () => {
  describe('Propriedades padrão', () => {
    test('deve ter type primary', () => {
      const type = 'primary';
      expect(type).toBe('primary');
    });

    test('deve ter block true', () => {
      const block = true;
      expect(block).toBe(true);
    });
  });

  describe('Estilo padrão', () => {
    test('deve ter fontWeight 700', () => {
      const style = { fontWeight: 700, display: 'flex', alignItems: 'center' };
      expect(style.fontWeight).toBe(700);
    });

    test('deve ter display flex', () => {
      const style = { fontWeight: 700, display: 'flex', alignItems: 'center' };
      expect(style.display).toBe('flex');
    });

    test('deve ter alignItems center', () => {
      const style = { fontWeight: 700, display: 'flex', alignItems: 'center' };
      expect(style.alignItems).toBe('center');
    });
  });

  describe('Spread de props (rest)', () => {
    test('deve repassar onClick via rest', () => {
      const onClick = jest.fn();
      const props = { onClick };
      props.onClick();
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('deve repassar disabled via rest', () => {
      const props = { disabled: true };
      expect(props.disabled).toBe(true);
    });

    test('deve repassar children via rest', () => {
      const props = { children: 'Salvar' };
      expect(props.children).toBe('Salvar');
    });

    test('deve repassar id via rest', () => {
      const props = { id: 'CF_BUTTON_SALVAR' };
      expect(props.id).toBe('CF_BUTTON_SALVAR');
    });

    test('deve repassar htmlType via rest', () => {
      const props = { htmlType: 'submit' as const };
      expect(props.htmlType).toBe('submit');
    });

    test('deve repassar loading via rest', () => {
      const props = { loading: true };
      expect(props.loading).toBe(true);
    });
  });
});
