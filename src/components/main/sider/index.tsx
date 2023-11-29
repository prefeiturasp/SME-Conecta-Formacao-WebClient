import React, { useCallback, useEffect, useState } from 'react';

import ConectaLogo from '~/assets/conecta-formacao-logo.svg';

import { cloneDeep } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import SiderSME, { MenuItemSMEProps } from '../../lib/sider';
import { MenuItemConectaProps, menus } from './menus';

const SiderConectaFormacao: React.FC = () => {
  const navigate = useNavigate();

  const permissaoPorMenu = useAppSelector((state) => state.roles.permissaoPorMenu);

  const [items, setItems] = useState<MenuItemConectaProps[]>([]);
  const validarExibicaoMenus = useCallback(
    (menusParaValidar: MenuItemConectaProps[]): MenuItemConectaProps[] => {
      const newMapMenus = menusParaValidar.map((menu) => {
        if (menu?.children?.length) {
          const children = validarExibicaoMenus(menu.children).filter((subMenu) => {
            const permissaoMenu = permissaoPorMenu[subMenu?.key];
            return !!permissaoMenu?.exibir;
          });

          menu.children = children;
        }
        return menu;
      });

      return newMapMenus;
    },
    [permissaoPorMenu],
  );

  useEffect(() => {
    if (menus?.length && permissaoPorMenu?.length) {
      const menuCloned = cloneDeep(menus);
      const menusParaExibir = validarExibicaoMenus(menuCloned);
      const menusParaExibirComSubMenus = menusParaExibir.filter((menu) => menu?.children?.length);

      setItems(menusParaExibirComSubMenus);
    }
  }, [validarExibicaoMenus, permissaoPorMenu]);

  useEffect(() => {
    if (menus?.length && permissaoPorMenu?.length) {
      const menuCloned = cloneDeep(menus);
      const menusParaExibir = validarExibicaoMenus(menuCloned);
      const menusParaExibirComSubMenus = menusParaExibir.filter((menu) => menu?.children?.length);

      setItems(menusParaExibirComSubMenus);
    }
  }, [validarExibicaoMenus, permissaoPorMenu]);

  const itemMenuEscolhido = (item: MenuItemSMEProps) => {
    if (item?.url) {
      navigate(item.url);
    }
  };

  return (
    <SiderSME
      onClick={itemMenuEscolhido}
      onClickMenuButtonToggle={() => console.log('onClickMenuButtonToggle')}
      styleSider={{ zIndex: 12 }}
      items={items}
      logoMenu={
        <a href={ROUTES.PRINCIPAL}>
          <img style={{ height: '50px' }} src={ConectaLogo} alt='Conecta Formação LOGO' />
        </a>
      }
    />
  );
};

export default SiderConectaFormacao;
