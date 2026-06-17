/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { NotificacoesDetalhes } from './detalhes';

import notificacaoService from '../../../../core/services/notificacao-service';

const navigateMock = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

jest.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({
    id: '10',
  }),
}));

jest.mock('~/core/services/notificacao-service', () => ({
  __esModule: true,
  default: {
    obterNotificacoesDetalhe: jest.fn(),
  },
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('~/components/lib/header-page', () => (props: any) => (
  <div data-testid="header-page">
    <span>{props.title}</span>
    {props.children}
  </div>
));

jest.mock('~/components/lib/card-content', () => (props: any) => (
  <div data-testid="card-content">{props.children}</div>
));

jest.mock('~/components/main/button/voltar', () => (props: any) => (
  <button
    data-testid="btn-voltar"
    {...props}
  >
    voltar
  </button>
));

jest.mock('html-react-parser', () => {
  const fn = jest.fn((html: string) => (
    <div data-testid="mensagem">{html}</div>
  ));

  return {
    __esModule: true,
    default: fn,
    domToReact: jest.fn(),
    Element: class {},
  };
});

describe('NotificacoesDetalhes', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (
      notificacaoService.obterNotificacoesDetalhe as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: {
        id: 10,
        titulo: 'Título teste',
        mensagem: '<p>Mensagem teste</p>',
        categoria: 1,
        categoriaDescricao: 'Categoria',
        tipo: 2,
        tipoDescricao: 'Sistema',
        parametros: [],
      },
    });
  });

  it('deve renderizar a página', () => {
    render(<NotificacoesDetalhes />);

    expect(
      screen.getByTestId('header-page')
    ).toBeInTheDocument();

    expect(
      screen.getByTestId('card-content')
    ).toBeInTheDocument();
  });

  it('deve buscar os detalhes ao montar', async () => {
    render(<NotificacoesDetalhes />);

    await waitFor(() =>
      expect(
        notificacaoService.obterNotificacoesDetalhe
      ).toHaveBeenCalledWith(10)
    );
  });

  it('deve renderizar código', async () => {
    render(<NotificacoesDetalhes />);

    expect(
      await screen.findByText('10')
    ).toBeInTheDocument();
  });

  it('deve renderizar título', async () => {
    render(<NotificacoesDetalhes />);

    expect(
      await screen.findByText('Título teste')
    ).toBeInTheDocument();
  });

  it('deve renderizar tipo', async () => {
    render(<NotificacoesDetalhes />);

    expect(
      await screen.findByText('Sistema')
    ).toBeInTheDocument();
  });

  it('deve renderizar mensagem formatada', async () => {
    render(<NotificacoesDetalhes />);

    expect(
      await screen.findByTestId('mensagem')
    ).toBeInTheDocument();
  });

  it('não deve renderizar mensagem quando estiver vazia', async () => {
    (
      notificacaoService.obterNotificacoesDetalhe as jest.Mock
    ).mockResolvedValue({
      sucesso: true,
      dados: {
        id: 10,
        titulo: 'Título',
        mensagem: '',
        categoria: 1,
        categoriaDescricao: '',
        tipo: 1,
        tipoDescricao: 'Sistema',
        parametros: [],
      },
    });

    render(<NotificacoesDetalhes />);

    await waitFor(() =>
      expect(
        notificacaoService.obterNotificacoesDetalhe
      ).toHaveBeenCalled()
    );

    expect(
      screen.queryByTestId('mensagem')
    ).not.toBeInTheDocument();
  });

  it('não deve atualizar detalhes quando serviço retornar erro', async () => {
    (
      notificacaoService.obterNotificacoesDetalhe as jest.Mock
    ).mockResolvedValue({
      sucesso: false,
    });

    render(<NotificacoesDetalhes />);

    await waitFor(() =>
      expect(
        notificacaoService.obterNotificacoesDetalhe
      ).toHaveBeenCalled()
    );

    expect(
      screen.queryByText('Título teste')
    ).not.toBeInTheDocument();
  });

  it('deve renderizar botão voltar', () => {
    render(<NotificacoesDetalhes />);

    expect(
      screen.getByTestId('btn-voltar')
    ).toBeInTheDocument();
  });
});