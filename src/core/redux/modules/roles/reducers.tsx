import { produce } from 'immer';

import { RolesDTO } from '~/core/dto/roles-menu-dto';
import { SetPermissaoPorMenu, SetRoles, typeSetPermissaoPorMenu, typeSetRoles } from './actions';

const initialValues: RolesDTO = {
  roles: [],
  permissaoPorMenu: [],
};

const roles = (state = initialValues, action: SetRoles | SetPermissaoPorMenu) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case typeSetRoles:
        return { ...draft, roles: [...action.payload] };
      case typeSetPermissaoPorMenu:
        return { ...draft, permissaoPorMenu: [...action.payload] };
      default:
        return draft;
    }
  });
};

export default roles;
