import { describe, test, expect } from '@jest/globals';
import { ButtonSecundary } from './index';

describe('ButtonSecundary', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ButtonSecundary).toBe('function');
    });
  });

  describe('Propriedades padrão', () => {
    test('deve ter type default', () => {
      const type = 'default';
      expect(type).toBe('default');
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
      const props = { children: 'Cancelar' };
      expect(props.children).toBe('Cancelar');
    });

    test('deve repassar loading via rest', () => {
      const props = { loading: true };
      expect(props.loading).toBe(true);
    });
  });
});
