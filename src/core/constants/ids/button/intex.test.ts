import {
  CF_BUTTON_ACESSAR,
  CF_BUTTON_CANCELAR,
  CF_BUTTON_VOLTAR,
  CF_BUTTON_NOVO,
  CF_BUTTON_SALVAR,
  CF_BUTTON_CONTINUAR,
  CF_BUTTON_EXCLUIR,
} from './intex';

describe('Button IDs Constants', () => {
  test('todas as constantes devem estar definidas', () => {
    expect(CF_BUTTON_ACESSAR).toBeDefined();
    expect(CF_BUTTON_CANCELAR).toBeDefined();
    expect(CF_BUTTON_VOLTAR).toBeDefined();
    expect(CF_BUTTON_NOVO).toBeDefined();
    expect(CF_BUTTON_SALVAR).toBeDefined();
  });

  test('todas as constantes devem ser strings', () => {
    expect(typeof CF_BUTTON_ACESSAR).toBe('string');
    expect(typeof CF_BUTTON_CANCELAR).toBe('string');
    expect(typeof CF_BUTTON_VOLTAR).toBe('string');
  });

  test('todas as constantes devem começar com CF_BUTTON_', () => {
    expect(CF_BUTTON_ACESSAR).toMatch(/^CF_BUTTON_/);
    expect(CF_BUTTON_CANCELAR).toMatch(/^CF_BUTTON_/);
    expect(CF_BUTTON_VOLTAR).toMatch(/^CF_BUTTON_/);
    expect(CF_BUTTON_NOVO).toMatch(/^CF_BUTTON_/);
  });

  test('constantes devem ter valores específicos', () => {
    expect(CF_BUTTON_ACESSAR).toBe('CF_BUTTON_ACESSAR');
    expect(CF_BUTTON_VOLTAR).toBe('CF_BUTTON_VOLTAR');
    expect(CF_BUTTON_NOVO).toBe('CF_BUTTON_NOVO');
    expect(CF_BUTTON_SALVAR).toBe('CF_BUTTON_SALVAR');
  });

  test('constantes não devem ser vazias', () => {
    expect(CF_BUTTON_ACESSAR.length).toBeGreaterThan(0);
    expect(CF_BUTTON_CONTINUAR.length).toBeGreaterThan(0);
    expect(CF_BUTTON_EXCLUIR.length).toBeGreaterThan(0);
  });
});
