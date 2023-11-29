import { Navigate, Outlet, useLocation } from 'react-router-dom';

import React from 'react';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';

const GuardAutenticacao: React.FC = () => {
  const location = useLocation();

  const autenticado = useAppSelector((state) => state.auth.autenticado);

  if (!autenticado) return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;

  return <Outlet />;
};

export default GuardAutenticacao;
