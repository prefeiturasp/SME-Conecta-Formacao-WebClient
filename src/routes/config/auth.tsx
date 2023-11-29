import { Navigate, Outlet, useLocation } from 'react-router-dom';

import React from 'react';
import AlertaSomenteConsulta from '~/components/main/alert/somente-consulta';
import { PermissaoPorMenuDTO } from '~/core/dto/permissao-por-menu-dto';
import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import PermissaoContextProvider from './permissao-provider';

type AuthPros = {
  menuKey: MenuEnum;
};
const Auth: React.FC<AuthPros> = ({ menuKey }) => {
  const location = useLocation();

  const autenticado = useAppSelector((state) => state.auth.autenticado);
  const permissaoPorMenu = useAppSelector((state) => state.roles.permissaoPorMenu);

  if (!autenticado) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  const menu: PermissaoPorMenuDTO = permissaoPorMenu[menuKey];

  const semPermissao = menu && !menu?.exibir;

  if (semPermissao)
    return <Navigate to={ROUTES.SEM_PERMISSAO} state={{ from: location }} replace />;

  return (
    <>
      <AlertaSomenteConsulta somenteConsulta={menu?.permissao?.somenteConsulta} />
      <PermissaoContextProvider menu={menu}>
        <Outlet />;
      </PermissaoContextProvider>
    </>
  );
};

export default Auth;
