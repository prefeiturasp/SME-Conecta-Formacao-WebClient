import { ROUTES } from '~/core/enum/routes-enum';
import { MenuItemConectaProps } from '..';
import { MenuEnum } from '~/core/enum/menu-enum';
import { BsFillMortarboardFill } from 'react-icons/bs';

export const MENU_MEUS_CERTIFICADOS: MenuItemConectaProps = {
  key: MenuEnum.Certificados,
  title: 'Meus Certificados',
  icon: <BsFillMortarboardFill size={24} />,
  children: [
    {
      key: MenuEnum.Certificados,
      title: 'Meus Certificados',
      url: ROUTES.CERTIFICADOS,
    },
  ],
};
