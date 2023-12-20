import { createElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { MenuEnum } from '~/core/enum/menu-enum';
import { ROUTES } from '~/core/enum/routes-enum';
import { useAppSelector } from '~/core/hooks/use-redux';
import PageForbidden from '~/pages/403';
import PageNotFound from '~/pages/404';
import AreaPublica from '~/pages/area-publica';
import { ListFormacao } from '~/pages/area-publica/formacao/list';
import VisualizarFormacao from '~/pages/area-publica/formacao/view';
import { Inscricao } from '~/pages/area-publica/inscricao';
import FormCadastrosAreaPromotora from '~/pages/cadastros/area-promotora/form';
import ListAreaPromotora from '~/pages/cadastros/area-promotora/list';
import FormCadastroDePropostas from '~/pages/cadastros/propostas/form';
import ListCadastroDePropostas from '~/pages/cadastros/propostas/list';
import Home from '~/pages/home';
import Inicial from '~/pages/inicial';
import Login from '~/pages/login';
import MeusDados from '~/pages/meus-dados';
import Principal from '~/pages/principal/index';
import RedefinirSenha from '~/pages/redefinir-senha';
import RedefinirSenhaToken from '~/pages/redefinir-senha-token';
import GuardAutenticacao from './config/guard/autenticacao';
import GuardPermissao from './config/guard/permissao';

const RoutesConfig = () => {
  const autenticado = useAppSelector((state) => state.auth.autenticado);

  const homePage = createElement(Home);
  const loginPage = createElement(Login);
  const notFoundPage = createElement(PageNotFound);
  const principalPage = createElement(Principal);
  const forbiddenPage = createElement(PageForbidden);
  const iniciallPage = createElement(Inicial);
  const meusDadosPage = createElement(MeusDados);
  const redefinirSenhaPage = createElement(RedefinirSenha);
  const redefinirSenhaTokenPage = createElement(RedefinirSenhaToken);

  const areaPublicaPage = createElement(AreaPublica);
  const listFormacaoPage = createElement(ListFormacao);
  const visualizarAreaPublica = createElement(VisualizarFormacao);

  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.AREA_PUBLICA} element={areaPublicaPage}>
          <Route path={ROUTES.AREA_PUBLICA} element={listFormacaoPage} />
          <Route path={ROUTES.AREA_PUBLICA_VISUALIZAR_FORMACAO} element={visualizarAreaPublica} />
        </Route>
        {autenticado ? (
          <>
            <Route element={<GuardAutenticacao />}>
              <Route path={ROUTES.PRINCIPAL} element={principalPage}>
                <Route path='*' element={notFoundPage} />
                <Route path={ROUTES.SEM_PERMISSAO} element={forbiddenPage} />
                <Route path={ROUTES.PRINCIPAL} element={iniciallPage} />
                <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.PRINCIPAL} />} />
                <Route path={ROUTES.MEUS_DADOS} element={meusDadosPage} />
                <Route path={ROUTES.INSCRICAO} element={<Inscricao />} />

                <Route path={ROUTES.AREA_PROMOTORA}>
                  <Route element={<GuardPermissao menuKey={MenuEnum.AreaPromotora} />}>
                    <Route path='' element={<ListAreaPromotora />} />
                  </Route>
                  <Route element={<GuardPermissao menuKey={MenuEnum.AreaPromotora} />}>
                    <Route
                      path={ROUTES.AREA_PROMOTORA_NOVO}
                      element={<FormCadastrosAreaPromotora />}
                    />
                  </Route>
                  <Route element={<GuardPermissao menuKey={MenuEnum.AreaPromotora} />}>
                    <Route
                      path={ROUTES.AREA_PROMOTORA_EDITAR}
                      element={<FormCadastrosAreaPromotora />}
                    />
                  </Route>
                </Route>

                <Route path={ROUTES.CADASTRO_DE_PROPOSTAS}>
                  <Route element={<GuardPermissao menuKey={MenuEnum.CadastroProposta} />}>
                    <Route path='' element={<ListCadastroDePropostas />} />
                  </Route>
                  <Route element={<GuardPermissao menuKey={MenuEnum.CadastroProposta} />}>
                    <Route
                      path={ROUTES.CADASTRO_DE_PROPOSTAS_NOVO}
                      element={<FormCadastroDePropostas />}
                    />
                  </Route>
                  <Route element={<GuardPermissao menuKey={MenuEnum.CadastroProposta} />}>
                    <Route
                      path={ROUTES.CADASTRO_DE_PROPOSTAS_EDITAR}
                      element={<FormCadastroDePropostas />}
                    />
                  </Route>
                </Route>
              </Route>
            </Route>
          </>
        ) : (
          <>
            <Route path='*' element={<Navigate to={ROUTES.LOGIN} />} />
            <Route element={homePage}>
              <Route path={ROUTES.LOGIN} element={loginPage} />
              <Route path={ROUTES.REDEFINIR_SENHA} element={redefinirSenhaPage} />
              <Route path={ROUTES.REDEFINIR_SENHA_TOKEN} element={redefinirSenhaTokenPage} />
            </Route>
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesConfig;
