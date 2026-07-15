/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import RoutesConfig from './index';
import { useAppSelector } from '../core/hooks/use-redux';
import { scrollNoInicio } from '../core/utils/functions';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/core/utils/functions', () => ({
  scrollNoInicio: jest.fn(),
}));

jest.mock('./config/guard/autenticacao', () => {
  const ReactRouterDom = require('react-router-dom');
  return {
    __esModule: true,
    default: () => <ReactRouterDom.Outlet />,
  };
});

jest.mock('./config/guard/permissao', () => {
  const ReactRouterDom = require('react-router-dom');
  return {
    __esModule: true,
    default: () => <ReactRouterDom.Outlet />,
  };
});

jest.mock('~/pages/home', () => {
  const ReactRouterDom = require('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div>
        home-layout
        <ReactRouterDom.Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/principal/index', () => {
  const ReactRouterDom = require('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div>
        principal-layout
        <ReactRouterDom.Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/area-publica', () => {
  const ReactRouterDom = require('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div>
        area-publica-layout
        <ReactRouterDom.Outlet />
      </div>
    ),
  };
});

jest.mock('~/pages/403', () => ({ __esModule: true, default: () => <div>page-403</div> }));
jest.mock('~/pages/404', () => ({ __esModule: true, default: () => <div>page-404</div> }));
jest.mock('~/pages/inicial', () => ({ __esModule: true, default: () => <div>page-inicial</div> }));
jest.mock('~/pages/login', () => ({ __esModule: true, default: () => <div>page-login</div> }));
jest.mock('~/pages/login-automatico', () => ({ __esModule: true, default: () => <div>page-login-auto</div> }));
jest.mock('~/pages/redefinir-senha', () => ({ __esModule: true, default: () => <div>page-redefinir</div> }));
jest.mock('~/pages/redefinir-senha-token', () => ({ __esModule: true, default: () => <div>page-redefinir-token</div> }));
jest.mock('~/pages/formacoes/lista-presenca-codaf', () => ({ __esModule: true, default: () => <div>page-lista-presenca</div> }));
jest.mock('~/pages/formacoes/lista-presenca-codaf/cadastro', () => ({ __esModule: true, default: () => <div>page-cadastro-lista</div> }));
jest.mock('~/pages/formacoes/codaf-suplementar', () => ({ __esModule: true, default: () => <div>page-codaf-suplementar</div> }));
jest.mock('~/pages/formacoes/codaf-suplementar/cadastro', () => ({ __esModule: true, default: () => <div>page-cadastro-codaf-suplementar</div> }));
jest.mock('~/pages/formacoes/lista-presenca-codaf/certificado/certificados-usuario', () => ({ __esModule: true, default: () => <div>page-meus-certificados</div> }));
jest.mock('~/pages/formacoes/certificados-pesquisa', () => ({ __esModule: true, default: () => <div>page-certificados-pesquisa</div> }));
jest.mock('~/pages/relatorios/inscritos-por-formacao', () => ({ __esModule: true, default: () => <div>page-relatorio</div> }));
jest.mock('~/pages/cadastros/coordenadoria', () => ({ __esModule: true, default: () => <div>page-coordenadoria</div> }));

jest.mock('~/pages/area-publica/formacao/list', () => ({ ListFormacao: () => <div>page-list-formacao</div> }));
jest.mock('~/pages/area-publica/formacao/view', () => ({ __esModule: true, default: () => <div>page-view-formacao</div> }));
jest.mock('~/pages/cadastros/area-promotora/form', () => ({ __esModule: true, default: () => <div>page-form-area-promotora</div> }));
jest.mock('~/pages/cadastros/area-promotora/list', () => ({ __esModule: true, default: () => <div>page-list-area-promotora</div> }));
jest.mock('~/pages/cadastros/novo-usuario', () => ({ CadastroDeUsuario: () => <div>page-cadastro-usuario</div> }));
jest.mock('~/pages/cadastros/propostas/form', () => ({ FormCadastroDePropostas: () => <div>page-form-proposta</div> }));
jest.mock('~/pages/cadastros/propostas/form/provider', () => ({ PropostaContextProvider: ({ children }: any) => <>{children}</> }));
jest.mock('~/pages/cadastros/propostas/list', () => ({ __esModule: true, default: () => <div>page-list-proposta</div> }));
jest.mock('~/pages/cadastros/usuario-rede-parceria', () => ({ UsuarioRedeParceria: () => <div>page-list-rede</div> }));
jest.mock('~/pages/cadastros/usuario-rede-parceria/form-usuario', () => ({ FormUsuarioRedeParceria: () => <div>page-form-rede</div> }));
jest.mock('~/pages/formacao-cursista/inscricao', () => ({ Inscricao: () => <div>page-inscricao-cursista</div> }));
jest.mock('~/pages/formacoes/inscricoes', () => ({ Inscricoes: () => <div>page-inscricoes</div> }));
jest.mock('~/pages/formacoes/turmas-inscricoes', () => ({ TurmasInscricoes: () => <div>page-turmas-inscricoes</div> }));
jest.mock('~/pages/formacoes/turmas-inscricoes/form', () => ({ FormCadastrosInscricoesManuais: () => <div>page-form-inscricao-manual</div> }));
jest.mock('~/pages/formacoes/turmas-inscricoes/listagem-arquivos', () => ({ InscricoesPorArquivoListagem: () => <div>page-listagem-arquivos</div> }));
jest.mock('~/pages/notificacoes', () => ({ Notificacoes: () => <div>page-notificacoes</div> }));
jest.mock('~/pages/notificacoes/components/detalhes/detalhes', () => ({ NotificacoesDetalhes: () => <div>page-notificacao-detalhe</div> }));
jest.mock('~/pages/meus-dados', () => ({ MeusDadosProvider: () => <div>page-meus-dados</div> }));

const mockUseAppSelector = useAppSelector as jest.Mock;

describe('RoutesConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  test('deve chamar scrollNoInicio quando rota renderiza', () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({ auth: { autenticado: false } }),
    );

    render(<RoutesConfig />);

    expect(scrollNoInicio).toHaveBeenCalled();
  });

  test('deve redirecionar para login quando não autenticado', async () => {
    window.history.pushState({}, '', '/rota-privada');
    mockUseAppSelector.mockImplementation((selector) =>
      selector({ auth: { autenticado: false } }),
    );

    render(<RoutesConfig />);

    expect(await screen.findByText('page-login')).toBeInTheDocument();
  });

  test('deve renderizar layout principal quando autenticado', async () => {
    window.history.pushState({}, '', '/');
    mockUseAppSelector.mockImplementation((selector) =>
      selector({ auth: { autenticado: true } }),
    );

    render(<RoutesConfig />);

    expect(await screen.findByText('principal-layout')).toBeInTheDocument();
  });

  test('deve renderizar área pública em rota pública mesmo autenticado', async () => {
    window.history.pushState({}, '', '/area-publica');
    mockUseAppSelector.mockImplementation((selector) =>
      selector({ auth: { autenticado: true } }),
    );

    render(<RoutesConfig />);

    expect(await screen.findByText('area-publica-layout')).toBeInTheDocument();
    expect(screen.getByText('page-list-formacao')).toBeInTheDocument();
  });
});
