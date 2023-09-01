import { createElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import PagNotFound from '~/pages/404';
import FormCadastrosAreaPromotora from '~/pages/cadastros/area-promotora/form';
import ListAreaPromotora from '~/pages/cadastros/area-promotora/list';
import Home from '~/pages/home';
import Inicial from '~/pages/inicial';
import Login from '~/pages/login';
import MeusDados from '~/pages/meus-dados';
import Principal from '~/pages/principal/index';
import FormCadastroDePropostas from '~/pages/propostas/cadastros/form';
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

  return (
    <BrowserRouter>
      {autenticado ? (
        <>
          <Routes>
            <Route path={ROUTES.PRINCIPAL} element={principalPage}>
              <Route element={<Auth />}>
                <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
                <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />

                <Route path={ROUTES.AREA_PROMOTORA}>
                  <Route path='' element={<ListAreaPromotora />} />
                  <Route
                    path={ROUTES.AREA_PROMOTORA_NOVO}
                    element={<FormCadastrosAreaPromotora />}
                  />
                  <Route
                    path={ROUTES.AREA_PROMOTORA_EDITAR}
                    element={<FormCadastrosAreaPromotora />}
                  />
                </Route>

                <Route path={ROUTES.CADASTRO_DE_PROPOSTAS}>
                  <Route
                    path={ROUTES.CADASTRO_DE_PROPOSTAS_NOVO}
                    element={<FormCadastroDePropostas />}
                  />
                  <Route
                    path={ROUTES.CADASTRO_DE_PROPOSTAS_EDITAR}
                    element={<FormCadastroDePropostas />}
                  />
                </Route>

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
