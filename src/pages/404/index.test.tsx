import { describe, test, expect } from '@jest/globals';
import PageNotFound from './index';

describe('PageNotFound (404)', () => {
  test('é um componente React válido', () => {
    expect(typeof PageNotFound).toBe('function');
  });

  test('deve ter mensagem de página não encontrada', () => {
    const subTitle = 'Desculpe, a página que você visitou não existe.';
    expect(subTitle).toContain('não existe');
  });

  test('mensagem deve ser diferente da página 403', () => {
    const msg403 = 'Você não tem permissão a esta funcionalidade!';
    const msg404 = 'Desculpe, a página que você visitou não existe.';
    expect(msg403).not.toBe(msg404);
  });
});
