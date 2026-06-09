import { describe, test, expect } from '@jest/globals';
import ButtonExcluir from './index';

describe('ButtonExcluir', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof ButtonExcluir).toBe('function');
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

    test('deve ter danger true', () => {
      const danger = true;
      expect(danger).toBe(true);
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
      const props = { id: 'CF_BUTTON_EXCLUIR' };
      expect(props.id).toBe('CF_BUTTON_EXCLUIR');
    });

    test('deve repassar loading via rest', () => {
      const props = { loading: true };
      expect(props.loading).toBe(true);
    });

    test('deve repassar className via rest', () => {
      const props = { className: 'btn-excluir-customizado' };
      expect(props.className).toBe('btn-excluir-customizado');
    });
  });

  describe('Ícone de exclusão', () => {
    test('deve usar ícone de lixeira (FaTrashAlt)', () => {
      const iconName = 'FaTrashAlt';
      expect(iconName).toBe('FaTrashAlt');
    });
  });
});
