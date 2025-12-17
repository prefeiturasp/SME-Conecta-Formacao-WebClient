import { validateMessages } from './validate-messages';

describe('validateMessages', () => {
  test('deve ter mensagem de campo obrigatório', () => {
    expect(validateMessages.required).toBe('Campo obrigatório');
  });

  test('deve ter mensagem de whitespace', () => {
    expect(validateMessages.whitespace).toBe('Campo obrigatório');
  });

  test('deve ter mensagens de validação de string', () => {
    expect(validateMessages.string).toBeDefined();
    expect(validateMessages.string?.range).toBe('Deve ter entre ${min} e ${max} caracteres');
    expect(validateMessages.string?.min).toBe('Deve conter no mínimo ${min} caracteres');
    expect(validateMessages.string?.len).toBe('Deve conter ${len} caracteres');
  });

  test('mensagens de string devem conter placeholders corretos', () => {
    expect(validateMessages.string?.range).toContain('${min}');
    expect(validateMessages.string?.range).toContain('${max}');
    expect(validateMessages.string?.min).toContain('${min}');
    expect(validateMessages.string?.len).toContain('${len}');
  });

  test('validateMessages deve ser um objeto', () => {
    expect(typeof validateMessages).toBe('object');
    expect(validateMessages).not.toBeNull();
  });

  test('todas as mensagens devem ser strings não vazias', () => {
    expect(validateMessages.required).toBeTruthy();
    expect(validateMessages.whitespace).toBeTruthy();
    expect(validateMessages.string?.range).toBeTruthy();
    expect(validateMessages.string?.min).toBeTruthy();
    expect(validateMessages.string?.len).toBeTruthy();
  });
});
