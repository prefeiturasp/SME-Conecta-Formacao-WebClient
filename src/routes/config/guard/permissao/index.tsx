import { Navigate, Outlet, useLocation } from 'react-router-dom';

import React from 'react';
import AlertaSomenteConsulta from '~/components/main/alert/somente-consulta';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import PermissaoContextProvider from './provider';

type GuardPermissaoPros = {
  menuKey?: MenuEnum;
};
const GuardPermissao: React.FC<GuardPermissaoPros> = ({ menuKey }) => {
  const location = useLocation();

  const permissaoPorMenu = useAppSelector((state) => state.roles.permissaoPorMenu);

  const menu: PermissaoPorMenuDTO | undefined = menuKey ? permissaoPorMenu[menuKey] : undefined;

  const semPermissao = menu && !menu?.exibir;

  if (semPermissao)
    return <Navigate to={ROUTES.SEM_PERMISSAO} state={{ from: location }} replace />;

  return (
    <>
      {menu ? (
        <>
          <AlertaSomenteConsulta somenteConsulta={menu?.permissao?.somenteConsulta} />
          <PermissaoContextProvider menu={menu}>
            <Outlet />;
          </PermissaoContextProvider>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default GuardPermissao;
