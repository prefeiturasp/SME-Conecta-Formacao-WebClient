import { createElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import PagNotFound from '~/pages/404';
import Home from '~/pages/home';
import Inicial from '~/pages/inicial';
import Login from '~/pages/login';
import MeusDados from '~/pages/meus-dados';
import AreaPromotora from '~/pages/cadastros/area-promotora';
import Principal from '~/pages/principal/index';
import RedefinirSenha from '~/pages/redefinir-senha';
import RedefinirSenhaToken from '~/pages/redefinir-senha-token';
import Auth from './config/auth';

const RoutesConfig = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const homePage = createElement(Home);
  const loginPage = createElement(Login);
  const pagNotFound = createElement(PagNotFound);
  const principalPage = createElement(Principal);
  const iniciallPage = createElement(Inicial);
  const meusDadosPage = createElement(MeusDados);
  const redefinirSenhaPage = createElement(RedefinirSenha);
  const redefinirSenhaTokenPage = createElement(RedefinirSenhaToken);
  const areaPromotora = createElement(AreaPromotora);

  return (
    <BrowserRouter>
      {autenticado ? (
        <>
          <Routes>
            <Route path={ROUTES.PRINCIPAL} element={principalPage}>
              <Route element={<Auth />}>
                <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
                <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />
                <Route path={ROUTES.AREA_PROMOTORA} element={areaPromotora} />
                <Route path='*' element={pagNotFound} />
                <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.PRINCIPAL} />} />
              </Route>
            </Route>
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path='*' element={<Navigate to={ROUTES.LOGIN} />} />
          <Route element={homePage}>
            <Route path={ROUTES.LOGIN} element={loginPage} />
            <Route path={ROUTES.REDEFINIR_SENHA} element={redefinirSenhaPage} />
            <Route path={ROUTES.REDEFINIR_SENHA_TOKEN} element={redefinirSenhaTokenPage} />
          </Route>
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default RoutesConfig;
