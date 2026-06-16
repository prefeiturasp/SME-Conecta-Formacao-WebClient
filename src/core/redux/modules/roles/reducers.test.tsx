import reducer from './reducers';
import {
  setPermissaoPorMenu,
  setRoles,
} from './actions';
import { RolesDTO } from '../../../../core/dto/roles-menu-dto';

const executeReducer = (
  state: RolesDTO | undefined,
  action: any,
): RolesDTO => reducer(state, action) as unknown as RolesDTO;

describe('Roles reducer', () => {
  const initialState: RolesDTO = {
    roles: [],
    permissaoPorMenu: [],
  };

  const rolesMock = [
    {
      codigo: 'ADMIN',
      descricao: 'Administrador',
    },
    {
      codigo: 'PROF',
      descricao: 'Professor',
    },
  ] as unknown as RolesDTO['roles'];

  const permissaoMock = [
    {
      menu: 'HOME',
      permissoes: ['CONSULTAR'],
    },
    {
      menu: 'CURSOS',
      permissoes: ['CONSULTAR', 'EDITAR'],
    },
  ] as unknown as RolesDTO['permissaoPorMenu'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o estado inicial quando o state for undefined', () => {
    const state = executeReducer(undefined, {
      type: '@@INIT',
    } as any);

    expect(state).toEqual(initialState);
  });

  it('deve atualizar roles', () => {
    const state = executeReducer(initialState, setRoles(rolesMock));

    expect(state.roles).toEqual(rolesMock);
    expect(state.permissaoPorMenu).toEqual([]);
  });

  it('deve criar uma nova referência para roles', () => {
    const state = executeReducer(initialState, setRoles(rolesMock));

    expect(state.roles).not.toBe(rolesMock);
    expect(state.roles).toEqual(rolesMock);
  });

  it('deve atualizar permissaoPorMenu', () => {
    const state = executeReducer(
      initialState,
      setPermissaoPorMenu(permissaoMock)
    );

    expect(state.roles).toEqual([]);
    expect(state.permissaoPorMenu).toEqual(permissaoMock);
  });

  it('deve criar uma nova referência para permissaoPorMenu', () => {
    const state = executeReducer(
      initialState,
      setPermissaoPorMenu(permissaoMock)
    );

    expect(state.permissaoPorMenu).not.toBe(permissaoMock);
    expect(state.permissaoPorMenu).toEqual(permissaoMock);
  });

  it('deve manter o estado para action desconhecida', () => {
    const stateAnterior: RolesDTO = {
      roles: rolesMock,
      permissaoPorMenu: permissaoMock,
    };

    const state = executeReducer(stateAnterior, {
      type: 'ACTION_DESCONHECIDA',
    } as any);

    expect(state).toEqual(stateAnterior);
  });
});