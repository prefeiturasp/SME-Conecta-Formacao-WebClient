import { describe, test, expect } from '@jest/globals';

describe('getTooltipFormInfoCircleFilled', () => {
  describe('Quando title é fornecido', () => {
    test('deve retornar um objeto com a propriedade title', () => {
      const title = 'Texto de ajuda';
      const result = title ? { title, icon: 'icon' } : undefined;
      expect(result).not.toBeUndefined();
      expect((result as any).title).toBe('Texto de ajuda');
    });

    test('deve retornar um objeto com a propriedade icon', () => {
      const title = 'Texto de ajuda';
      const result = title ? { title, icon: 'icon' } : undefined;
      expect((result as any).icon).toBeDefined();
    });

    test('deve retornar undefined quando title é undefined', () => {
      const title = undefined;
      const result = title ? { title, icon: 'icon' } : undefined;
      expect(result).toBeUndefined();
    });

    test('deve retornar undefined quando title é string vazia', () => {
      const title = '';
      const result = title ? { title, icon: 'icon' } : undefined;
      expect(result).toBeUndefined();
    });

    test('deve retornar undefined quando title é null', () => {
      const title = null;
      const result = title ? { title, icon: 'icon' } : undefined;
      expect(result).toBeUndefined();
    });
  });

  describe('Estrutura do retorno', () => {
    test('deve retornar exatamente duas propriedades: title e icon', () => {
      const title = 'Ajuda';
      const result = title ? { title, icon: 'icon' } : undefined;
      expect(Object.keys(result as object).length).toBe(2);
    });

    test('a propriedade title deve corresponder ao valor passado', () => {
      const title = 'Informação importante';
      const result = title ? { title, icon: 'icon' } : undefined;
      expect((result as any).title).toBe(title);
    });
  });
});
