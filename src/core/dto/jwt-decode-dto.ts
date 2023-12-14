import { RolesDTO } from './roles-menu-dto';

export type JWTDecodeDTO = {
  perfil: string;
  roles: RolesDTO['roles'];
  dres: string[];
};
