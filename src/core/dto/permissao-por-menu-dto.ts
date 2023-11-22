import { MenuEnum } from '../enum/menu-enum';
import { PermissaoMenusAcoesDTO } from './permissao-menu-acoes-dto';

export type PermissaoPorMenuDTO = {
  key: MenuEnum;
  permissao: PermissaoMenusAcoesDTO;
  exibir: boolean;
};
