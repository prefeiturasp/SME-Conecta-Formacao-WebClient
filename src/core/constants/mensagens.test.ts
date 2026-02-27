import {
  ERRO_LOGIN_SENHA_INCORRETOS,
  ERRO_INFORMAR_USUARIO_SENHA,
  ERRO_LOGIN,
  DESEJA_CANCELAR_ALTERACOES,
  DESEJA_EXCLUIR_REGISTRO,
  SUA_INSCRICAO_NAO_FOI_ENVIADA,
  REGISTRO_EXCLUIDO_SUCESSO,
  PROPOSTA_SALVA_SUCESSO,
  PROPOSTA_ENVIADA,
  ERRO_CAMPOS_OBRIGATORIOS,
  NOVA_INSCRICAO,
} from './mensagens';

describe('Mensagens Constantes', () => {
  test('mensagens de erro devem estar definidas e não vazias', () => {
    expect(ERRO_LOGIN_SENHA_INCORRETOS).toBe('Usuário ou senha incorretos');
    expect(ERRO_LOGIN_SENHA_INCORRETOS).toBeTruthy();

    expect(ERRO_INFORMAR_USUARIO_SENHA).toBeTruthy();
    expect(ERRO_LOGIN).toBeTruthy();
  });

  test('mensagens de confirmação devem estar definidas', () => {
    expect(DESEJA_CANCELAR_ALTERACOES).toContain('cancelar');
    expect(DESEJA_EXCLUIR_REGISTRO).toContain('excluir');
    expect(SUA_INSCRICAO_NAO_FOI_ENVIADA).toContain('inscrição');
  });

  test('mensagens de sucesso devem estar definidas', () => {
    expect(REGISTRO_EXCLUIDO_SUCESSO).toContain('sucesso');
    expect(PROPOSTA_SALVA_SUCESSO).toContain('sucesso');
    expect(PROPOSTA_ENVIADA).toContain('sucesso');
  });

  test('mensagem de erro de campos obrigatórios deve estar definida', () => {
    expect(ERRO_CAMPOS_OBRIGATORIOS).toBe('Existem campos obrigatórios não preenchidos');
    expect(ERRO_CAMPOS_OBRIGATORIOS).toContain('obrigatórios');
  });

  test('todas as mensagens devem ser strings', () => {
    expect(typeof ERRO_LOGIN_SENHA_INCORRETOS).toBe('string');
    expect(typeof DESEJA_CANCELAR_ALTERACOES).toBe('string');
    expect(typeof REGISTRO_EXCLUIDO_SUCESSO).toBe('string');
  });

  test('mensagens de confirmação devem ser questões', () => {
    expect(DESEJA_CANCELAR_ALTERACOES).toContain('?');
    expect(DESEJA_EXCLUIR_REGISTRO).toContain('?');
    expect(SUA_INSCRICAO_NAO_FOI_ENVIADA).toContain('?');
  });

  test('NOVA_INSCRICAO deve estar definida', () => {
    expect(NOVA_INSCRICAO).toBeDefined();
    expect(typeof NOVA_INSCRICAO).toBe('string');
  });
});
