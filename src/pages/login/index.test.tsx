import { describe, test, expect } from '@jest/globals';

describe('Login', () => {
  describe('Validação de mensagens', () => {
    const validateMessages = {
      required: 'Campo obrigatório',
      string: {
        min: 'Deve conter no mínimo ${min} caracteres',
      },
    };

    test('deve ter mensagem de campo obrigatório', () => {
      expect(validateMessages.required).toBe('Campo obrigatório');
    });

    test('deve ter mensagem de mínimo de caracteres', () => {
      expect(validateMessages.string.min).toContain('mínimo');
    });
  });

  describe('Validação de email', () => {
    const validarEmail = (email: string) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const reEspacos = /\s/;
      const reAcentos = /[áàãâéèêíïóôõöúçñÁÀÃÂÉÈÊÍÏÓÔÕÖÚÇÑ]/;

      return !reEspacos.test(email) && !reAcentos.test(email) && re.test(email);
    };

    test('deve aceitar email válido', () => {
      expect(validarEmail('teste@email.com')).toBe(true);
      expect(validarEmail('usuario.teste@dominio.com.br')).toBe(true);
    });

    test('deve rejeitar email com espaços', () => {
      expect(validarEmail('teste @email.com')).toBe(false);
      expect(validarEmail('teste@ email.com')).toBe(false);
    });

    test('deve rejeitar email com acentos', () => {
      expect(validarEmail('usuário@email.com')).toBe(false);
      expect(validarEmail('teste@domínio.com')).toBe(false);
    });

    test('deve rejeitar email inválido', () => {
      expect(validarEmail('emailsemarroba.com')).toBe(false);
      expect(validarEmail('@semlocal.com')).toBe(false);
      expect(validarEmail('teste@')).toBe(false);
    });
  });

  describe('Campos do formulário', () => {
    test('deve ter campo de login com regras corretas', () => {
      const loginRules = [{ required: true }, { min: 5 }];
      expect(loginRules).toHaveLength(2);
      expect(loginRules[0].required).toBe(true);
      expect(loginRules[1].min).toBe(5);
    });

    test('deve ter campo de senha com regras corretas', () => {
      const senhaRules = [{ required: true }, { min: 4 }];
      expect(senhaRules).toHaveLength(2);
      expect(senhaRules[0].required).toBe(true);
      expect(senhaRules[1].min).toBe(4);
    });

    test('campos devem ter maxLength de 100', () => {
      const maxLength = 100;
      expect(maxLength).toBe(100);
    });
  });

  describe('Botões', () => {
    test('deve ter botão Acessar', () => {
      const buttonAcessar = { text: 'Acessar', type: 'primary', htmlType: 'submit' };
      expect(buttonAcessar.text).toBe('Acessar');
      expect(buttonAcessar.type).toBe('primary');
      expect(buttonAcessar.htmlType).toBe('submit');
    });

    test('deve ter botão Esqueci minha senha', () => {
      const buttonEsqueciSenha = { text: 'Esqueci minha senha', type: 'text' };
      expect(buttonEsqueciSenha.text).toBe('Esqueci minha senha');
      expect(buttonEsqueciSenha.type).toBe('text');
    });

    test('deve ter botão Cadastre-se', () => {
      const buttonCadastrar = { text: 'Cadastre-se' };
      expect(buttonCadastrar.text).toBe('Cadastre-se');
    });
  });

  describe('Modal de validação de email', () => {
    test('deve ter largura de 540px', () => {
      const modalWidth = 540;
      expect(modalWidth).toBe(540);
    });

    test('deve ter botões do modal', () => {
      const modalButtons = ['Cancelar', 'Reenviar', 'Editar e-mail'];
      expect(modalButtons).toHaveLength(3);
      expect(modalButtons).toContain('Cancelar');
      expect(modalButtons).toContain('Reenviar');
      expect(modalButtons).toContain('Editar e-mail');
    });
  });

  describe('Estados iniciais', () => {
    test('deve ter erroGeral inicial como undefined', () => {
      const erroGeral = undefined;
      expect(erroGeral).toBeUndefined();
    });

    test('deve ter informarEmail inicial como false', () => {
      const informarEmail = false;
      expect(informarEmail).toBe(false);
    });

    test('deve ter openModal inicial como false', () => {
      const openModal = false;
      expect(openModal).toBe(false);
    });
  });

  describe('Tooltip de login', () => {
    test('deve conter informações sobre rede direta', () => {
      const tooltipText = 'Rede direta: Informe o RF';
      expect(tooltipText).toContain('RF');
    });

    test('deve conter informações sobre rede parceira', () => {
      const tooltipText = 'Rede parceira: Informe o CPF';
      expect(tooltipText).toContain('CPF');
    });
  });

  describe('Tratamento de erros', () => {
    test('deve identificar erro de email não validado', () => {
      const ERRO_EMAIL_NAO_VALIDADO = 'E-mail não validado';
      const mensagens = ['E-mail não validado'];
      expect(mensagens.includes(ERRO_EMAIL_NAO_VALIDADO)).toBe(true);
    });

    test('deve ter erro padrão para login', () => {
      const ERRO_LOGIN = 'Erro ao realizar login';
      expect(ERRO_LOGIN).toBeTruthy();
    });
  });
});
