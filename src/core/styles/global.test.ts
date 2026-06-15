/**
 * @jest-environment jsdom
 */

import GlobalStyle from './global';

describe('GlobalStyle', () => {
  it('deve exportar o GlobalStyle', () => {
    expect(GlobalStyle).toBeDefined();
  });
});