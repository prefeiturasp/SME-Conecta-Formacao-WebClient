import { MenuItemSMEProps } from '~/components/lib/sider';
import { RolesDTO } from '~/core/dto/roles-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { MENU_CADASTRO } from './lista-menus/menu-cadastros';
import { MENU_FORMACOES } from './lista-menus/menu-formacoes';
import { MENU_MEUS_DADOS } from './lista-menus/menu-meus-dados';

export interface RolesMenu {
  podeConsultar: PermissaoEnum;
  podeIncluir: PermissaoEnum;
  podeAlterar: PermissaoEnum;
  podeExcluir: PermissaoEnum;
  customRoles?: RolesDTO['roles'];
}

export interface MenuItemConectaProps extends MenuItemSMEProps {
  key: MenuEnum;
  roles?: RolesMenu;
  children?: MenuItemConectaProps[];
}

export const menus: MenuItemConectaProps[] = [MENU_MEUS_DADOS, MENU_CADASTRO, MENU_FORMACOES];
