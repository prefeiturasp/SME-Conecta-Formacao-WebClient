/* eslint-disable @typescript-eslint/no-empty-function */
import React, { PropsWithChildren, createContext, useState } from 'react';

type MenuContextProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  openKeys: string[];
  setOpenKeys: React.Dispatch<React.SetStateAction<string[]>>;
  selectedKeys: string[];
  setSelectedKeys: React.Dispatch<React.SetStateAction<string[]>>;
};

const DEFAULT_VALUES: MenuContextProps = {
  collapsed: true,
  setCollapsed: () => {},
  openKeys: [],
  setOpenKeys: () => [],
  selectedKeys: [],
  setSelectedKeys: () => [],
};

export const MenuContext = createContext<MenuContextProps>(DEFAULT_VALUES);

const MenuContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(DEFAULT_VALUES.collapsed);
  const [openKeys, setOpenKeys] = useState<string[]>(DEFAULT_VALUES.openKeys);
  const [selectedKeys, setSelectedKeys] = useState<string[]>(DEFAULT_VALUES.selectedKeys);

  return (
    <MenuContext.Provider
      value={{
        collapsed,
        setCollapsed,
        openKeys,
        setOpenKeys,
        selectedKeys,
        setSelectedKeys,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export default MenuContextProvider;
