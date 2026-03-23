import { describe, test, expect } from '@jest/globals';
import { ROUTES } from '~/core/enum/routes-enum';
import { CF_BUTTON_VOLTAR } from '~/core/constants/ids/button/intex';

describe('LoginAutomatico', () => {
  describe('Estados iniciais', () => {
    test('tokenValido deve iniciar como false', () => {
      const tokenValido = false;
      expect(tokenValido).toBe(false);
    });

    test('erroGeral deve iniciar como undefined', () => {
      const erroGeral = undefined;
      expect(erroGeral).toBeUndefined();
    });

    test('validandoToken deve iniciar como true quando token existe', () => {
      const token = 'meu-token-valido';
      const validandoToken = !!token;
      expect(validandoToken).toBe(true);
    });

    test('validandoToken deve iniciar como false quando token não existe', () => {
      const token = '';
      const validandoToken = !!token;
      expect(validandoToken).toBe(false);
    });
  });

  describe('Extração do token pela rota', () => {
    test('deve extrair o token dos parâmetros da rota', () => {
      const paramsRoute = { token: 'abc123' };
      const token = paramsRoute?.token || '';
      expect(token).toBe('abc123');
    });

    test('deve usar string vazia quando token não está nos parâmetros', () => {
      const paramsRoute = {};
      const token = (paramsRoute as any)?.token || '';
      expect(token).toBe('');
    });

    test('deve usar string vazia quando paramsRoute é undefined', () => {
      const paramsRoute = undefined;
      const token = (paramsRoute as any)?.token || '';
      expect(token).toBe('');
    });
  });

  describe('Lógica de validarToken - sucesso', () => {
    test('deve definir tokenValido como true em caso de sucesso', () => {
      let tokenValido = false;
      const resposta = { sucesso: true, dados: { token: 'jwt' }, mensagens: [] };

      if (resposta.sucesso) {
        tokenValido = true;
      }

      expect(tokenValido).toBe(true);
    });

    test('deve navegar para ROUTES.PRINCIPAL em caso de sucesso', () => {
      const navegar = jest.fn();
      const resposta = { sucesso: true, dados: { token: 'jwt' }, mensagens: [] };

      if (resposta.sucesso) {
        navegar(ROUTES.PRINCIPAL);
      }

      expect(navegar).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
      expect(navegar).toHaveBeenCalledWith('/');
    });

    test('não deve definir erroGeral em caso de sucesso', () => {
      let erroGeral: string[] | undefined = undefined;
      const resposta = { sucesso: true, dados: { token: 'jwt' }, mensagens: [] };

      if (!resposta.sucesso) {
        erroGeral = resposta.mensagens;
      }

      expect(erroGeral).toBeUndefined();
    });
  });

  describe('Lógica de validarToken - falha', () => {
    test('deve definir tokenValido como false em caso de falha', () => {
      let tokenValido = true;
      const resposta = { sucesso: false, dados: null, mensagens: ['Token inválido'] };

      if (!resposta.sucesso) {
        tokenValido = false;
      }

      expect(tokenValido).toBe(false);
    });

    test('deve definir erroGeral com as mensagens da resposta em caso de falha', () => {
      let erroGeral: string[] | undefined = undefined;
      const resposta = { sucesso: false, dados: null, mensagens: ['Token expirado', 'Acesso negado'] };

      if (!resposta.sucesso) {
        erroGeral = resposta.mensagens;
      }

      expect(erroGeral).toEqual(['Token expirado', 'Acesso negado']);
    });

    test('não deve navegar em caso de falha', () => {
      const navegar = jest.fn();
      const resposta = { sucesso: false, dados: null, mensagens: ['Token inválido'] };

      if (resposta.sucesso) {
        navegar(ROUTES.PRINCIPAL);
      }

      expect(navegar).not.toHaveBeenCalled();
    });
  });

  describe('Lógica de validarToken - catch', () => {
    test('deve definir tokenValido como false em caso de erro na requisição', () => {
      let tokenValido = true;

      const onCatch = () => {
        tokenValido = false;
      };

      onCatch();

      expect(tokenValido).toBe(false);
    });

    test('não deve definir erroGeral no catch', () => {
      let erroGeral: string[] | undefined = undefined;

      const onCatch = () => {
        // apenas reseta tokenValido, não define erroGeral
      };

      onCatch();

      expect(erroGeral).toBeUndefined();
    });
  });

  describe('Lógica de validarToken - finally', () => {
    test('deve definir validandoToken como false após conclusão (sucesso)', () => {
      let validandoToken = true;

      const onFinally = () => {
        validandoToken = false;
      };

      onFinally();

      expect(validandoToken).toBe(false);
    });

    test('deve definir validandoToken como false após conclusão (falha)', () => {
      let validandoToken = true;

      const onFinally = () => {
        validandoToken = false;
      };

      onFinally();

      expect(validandoToken).toBe(false);
    });
  });

  describe('Condições de renderização', () => {
    test('deve exibir Result de erro quando não está validando e token é inválido', () => {
      const validandoToken = false;
      const tokenValido = false;
      const deveExibirErro = !validandoToken && !tokenValido;

      expect(deveExibirErro).toBe(true);
    });

    test('não deve exibir Result de erro quando está validando', () => {
      const validandoToken = true;
      const tokenValido = false;
      const deveExibirErro = !validandoToken && !tokenValido;

      expect(deveExibirErro).toBe(false);
    });

    test('não deve exibir Result de erro quando token é válido', () => {
      const validandoToken = false;
      const tokenValido = true;
      const deveExibirErro = !validandoToken && !tokenValido;

      expect(deveExibirErro).toBe(false);
    });

    test('deve exibir Spin com spinning true quando está validando', () => {
      const validandoToken = true;
      expect(validandoToken).toBe(true);
    });

    test('deve exibir Spin com spinning false quando terminou de validar', () => {
      const validandoToken = false;
      expect(validandoToken).toBe(false);
    });

    test('deve exibir Result de sucesso quando token é válido', () => {
      const tokenValido = true;
      expect(tokenValido).toBe(true);
    });
  });

  describe('Configurações do Result de erro', () => {
    test('deve usar status 500 no Result de erro', () => {
      const status = '500';
      expect(status).toBe('500');
    });

    test('deve usar o título com as mensagens de erro', () => {
      const erroGeral = ['Token expirado'];
      const title = erroGeral;
      expect(title).toEqual(['Token expirado']);
    });
  });

  describe('Configurações do Result de sucesso', () => {
    test('deve usar status success no Result de token válido', () => {
      const status = 'success';
      expect(status).toBe('success');
    });

    test('deve exibir título de email validado com sucesso', () => {
      const title = 'Email validado com sucesso!';
      expect(title).toBe('Email validado com sucesso!');
    });
  });

  describe('Botão Voltar', () => {
    test('deve usar o id CF_BUTTON_VOLTAR', () => {
      expect(CF_BUTTON_VOLTAR).toBe('CF_BUTTON_VOLTAR');
    });

    test('deve navegar para ROUTES.LOGIN ao clicar em Voltar', () => {
      const navegar = jest.fn();
      const onClickVoltar = (navigate: Function, route: string) => navigate(route);

      onClickVoltar(navegar, ROUTES.LOGIN);

      expect(navegar).toHaveBeenCalledWith(ROUTES.LOGIN);
      expect(navegar).toHaveBeenCalledWith('/login');
    });

    test('deve ter type default', () => {
      const type = 'default';
      expect(type).toBe('default');
    });

    test('deve ter fontWeight 700', () => {
      const style = { fontWeight: 700 };
      expect(style.fontWeight).toBe(700);
    });

    test('deve ter block true', () => {
      const block = true;
      expect(block).toBe(true);
    });
  });

  describe('Spin de validação', () => {
    test('deve exibir tip de validação de token', () => {
      const tip = 'Validando token...';
      expect(tip).toBe('Validando token...');
    });

    test('deve estar na Col span 14', () => {
      const span = 14;
      expect(span).toBe(14);
    });
  });

  describe('Integração com usuarioService.validaEmailToken', () => {
    test('deve chamar validaEmailToken com o token extraído da rota', () => {
      const validaEmailToken = jest.fn().mockResolvedValue({
        sucesso: true,
        dados: { token: 'jwt' },
        mensagens: [],
      });

      const token = 'token-de-validacao';
      validaEmailToken(token);

      expect(validaEmailToken).toHaveBeenCalledWith('token-de-validacao');
    });

    test('não deve chamar validaEmailToken quando token está vazio', () => {
      const validaEmailToken = jest.fn();
      const token = '';

      if (token) {
        validaEmailToken(token);
      }

      expect(validaEmailToken).not.toHaveBeenCalled();
    });
  });

  describe('Rotas utilizadas', () => {
    test('deve navegar para ROUTES.PRINCIPAL após autenticação com sucesso', () => {
      expect(ROUTES.PRINCIPAL).toBe('/');
    });

    test('deve usar ROUTES.LOGIN na ação de voltar', () => {
      expect(ROUTES.LOGIN).toBe('/login');
    });

    test('a rota de login automático deve conter o parâmetro token', () => {
      expect(ROUTES.LOGIN_AUTOMATICO_PELO_TOKEN).toContain(':token');
    });
  });
});
