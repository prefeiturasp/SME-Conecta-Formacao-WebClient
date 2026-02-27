import {
  CF_INPUT_LOGIN,
  CF_INPUT_CPF,
  CF_INPUT_SENHA,
  CF_INPUT_EMAIL,
  CF_INPUT_NOME,
  CF_INPUT_TELEFONE,
  CF_INPUT_RF,
  CF_INPUT_TOTAL_VAGAS,
} from './index';

describe('Input IDs Constants', () => {
  test('todas as constantes devem estar definidas', () => {
    expect(CF_INPUT_LOGIN).toBeDefined();
    expect(CF_INPUT_CPF).toBeDefined();
    expect(CF_INPUT_SENHA).toBeDefined();
    expect(CF_INPUT_EMAIL).toBeDefined();
    expect(CF_INPUT_NOME).toBeDefined();
  });

  test('todas as constantes devem ser strings', () => {
    expect(typeof CF_INPUT_LOGIN).toBe('string');
    expect(typeof CF_INPUT_SENHA).toBe('string');
    expect(typeof CF_INPUT_EMAIL).toBe('string');
    expect(typeof CF_INPUT_NOME).toBe('string');
  });

  test('todas as constantes devem começar com CF_INPUT_', () => {
    expect(CF_INPUT_LOGIN).toMatch(/^CF_INPUT_/);
    expect(CF_INPUT_SENHA).toMatch(/^CF_INPUT_/);
    expect(CF_INPUT_EMAIL).toMatch(/^CF_INPUT_/);
    expect(CF_INPUT_TELEFONE).toMatch(/^CF_INPUT_/);
    expect(CF_INPUT_RF).toMatch(/^CF_INPUT_/);
  });

  test('constantes devem ter valores específicos', () => {
    expect(CF_INPUT_LOGIN).toBe('CF_INPUT_LOGIN');
    expect(CF_INPUT_SENHA).toBe('CF_INPUT_SENHA');
    expect(CF_INPUT_EMAIL).toBe('CF_INPUT_EMAIL');
    expect(CF_INPUT_NOME).toBe('CF_INPUT_NOME');
    expect(CF_INPUT_RF).toBe('CF_INPUT_RF');
  });

  test('constantes não devem ser vazias', () => {
    expect(CF_INPUT_LOGIN.length).toBeGreaterThan(0);
    expect(CF_INPUT_TOTAL_VAGAS.length).toBeGreaterThan(0);
    expect(CF_INPUT_TELEFONE.length).toBeGreaterThan(0);
  });

  test('constantes exportadas devem estar acessíveis', () => {
    const constants = [
      CF_INPUT_LOGIN,
      CF_INPUT_CPF,
      CF_INPUT_SENHA,
      CF_INPUT_EMAIL,
      CF_INPUT_NOME,
      CF_INPUT_TELEFONE,
      CF_INPUT_RF,
    ];

    constants.forEach((constant) => {
      expect(constant).toBeTruthy();
      expect(typeof constant).toBe('string');
    });
  });
});
