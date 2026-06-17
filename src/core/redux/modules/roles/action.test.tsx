import {
  setRoles,
  setPermissaoPorMenu,
  typeSetRoles,
  typeSetPermissaoPorMenu,
} from './actions';
import { RolesDTO } from '../../../../core/dto/roles-menu-dto';

describe('Roles Actions', () => {
  describe('setRoles', () => {
    it('deve criar a action corretamente', () => {
      const payload = [
        {
          nome: 'ADMIN',
          permissoes: ['CRIAR', 'EDITAR'],
        },
      ] as unknown as RolesDTO['roles'];

      const result = setRoles(payload);

      expect(result).toEqual({
        type: typeSetRoles,
        payload,
      });
    });

    it('deve manter a referência do payload', () => {
      const payload = [] as unknown as RolesDTO['roles'];

      const result = setRoles(payload);

      expect(result.payload).toBe(payload);
    });

    it('deve retornar o type correto', () => {
      const payload = [] as unknown as RolesDTO['roles'];

      expect(setRoles(payload).type).toBe(typeSetRoles);
    });
  });

  describe('setPermissaoPorMenu', () => {
    it('deve criar a action corretamente', () => {
      const payload = {
        menu: ['CONSULTAR', 'SALVAR'],
      } as unknown as RolesDTO['permissaoPorMenu'];

      const result = setPermissaoPorMenu(payload);

      expect(result).toEqual({
        type: typeSetPermissaoPorMenu,
        payload,
      });
    });

    it('deve manter a referência do payload', () => {
      const payload = {} as RolesDTO['permissaoPorMenu'];

      const result = setPermissaoPorMenu(payload);

      expect(result.payload).toBe(payload);
    });

    it('deve retornar o type correto', () => {
      const payload = {} as RolesDTO['permissaoPorMenu'];

      expect(setPermissaoPorMenu(payload).type).toBe(
        typeSetPermissaoPorMenu
      );
    });
  });
});