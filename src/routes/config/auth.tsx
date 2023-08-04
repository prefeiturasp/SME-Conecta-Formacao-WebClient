import { useLocation, Navigate, Outlet } from 'react-router-dom';

import React from 'react';
import { useAppSelector } from '~/core/hooks/use-redux';
import { ROUTES } from '~/core/enum/routes-enum';

const Auth: React.FC = () => {
  const location = useLocation();

  const autenticado = useAppSelector((state) => state.auth.autenticado);

  if (!autenticado) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  return <Outlet />;
};

export default Auth;
