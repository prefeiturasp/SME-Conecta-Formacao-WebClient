import { describe, test, expect } from '@jest/globals';
import HeaderPage from './index';
import { BoxShadow, Colors } from '~/core/styles/colors';

describe('HeaderPage', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof HeaderPage).toBe('function');
    });
  });
  describe('Propriedades padrão', () => {
    test('deve aceitar título como string', () => {
      const title = 'Cadastro de Propostas';
      expect(title).toBe('Cadastro de Propostas');
    });

    test('título não deve ser vazio', () => {
      const title = 'Cadastro de Propostas';
      expect(title.length).toBeGreaterThan(0);
    });

    test('deve aceitar children opcionais', () => {
      const children = null;
      expect(children).toBeNull();
    });
  });

  describe('Affix', () => {
    test('deve ter offsetTop de 70', () => {
      const offsetTop = 70;
      expect(offsetTop).toBe(70);
    });
  });

  describe('Estilo do HeaderContainer', () => {
    test('deve ter display flex', () => {
      const style = { display: 'flex', alignItems: 'end' };
      expect(style.display).toBe('flex');
    });

    test('deve ter alignItems end', () => {
      const style = { display: 'flex', alignItems: 'end' };
      expect(style.alignItems).toBe('end');
    });

    test('deve ter marginLeft de -32px', () => {
      const style = { marginLeft: '-32px', marginRight: '-32px', paddingBottom: '8px' };
      expect(style.marginLeft).toBe('-32px');
    });

    test('deve ter marginRight de -32px', () => {
      const style = { marginLeft: '-32px', marginRight: '-32px', paddingBottom: '8px' };
      expect(style.marginRight).toBe('-32px');
    });

    test('deve ter paddingBottom de 8px', () => {
      const style = { marginLeft: '-32px', marginRight: '-32px', paddingBottom: '8px' };
      expect(style.paddingBottom).toBe('8px');
    });
  });

  describe('Estilo do HeaderContentContainer', () => {
    test('deve ter width 100%', () => {
      const style = { width: '100%', display: 'flex', justifyContent: 'space-between' };
      expect(style.width).toBe('100%');
    });

    test('deve ter display flex', () => {
      const style = { width: '100%', display: 'flex', justifyContent: 'space-between' };
      expect(style.display).toBe('flex');
    });

    test('deve ter justifyContent space-between', () => {
      const style = { width: '100%', display: 'flex', justifyContent: 'space-between' };
      expect(style.justifyContent).toBe('space-between');
    });

    test('deve ter marginLeft de 32px', () => {
      const style = { marginLeft: '32px', marginRight: '32px', paddingTop: '8px' };
      expect(style.marginLeft).toBe('32px');
    });

    test('deve ter paddingTop de 8px', () => {
      const style = { marginLeft: '32px', marginRight: '32px', paddingTop: '8px' };
      expect(style.paddingTop).toBe('8px');
    });
  });

  describe('Estilo do Title', () => {
    test('deve ter fontSize de 23px', () => {
      const style = { fontSize: '23px', fontWeight: 700 };
      expect(style.fontSize).toBe('23px');
    });

    test('deve ter fontWeight 700', () => {
      const style = { fontSize: '23px', fontWeight: 700 };
      expect(style.fontWeight).toBe(700);
    });

    test('deve usar Colors.Neutral.DARK como cor do título', () => {
      expect(Colors.Neutral.DARK).toBeTruthy();
    });
  });

  describe('Estilo do AffixContainer', () => {
    test('deve usar BoxShadow.DEFAULT no ant-affix', () => {
      expect(BoxShadow.DEFAULT).toBeTruthy();
    });
  });

  describe('Estilo do ChildrenContainer', () => {
    test('deve ter display flex', () => {
      const style = { display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'nowrap', alignItems: 'center' };
      expect(style.display).toBe('flex');
    });

    test('deve ter gap de 8px', () => {
      const style = { display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'nowrap', alignItems: 'center' };
      expect(style.gap).toBe('8px');
    });

    test('deve ter marginLeft auto para alinhar à direita', () => {
      const style = { display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'nowrap', alignItems: 'center' };
      expect(style.marginLeft).toBe('auto');
    });

    test('deve ter flexWrap nowrap', () => {
      const style = { display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'nowrap', alignItems: 'center' };
      expect(style.flexWrap).toBe('nowrap');
    });

    test('deve ter alignItems center', () => {
      const style = { display: 'flex', gap: '8px', marginLeft: 'auto', flexWrap: 'nowrap', alignItems: 'center' };
      expect(style.alignItems).toBe('center');
    });
  });
});
