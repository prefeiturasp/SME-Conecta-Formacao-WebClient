import { AiFillPrinter } from 'react-icons/ai';
import { MenuEnum } from '~/core/enum/menu-enum';
import { PermissaoEnum } from '~/core/enum/permissao-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { MenuItemConectaProps } from '..';

export const MENU_RELATORIOS: MenuItemConectaProps = {
  key: MenuEnum.Relatorios,
  title: 'Relatórios',
  icon: <AiFillPrinter size={24} />,
  children: [
    {
      key: MenuEnum.RelatorioInscritosPorFormacao,
      title: 'Inscritos por formação',
      url: ROUTES.RELATORIO_INSCRITOS_POR_FORMACAO,
      roles: {
        podeConsultar: PermissaoEnum.Inscricao_C,
        podeIncluir: PermissaoEnum.Inscricao_I,
        podeExcluir: PermissaoEnum.Inscricao_E,
        podeAlterar: PermissaoEnum.Inscricao_A,
      },
    },
  ],
};
