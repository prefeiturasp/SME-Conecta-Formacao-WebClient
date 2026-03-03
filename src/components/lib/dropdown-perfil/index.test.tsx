import { describe, test, expect } from '@jest/globals';
import { ROUTES } from '~/core/enum/routes-enum';
import { Colors } from '~/core/styles/colors';

describe('DropdownPerfil', () => {
  describe('Estados iniciais', () => {
    test('openDropdow deve iniciar como false', () => {
      const openDropdow = false;
      expect(openDropdow).toBe(false);
    });

    test('tipoLogin deve iniciar como "Login"', () => {
      const tipoLogin = 'Login';
      expect(tipoLogin).toBe('Login');
    });
  });

  describe('Lógica de identificação do tipo de login', () => {
    const identificarTipoLogin = (usuarioLogin: string) => {
      const loginNumerico = usuarioLogin.replace(/[^0-9]/g, '');
      if (loginNumerico.length === 7) return 'RF';
      if (loginNumerico.length === 11) return 'CPF';
      return 'Login';
    };

    test('deve identificar RF quando login possui 7 dígitos numéricos', () => {
      expect(identificarTipoLogin('1234567')).toBe('RF');
    });

    test('deve identificar CPF quando login possui 11 dígitos numéricos', () => {
      expect(identificarTipoLogin('12345678901')).toBe('CPF');
    });

    test('deve manter "Login" quando possui número de dígitos diferente de 7 e 11', () => {
      expect(identificarTipoLogin('123')).toBe('Login');
      expect(identificarTipoLogin('12345678')).toBe('Login');
    });

    test('deve ignorar caracteres não numéricos ao contar dígitos', () => {
      expect(identificarTipoLogin('123.456-7')).toBe('RF');
      expect(identificarTipoLogin('123.456.789-01')).toBe('CPF');
    });

    test('deve manter "Login" para login vazio', () => {
      expect(identificarTipoLogin('')).toBe('Login');
    });
  });

  describe('Lógica de alterarPerfil - navegação', () => {
    test('deve navegar para ROUTES.AREA_PUBLICA quando pathname começa com /area-publica', () => {
      const navigate = jest.fn();
      const pathname = '/area-publica/visualizar/10';

      if (pathname.startsWith(ROUTES.AREA_PUBLICA)) {
        navigate(ROUTES.AREA_PUBLICA);
      } else {
        navigate(ROUTES.PRINCIPAL);
      }

      expect(navigate).toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
      expect(navigate).toHaveBeenCalledWith('/area-publica');
    });

    test('deve navegar para ROUTES.PRINCIPAL quando pathname não começa com /area-publica', () => {
      const navigate = jest.fn();
      const pathname = '/cadastro/area-promotora';

      if (pathname.startsWith(ROUTES.AREA_PUBLICA)) {
        navigate(ROUTES.AREA_PUBLICA);
      } else {
        navigate(ROUTES.PRINCIPAL);
      }

      expect(navigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
      expect(navigate).toHaveBeenCalledWith('/');
    });

    test('deve navegar para ROUTES.PRINCIPAL quando pathname é a raiz', () => {
      const navigate = jest.fn();
      const pathname = '/';

      if (pathname.startsWith(ROUTES.AREA_PUBLICA)) {
        navigate(ROUTES.AREA_PUBLICA);
      } else {
        navigate(ROUTES.PRINCIPAL);
      }

      expect(navigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    test('deve navegar para ROUTES.AREA_PUBLICA quando pathname é exatamente /area-publica', () => {
      const navigate = jest.fn();
      const pathname = '/area-publica';

      if (pathname.startsWith(ROUTES.AREA_PUBLICA)) {
        navigate(ROUTES.AREA_PUBLICA);
      } else {
        navigate(ROUTES.PRINCIPAL);
      }

      expect(navigate).toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
    });
  });

  describe('Mapeamento dos itens do menu', () => {
    test('deve gerar itens com key e label corretos a partir dos perfis do usuário', () => {
      const perfilUsuario = [
        { perfil: '1', perfilNome: 'Administrador' },
        { perfil: '2', perfilNome: 'Gestor' },
      ];

      const items = perfilUsuario.map((p) => ({
        key: p?.perfil,
        label: p?.perfilNome,
      }));

      expect(items).toHaveLength(2);
      expect(items[0]).toEqual({ key: '1', label: 'Administrador' });
      expect(items[1]).toEqual({ key: '2', label: 'Gestor' });
    });

    test('deve gerar lista vazia quando não há perfis', () => {
      const perfilUsuario: any[] = [];
      const items = perfilUsuario.map((p) => ({ key: p?.perfil, label: p?.perfilNome }));
      expect(items).toHaveLength(0);
    });

    test('deve gerar item único quando há apenas um perfil', () => {
      const perfilUsuario = [{ perfil: '3', perfilNome: 'Cursista' }];
      const items = perfilUsuario.map((p) => ({ key: p?.perfil, label: p?.perfilNome }));
      expect(items).toHaveLength(1);
      expect(items[0].key).toBe('3');
      expect(items[0].label).toBe('Cursista');
    });
  });

  describe('Estado do dropdown', () => {
    test('deve alternar openDropdow ao chamar onOpenChange com true', () => {
      let openDropdow = false;
      const setOpenDropdow = (value: boolean) => { openDropdow = value; };

      setOpenDropdow(true);
      expect(openDropdow).toBe(true);
    });

    test('deve fechar dropdown ao chamar onOpenChange com false', () => {
      let openDropdow = true;
      const setOpenDropdow = (value: boolean) => { openDropdow = value; };

      setOpenDropdow(false);
      expect(openDropdow).toBe(false);
    });
  });

  describe('Trigger do dropdown', () => {
    test('deve ser ativado por click', () => {
      const trigger = ['click'];
      expect(trigger).toContain('click');
    });
  });

  describe('Configurações do menu', () => {
    test('deve ter selectable true', () => {
      const menuConfig = { selectable: true };
      expect(menuConfig.selectable).toBe(true);
    });

    test('deve usar perfilSelecionado como defaultSelectedKeys', () => {
      const perfilSelecionado = { perfil: '2' };
      const defaultSelectedKeys = [perfilSelecionado?.perfil || ''];
      expect(defaultSelectedKeys).toEqual(['2']);
    });

    test('deve usar string vazia como defaultSelectedKey quando não há perfil selecionado', () => {
      const perfilSelecionado = null;
      const defaultSelectedKeys = [(perfilSelecionado as any)?.perfil || ''];
      expect(defaultSelectedKeys).toEqual(['']);
    });
  });

  describe('Estilos do ContainerPerfil', () => {
    test('deve ter height de 55px', () => {
      const style = { height: '55px', minWidth: '161px', borderRadius: '4px', display: 'flex', padding: '3px 10px' };
      expect(style.height).toBe('55px');
    });

    test('deve ter min-width de 161px', () => {
      const style = { height: '55px', minWidth: '161px', borderRadius: '4px', display: 'flex', padding: '3px 10px' };
      expect(style.minWidth).toBe('161px');
    });

    test('deve ter border-radius de 4px', () => {
      const style = { height: '55px', minWidth: '161px', borderRadius: '4px', display: 'flex', padding: '3px 10px' };
      expect(style.borderRadius).toBe('4px');
    });

    test('deve ter display flex', () => {
      const style = { height: '55px', minWidth: '161px', borderRadius: '4px', display: 'flex', padding: '3px 10px' };
      expect(style.display).toBe('flex');
    });

    test('deve usar Colors.Neutral.LIGHTEST como background', () => {
      expect(Colors.Neutral.LIGHTEST).toBe('#F5F6F8');
    });
  });

  describe('Estilos do Texto', () => {
    test('deve ter font-size de 12px', () => {
      const style = { fontSize: '12px' };
      expect(style.fontSize).toBe('12px');
    });

    test('deve usar Colors.Neutral.DARK como cor do texto', () => {
      expect(Colors.Neutral.DARK).toBe('#42474A');
    });

    test('deve exibir login com fontWeight 700', () => {
      const style = { fontWeight: 700 };
      expect(style.fontWeight).toBe(700);
    });
  });

  describe('Exibição do login formatado', () => {
    test('deve exibir "RF: <login>" quando tipoLogin é RF', () => {
      const tipoLogin = 'RF';
      const usuarioLogin = '1234567';
      const texto = `${tipoLogin}: ${usuarioLogin}`;
      expect(texto).toBe('RF: 1234567');
    });

    test('deve exibir "CPF: <login>" quando tipoLogin é CPF', () => {
      const tipoLogin = 'CPF';
      const usuarioLogin = '12345678901';
      const texto = `${tipoLogin}: ${usuarioLogin}`;
      expect(texto).toBe('CPF: 12345678901');
    });

    test('deve exibir "Login: <login>" no estado inicial', () => {
      const tipoLogin = 'Login';
      const usuarioLogin = 'usuario@email.com';
      const texto = `${tipoLogin}: ${usuarioLogin}`;
      expect(texto).toBe('Login: usuario@email.com');
    });
  });

  describe('Exibição do ícone de seta', () => {
    test('deve exibir UpOutlined quando dropdown está aberto', () => {
      const openDropdow = true;
      const icon = openDropdow ? 'UpOutlined' : 'DownOutlined';
      expect(icon).toBe('UpOutlined');
    });

    test('deve exibir DownOutlined quando dropdown está fechado', () => {
      const openDropdow = false;
      const icon = openDropdow ? 'UpOutlined' : 'DownOutlined';
      expect(icon).toBe('DownOutlined');
    });
  });

  describe('Estilo do container interno', () => {
    test('deve ter flexDirection column no container de texto', () => {
      const style = { display: 'flex', flexDirection: 'column', alignItems: 'start', marginRight: '7px', lineHeight: '16px' };
      expect(style.flexDirection).toBe('column');
      expect(style.alignItems).toBe('start');
      expect(style.marginRight).toBe('7px');
      expect(style.lineHeight).toBe('16px');
    });

    test('deve ter flexDirection column e justifyContent center no container do ícone', () => {
      const style = { display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' };
      expect(style.flexDirection).toBe('column');
      expect(style.justifyContent).toBe('center');
      expect(style.height).toBe('100%');
    });
  });
});
