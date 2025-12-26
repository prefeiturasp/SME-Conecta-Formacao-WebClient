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
        podeConsultar: PermissaoEnum.Inscricao_C,
        podeIncluir: PermissaoEnum.Inscricao_I,
        podeExcluir: PermissaoEnum.Inscricao_E,
        podeAlterar: PermissaoEnum.Inscricao_A,
      },
    },
    {
      key: MenuEnum.ListaPresencaCodaf,
      title: 'Lista de Presença CODAF',
      url: ROUTES.LISTA_PRESENCA_CODAF,
      roles: {
        podeConsultar: PermissaoEnum.Inscricao_C,
        podeIncluir: PermissaoEnum.Inscricao_I,
        podeExcluir: PermissaoEnum.Inscricao_E,
        podeAlterar: PermissaoEnum.Inscricao_A,
      },
    },
  ],
};
