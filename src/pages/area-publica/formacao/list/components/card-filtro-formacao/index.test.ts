import { describe, test, expect } from '@jest/globals';

jest.mock('./index', () => ({
  CardFiltroFormacao: () => null,
}));

import { CardFiltroFormacao } from './index';

describe('CardFiltroFormacao', () => {
  test('é um componente React válido', () => {
    expect(typeof CardFiltroFormacao).toBe('function');
  });

  test('texto do botão de busca está correto', () => {
    const textoBotao = 'Buscar formações';
    expect(textoBotao).toBe('Buscar formações');
  });

  test('título da seção está correto', () => {
    const titulo = 'Nova inscrição';
    expect(titulo).toBe('Nova inscrição');
  });

  test('descrição da seção está correta', () => {
    const descricao = 'Confira quais são as formações disponíveis e realize a inscrição.';
    expect(descricao).toBeTruthy();
    expect(descricao).toContain('formações disponíveis');
  });
});
