import { BsFillMortarboardFill } from 'react-icons/bs';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { MenuItemConectaProps } from '..';

export const MENU_FORMACOES: MenuItemConectaProps = {
  key: MenuEnum.Formacoes,
  title: 'Formações',
  icon: <BsFillMortarboardFill size={24} />,
  children: [
    {
      key: MenuEnum.Inscricoes,
      title: 'Inscrições',
      url: ROUTES.FORMACAOES_INSCRICOES,
      roles: {
        podeConsultar: PermissaoEnum.Inscricoes_C,
        podeIncluir: PermissaoEnum.Inscricoes_I,
        podeExcluir: PermissaoEnum.Inscricoes_E,
        podeAlterar: PermissaoEnum.Inscricoes_A,
      },
    },
  ],
};
