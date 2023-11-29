import { RolesDTO } from '~/core/dto/roles-menu-dto';

export const typeSetRoles = '@roles/setRoles';
export const typeSetPermissaoPorMenu = '@roles/setPermissaoPorMenu';

export interface SetRoles {
  type: typeof typeSetRoles;
  payload: RolesDTO['roles'];
}

export interface SetPermissaoPorMenu {
  type: typeof typeSetPermissaoPorMenu;
  payload: RolesDTO['permissaoPorMenu'];
}

export const setRoles = (payload: RolesDTO['roles']): SetRoles => {
  return {
    type: typeSetRoles,
    payload,
  };
};

export const setPermissaoPorMenu = (payload: RolesDTO['permissaoPorMenu']): SetPermissaoPorMenu => {
  return {
    type: typeSetPermissaoPorMenu,
    payload,
  };
};
