import { PermissaoPorMenuDTO } from './permissao-por-menu-dto';

export interface RolesDTO {
  roles: string[];
  permissaoPorMenu: PermissaoPorMenuDTO[];
}
