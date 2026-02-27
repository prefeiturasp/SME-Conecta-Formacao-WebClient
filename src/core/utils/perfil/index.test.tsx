import {
  verificaSomenteConsulta,
  verificaSeTemPermissao,
  obterPermissaoPorMenu,
  validarAutenticacao,
  obterPermissaoPorRolesMenu,
} from './index';
import { PermissaoMenusAcoesDTO } from '~/core/dto/permissao-menu-acoes-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';

// Mock React
jest.mock('react', () => ({
  createElement: jest.fn(),
}));

jest.mock('react-icons/fa', () => ({
  FaUserPlus: jest.fn(),
  FaUsers: jest.fn(),
  FaClipboardList: jest.fn(),
  FaFileAlt: jest.fn(),
}));

jest.mock('~/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));

jest.mock('jwt-decode', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('~/components/main/sider/menus', () => ({
  menus: [],
  RolesMenu: {},
}));

import { store } from '~/core/redux';
import { RolesMenu } from '~/components/main/sider/menus';

const mockStore = store as jest.Mocked<typeof store>;

describe('Perfil Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verificaSomenteConsulta', () => {
    test('deve retornar true quando só tem permissão de consulta', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: false,
        podeExcluir: false,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(true);
    });

    test('deve retornar false quando tem permissão de alterar', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: true,
        podeIncluir: false,
        podeExcluir: false,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });

    test('deve retornar false quando tem permissão de incluir', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: true,
        podeExcluir: false,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });

    test('deve retornar false quando tem permissão de excluir', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: false,
        podeExcluir: true,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });

    test('deve retornar false quando não tem permissão de consultar', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: false,
        podeAlterar: false,
        podeIncluir: false,
        podeExcluir: false,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });

    test('deve retornar false quando tem todas as permissões', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: true,
        podeIncluir: true,
        podeExcluir: true,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });

    test('deve retornar false quando tem permissão de consultar e incluir', () => {
      const permissao: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: false,
        podeIncluir: true,
        podeExcluir: false,
      };

      expect(verificaSomenteConsulta(permissao)).toBe(false);
    });
  });

  describe('verificaSeTemPermissao', () => {
    test('deve retornar true quando tem a permissão', () => {
      mockStore.getState.mockReturnValue({
        roles: {
          roles: [PermissaoEnum.AreaPromotora_A, PermissaoEnum.AreaPromotora_C],
        },
      } as any);

      expect(verificaSeTemPermissao(PermissaoEnum.AreaPromotora_A)).toBe(true);
    });

    test('deve retornar false quando não tem a permissão', () => {
      mockStore.getState.mockReturnValue({
        roles: {
          roles: [PermissaoEnum.AreaPromotora_C],
        },
      } as any);

      expect(verificaSeTemPermissao(PermissaoEnum.AreaPromotora_A)).toBe(false);
    });

    test('deve retornar false quando array de roles está vazio', () => {
      mockStore.getState.mockReturnValue({
        roles: {
          roles: [],
        },
      } as any);

      expect(verificaSeTemPermissao(PermissaoEnum.AreaPromotora_A)).toBe(false);
    });
  });

  describe('obterPermissaoPorMenu', () => {
    test('deve retornar permissão do menu quando existe', () => {
      const permissaoEsperada: PermissaoMenusAcoesDTO = {
        podeConsultar: true,
        podeAlterar: true,
        podeIncluir: false,
        podeExcluir: false,
      };

      mockStore.getState.mockReturnValue({
        roles: {
          permissaoPorMenu: {
            [MenuEnum.AreaPromotora]: {
              permissao: permissaoEsperada,
            },
          },
        },
      } as any);

      const resultado = obterPermissaoPorMenu(MenuEnum.AreaPromotora);
      expect(resultado).toEqual(permissaoEsperada);
    });

    test('deve retornar undefined quando menu não existe', () => {
      mockStore.getState.mockReturnValue({
        roles: {
          permissaoPorMenu: {},
        },
      } as any);

      const resultado = obterPermissaoPorMenu(MenuEnum.AreaPromotora);
      expect(resultado).toBeUndefined();
    });
  });

  describe('obterPermissaoPorRolesMenu', () => {
    test('deve retornar permissões corretas baseadas nas roles', () => {
      const rolesMenu: RolesMenu = {
        podeConsultar: PermissaoEnum.AreaPromotora_C,
        podeIncluir: PermissaoEnum.AreaPromotora_I,
        podeExcluir: PermissaoEnum.AreaPromotora_E,
        podeAlterar: PermissaoEnum.AreaPromotora_A,
      };

      mockStore.getState.mockReturnValue({
        roles: {
          roles: [PermissaoEnum.AreaPromotora_C, PermissaoEnum.AreaPromotora_I],
        },
      } as any);

      const resultado = obterPermissaoPorRolesMenu(rolesMenu);

      expect(resultado.podeConsultar).toBe(true);
      expect(resultado.podeIncluir).toBe(true);
      expect(resultado.podeExcluir).toBe(false);
      expect(resultado.podeAlterar).toBe(false);
      expect(resultado.customRoles).toBeUndefined();
    });

    test('deve incluir customRoles quando fornecido', () => {
      const customRoles = ['CUSTOM_ROLE_1', 'CUSTOM_ROLE_2'];
      const rolesMenu: RolesMenu = {
        podeConsultar: PermissaoEnum.AreaPromotora_C,
        podeIncluir: PermissaoEnum.AreaPromotora_I,
        podeExcluir: PermissaoEnum.AreaPromotora_E,
        podeAlterar: PermissaoEnum.AreaPromotora_A,
        customRoles: customRoles,
      };

      mockStore.getState.mockReturnValue({
        roles: {
          roles: [],
        },
      } as any);

      const resultado = obterPermissaoPorRolesMenu(rolesMenu);

      expect(resultado.customRoles).toEqual(customRoles);
    });

    test('deve retornar todas as permissões como false quando não tem nenhuma role', () => {
      const rolesMenu: RolesMenu = {
        podeConsultar: PermissaoEnum.AreaPromotora_C,
        podeIncluir: PermissaoEnum.AreaPromotora_I,
        podeExcluir: PermissaoEnum.AreaPromotora_E,
        podeAlterar: PermissaoEnum.AreaPromotora_A,
      };

      mockStore.getState.mockReturnValue({
        roles: {
          roles: [],
        },
      } as any);

      const resultado = obterPermissaoPorRolesMenu(rolesMenu);

      expect(resultado.podeConsultar).toBe(false);
      expect(resultado.podeIncluir).toBe(false);
      expect(resultado.podeExcluir).toBe(false);
      expect(resultado.podeAlterar).toBe(false);
    });

    test('deve retornar todas as permissões como true quando tem todas as roles', () => {
      const rolesMenu: RolesMenu = {
        podeConsultar: PermissaoEnum.AreaPromotora_C,
        podeIncluir: PermissaoEnum.AreaPromotora_I,
        podeExcluir: PermissaoEnum.AreaPromotora_E,
        podeAlterar: PermissaoEnum.AreaPromotora_A,
      };

      mockStore.getState.mockReturnValue({
        roles: {
          roles: [
            PermissaoEnum.AreaPromotora_C,
            PermissaoEnum.AreaPromotora_I,
            PermissaoEnum.AreaPromotora_E,
            PermissaoEnum.AreaPromotora_A,
          ],
        },
      } as any);

      const resultado = obterPermissaoPorRolesMenu(rolesMenu);

      expect(resultado.podeConsultar).toBe(true);
      expect(resultado.podeIncluir).toBe(true);
      expect(resultado.podeExcluir).toBe(true);
      expect(resultado.podeAlterar).toBe(true);
    });
  });

  describe('validarAutenticacao', () => {
    const jwt_decode = require('jwt-decode').default;

    beforeEach(() => {
      jwt_decode.mockClear();
    });

    test('deve decodificar o token e fazer dispatch das actions', () => {
      const mockData = {
        token: 'mock-token',
        perfilUsuario: [
          {
            perfil: '1',
            nomePerfil: 'Admin',
            areaPromotoraId: 1,
            nomeAreaPromotora: 'Área 1',
          },
        ],
        usuarioNome: 'Teste',
        usuarioLogin: 'teste',
        dataHoraExpiracao: '2025-12-31',
        email: 'teste@teste.com',
        autenticado: true,
      } as any;

      const mockDecoded = {
        perfil: '1',
        roles: [PermissaoEnum.AreaPromotora_C],
      };

      jwt_decode.mockReturnValue(mockDecoded);

      validarAutenticacao(mockData);

      expect(jwt_decode).toHaveBeenCalledWith('mock-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    test('deve lidar com array vazio de roles', () => {
      const mockData = {
        token: 'mock-token',
        perfilUsuario: [],
        usuarioNome: 'Teste',
        usuarioLogin: 'teste',
        dataHoraExpiracao: '2025-12-31',
        email: 'teste@teste.com',
        autenticado: true,
      } as any;

      const mockDecoded = {
        perfil: '1',
        roles: [],
      };

      jwt_decode.mockReturnValue(mockDecoded);

      validarAutenticacao(mockData);

      expect(jwt_decode).toHaveBeenCalledWith('mock-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    test('deve lidar quando não há roles no token', () => {
      const mockData = {
        token: 'mock-token',
        perfilUsuario: [],
        usuarioNome: 'Teste',
        usuarioLogin: 'teste',
        dataHoraExpiracao: '2025-12-31',
        email: 'teste@teste.com',
        autenticado: true,
      } as any;

      const mockDecoded = {
        perfil: '1',
      };

      jwt_decode.mockReturnValue(mockDecoded);

      validarAutenticacao(mockData);

      expect(jwt_decode).toHaveBeenCalledWith('mock-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });

    test('deve selecionar o perfil correspondente ao token', () => {
      const mockData = {
        token: 'mock-token',
        perfilUsuario: [
          {
            perfil: '1',
            nomePerfil: 'Admin',
            areaPromotoraId: 1,
            nomeAreaPromotora: 'Área 1',
          },
          {
            perfil: '2',
            nomePerfil: 'User',
            areaPromotoraId: 2,
            nomeAreaPromotora: 'Área 2',
          },
        ],
        usuarioNome: 'Teste',
        usuarioLogin: 'teste',
        dataHoraExpiracao: '2025-12-31',
        email: 'teste@teste.com',
        autenticado: true,
      } as any;

      const mockDecoded = {
        perfil: '2',
        roles: [],
      };

      jwt_decode.mockReturnValue(mockDecoded);

      validarAutenticacao(mockData);

      expect(jwt_decode).toHaveBeenCalledWith('mock-token');
      expect(mockStore.dispatch).toHaveBeenCalled();
    });
  });
});
