/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import Inicial from './index';
import { useAppSelector } from '../../core/hooks/use-redux';
import autenticacaoService from '../../core/services/autenticacao-service';
import { validarAutenticacao } from '../../core/utils/perfil';
import { ROUTES } from '../../core/enum/routes-enum';
import { TipoPerfilEnum, TipoPerfilTagDisplay } from '../../core/enum/tipo-perfil';

jest.mock('../../core/hooks/use-redux');

jest.mock('../../core/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    alterarPerfilSelecionado: jest.fn(),
  },
}));

jest.mock('../../core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

jest.mock('../formacao-cursista/minhas-inscricoes', () => ({
  MinhasInscricoes: () => <div data-testid="minhas-inscricoes" />,
}));

jest.mock('./components/filtro', () => ({
  FiltroPaginaInicial: () => <div data-testid="filtro-pagina-inicial" />,
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to }: any) => (
    <div data-testid="navigate">{to}</div>
  ),
}));

const mockedUseSelector = useAppSelector as jest.Mock;
const mockedAlterarPerfilSelecionado =
  autenticacaoService.alterarPerfilSelecionado as jest.Mock;

const mockedValidarAutenticacao =
  validarAutenticacao as jest.Mock;

describe('Inicial', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockedAlterarPerfilSelecionado.mockResolvedValue({
      data: {},
    });
  });

  function mockStore({
    inscricao = {
      formacao: {
        id: undefined,
      },
    },
    perfilUsuario = [],
    perfilSelecionado = '',
  }: any) {
    mockedUseSelector.mockImplementation((selector) =>
      selector({
        inscricao,
        perfil: {
          perfilUsuario,
          perfilSelecionado: {
            perfilNome: perfilSelecionado,
          },
        },
      }),
    );
  }

  it('deve renderizar filtro quando usuário não for cursista', () => {
    mockStore({
      perfilUsuario: [],
      perfilSelecionado: 'Administrador',
    });

    render(<Inicial />);

    expect(
      screen.getByTestId('filtro-pagina-inicial'),
    ).toBeInTheDocument();
  });

  it('deve renderizar MinhasInscricoes quando perfil selecionado for cursista', () => {
    mockStore({
      perfilUsuario: [
        {
          perfil: '1',
          perfilNome: TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
        },
      ],
      perfilSelecionado:
        TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
    });

    render(<Inicial />);

    expect(
      screen.getByTestId('minhas-inscricoes'),
    ).toBeInTheDocument();
  });

  it('deve navegar para inscrição quando existir formação e perfil cursista', async () => {
    mockStore({
      inscricao: {
        formacao: {
          id: 10,
        },
      },
      perfilUsuario: [
        {
          perfil: '99',
          perfilNome: TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
        },
      ],
      perfilSelecionado: 'Administrador',
    });

    render(<Inicial />);

    expect(screen.getByTestId('navigate')).toHaveTextContent(
      ROUTES.INSCRICAO,
    );

    await waitFor(() => {
      expect(
        mockedAlterarPerfilSelecionado,
      ).toHaveBeenCalledWith('99');
    });

    await waitFor(() => {
      expect(mockedValidarAutenticacao).toHaveBeenCalled();
    });
  });

  it('não deve chamar alterarPerfilSelecionado quando não existir formação', () => {
    mockStore({
      inscricao: {
        formacao: {
          id: undefined,
        },
      },
      perfilUsuario: [
        {
          perfil: '99',
          perfilNome: TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
        },
      ],
      perfilSelecionado:
        TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
    });

    render(<Inicial />);

    expect(
      mockedAlterarPerfilSelecionado,
    ).not.toHaveBeenCalled();
  });

  it('não deve chamar alterarPerfilSelecionado quando usuário não possuir perfil cursista', () => {
    mockStore({
      inscricao: {
        formacao: {
          id: undefined,
        },
      },
      perfilUsuario: [],
      perfilSelecionado: 'Administrador',
    });

    render(<Inicial />);

    expect(mockedAlterarPerfilSelecionado).not.toHaveBeenCalled();

    expect(screen.getByTestId('filtro-pagina-inicial')).toBeInTheDocument();
  });

  it('deve executar o useEffect alterando o estado quando trocar para cursista', () => {
    mockStore({
      perfilUsuario: [
        {
          perfil: '5',
          perfilNome: TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
        },
      ],
      perfilSelecionado:
        TipoPerfilTagDisplay[TipoPerfilEnum.Cursista],
    });

    render(<Inicial />);

    expect(
      screen.getByTestId('minhas-inscricoes'),
    ).toBeInTheDocument();
  });
});