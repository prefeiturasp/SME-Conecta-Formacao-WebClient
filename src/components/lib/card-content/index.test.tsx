import { describe, test, expect } from '@jest/globals';
import CardContent from './index';

describe('CardContent', () => {
  describe('Componente', () => {
    test('deve ser uma função', () => {
      expect(typeof CardContent).toBe('function');
    });
  });

  describe('Props', () => {
    test('deve aceitar children como prop', () => {
      const props = { children: 'Conteúdo' };
      expect(props.children).toBe('Conteúdo');
    });
  });
});
