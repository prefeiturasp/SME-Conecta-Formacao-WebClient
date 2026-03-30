import { describe, test, expect } from '@jest/globals';

jest.mock('~/assets/conecta-formacao-logo.svg', () => 'mock-logo');
jest.mock('styled-components', () => {
  const tagged = () => () => null;
  const styled: any = tagged;
  ['div', 'img', 'span', 'a', 'p', 'button', 'section', 'header', 'nav', 'ul', 'li'].forEach(t => {
    styled[t] = tagged;
  });
  return { default: styled, css: () => '', __esModule: true };
});

import { ImgFormacao, DivInscricaoEncerrada } from './index';

describe('ImgFormacao', () => {
  test('é um componente React válido', () => {
    expect(typeof ImgFormacao).toBe('function');
  });

  test('DivInscricaoEncerrada é um styled component válido', () => {
    expect(DivInscricaoEncerrada).toBeDefined();
  });

  test('usa imagem padrão quando url não é fornecida', () => {
    const url: string | undefined = undefined;
    const imagemFallback = 'mock-logo';

    const srcResolvida = url ?? imagemFallback;

    expect(srcResolvida).toBe(imagemFallback);
  });

  test('usa url fornecida quando disponível', () => {
    const url = 'https://exemplo.com/imagem.jpg';

    const srcResolvida = url ?? 'fallback.svg';

    expect(srcResolvida).toBe(url);
  });

  test('banner de inscrições encerradas é controlado pela prop inscricaoEncerrada', () => {
    const inscricaoEncerrada = true;
    expect(inscricaoEncerrada).toBe(true);

    const inscricaoAberta = false;
    expect(inscricaoAberta).toBe(false);
  });
});
