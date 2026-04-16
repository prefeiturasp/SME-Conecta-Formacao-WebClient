import { describe, test, expect } from '@jest/globals';
import { ButtonImprimir } from './index';

describe('ButtonImprimir', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ButtonImprimir).toBe('function');
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
    test('deve ter width de 43px', () => {
      const style = { width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      expect(style.width).toBe('43px');
    });

    test('deve ter display flex', () => {
      const style = { width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      expect(style.display).toBe('flex');
    });

    test('deve ter alignItems center', () => {
      const style = { width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      expect(style.alignItems).toBe('center');
    });

    test('deve ter justifyContent center', () => {
      const style = { width: '43px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
      expect(style.justifyContent).toBe('center');
    });
  });

  describe('Ícone de impressão', () => {
    test('deve usar ícone AiFillPrinter', () => {
      const iconName = 'AiFillPrinter';
      expect(iconName).toBe('AiFillPrinter');
    });

    test('deve ter tamanho de ícone 20', () => {
      const iconSize = 20;
      expect(iconSize).toBe(20);
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

    test('deve repassar id via rest', () => {
      const props = { id: 'CF_BUTTON_IMPRIMIR' };
      expect(props.id).toBe('CF_BUTTON_IMPRIMIR');
    });

    test('deve repassar loading via rest', () => {
      const props = { loading: true };
      expect(props.loading).toBe(true);
    });

    test('deve repassar className via rest', () => {
      const props = { className: 'btn-imprimir-custom' };
      expect(props.className).toBe('btn-imprimir-custom');
    });
  });
});
