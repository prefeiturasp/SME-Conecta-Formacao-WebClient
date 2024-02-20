import { FaUserPlus } from 'react-icons/fa';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { MenuItemConectaProps } from '..';

export const MENU_CADASTRO: MenuItemConectaProps = {
  key: MenuEnum.Cadastros,
  title: 'Cadastro',
  icon: <FaUserPlus size={24} />,
  children: [
    {
      key: MenuEnum.AreaPromotora,
      title: 'Área promotora',
      url: ROUTES.AREA_PROMOTORA,
      roles: {
        podeConsultar: PermissaoEnum.AreaPromotora_C,
        podeIncluir: PermissaoEnum.AreaPromotora_I,
        podeExcluir: PermissaoEnum.AreaPromotora_E,
        podeAlterar: PermissaoEnum.AreaPromotora_A,
      },
    },
    {
      key: MenuEnum.CadastroProposta,
      title: 'Cadastro de Propostas',
      url: ROUTES.CADASTRO_DE_PROPOSTAS,
      roles: {
        podeConsultar: PermissaoEnum.Proposta_C,
        podeIncluir: PermissaoEnum.Proposta_I,
        podeExcluir: PermissaoEnum.Proposta_E,
        podeAlterar: PermissaoEnum.Proposta_A,
      },
    },
  ],
};
