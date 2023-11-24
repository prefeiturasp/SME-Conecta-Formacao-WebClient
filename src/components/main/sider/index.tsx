import React, { useCallback, useEffect, useState } from 'react';

import LogoConecta from '~/assets/conecta-formacao-logo-titulo.svg';

import { useAppSelector } from '~/core/hooks/use-redux';
import SiderSME, { MenuItemSMEProps } from '../../lib/sider';
import { MenuItemConectaProps, menus } from './menus';
import { useNavigate } from 'react-router-dom';
import { cloneDeep } from 'lodash';

const SiderConectaFormacao: React.FC = () => {
  const navigate = useNavigate();

  const permissaoPorMenu = useAppSelector((state) => state.roles.permissaoPorMenu);

  const [items, setItems] = useState<MenuItemConectaProps[]>([]);

  const podeExibirMenu = useCallback(
    (menu: MenuItemConectaProps) => {
      const permissaoMenu = permissaoPorMenu.find((permissao) => {
        return permissao.key === menu.key;
      });

      return !!permissaoMenu?.exibir;
    },
    [permissaoPorMenu],
  );

  const validarExibicaoMenus = useCallback(
    (menusParaValidar: MenuItemConectaProps[]): MenuItemConectaProps[] => {
      const newMapMenus = menusParaValidar.map((menu) => {
        if (menu?.children?.length) {
          const children = validarExibicaoMenus(menu.children).filter((subMenu) => {
            return podeExibirMenu(subMenu);
          });

          menu.children = children;
        }
        return menu;
      });

      return newMapMenus;
    },
    [podeExibirMenu],
  );

  useEffect(() => {
    if (menus?.length && permissaoPorMenu?.length) {
      const menuCloned = cloneDeep(menus);
      const menusParaExibir = validarExibicaoMenus(menuCloned);
      const menusParaExibirComSubMenus = menusParaExibir.filter((menu) => menu?.children?.length);

      setItems(menusParaExibirComSubMenus);
    }
  }, [validarExibicaoMenus, podeExibirMenu, permissaoPorMenu]);

  const itemMenuEscolhido = (item: MenuItemSMEProps) => {
    if (item?.url) {
      navigate(item.url);
    }
  };

  // TODO - no SiderSME add ações para o  onClick onClickMenuButtonToggle e add a prop abaixo
  //   menuProps={{
  //   onOpenChange,
  //   openKeys,
  //   selectedKeys: navegacaoStore.menuSelecionado,
  // }}
  return (
    <SiderSME
      onClick={itemMenuEscolhido}
      onClickMenuButtonToggle={() => console.log('onClickMenuButtonToggle')}
      styleSider={{ zIndex: 12 }}
      items={items}
      logoMenu={LogoConecta}
    />
  );
};

export default SiderConectaFormacao;
