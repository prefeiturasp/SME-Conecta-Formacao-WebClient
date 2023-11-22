import { MenuItemSMEProps } from '~/components/lib/sider';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { MENU_MEUS_DADOS } from './lista-menus/menu-meus-dados';
import { MenuEnum } from '~/core/enum/menu-enum';
import { MENU_CADASTRO } from './lista-menus/menu-cadastros';

interface RolesMenu {
  podeConsultar: PermissaoEnum;
  podeIncluir: PermissaoEnum;
  podeAlterar: PermissaoEnum;
  podeExcluir: PermissaoEnum;
}

export interface MenuItemConectaProps extends MenuItemSMEProps {
  key: MenuEnum;
  roles?: RolesMenu;
  children?: MenuItemConectaProps[];
}

export const menus: MenuItemConectaProps[] = [MENU_MEUS_DADOS, MENU_CADASTRO];
