/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GuardPermissao from './index';
import { useAppSelector } from '../../../../core/hooks/use-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { MenuEnum } from '../../../../core/enum/menu-enum';
import { ROUTES } from '../../../../core/enum/routes-enum';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  Navigate: jest.fn(() => null),
  Outlet: jest.fn(() => null),
}));

jest.mock('~/components/main/alert/somente-consulta', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('./provider', () => ({
  __esModule: true,
  default: ({ children }: any) => children,
}));

const mockUseAppSelector = useAppSelector as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

const MockNavigate = Navigate as unknown as jest.Mock;
const MockOutlet = Outlet as unknown as jest.Mock;

describe('GuardPermissao', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocation.mockReturnValue({
      pathname: '/rota-atual',
    });
  });

  it('deve renderizar Outlet quando não há menuKey', () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        roles: {
          permissaoPorMenu: {},
        },
      }),
    );

    render(<GuardPermissao />);

    expect(MockOutlet).toHaveBeenCalled();
    expect(MockNavigate).not.toHaveBeenCalled();
  });

  it('deve redirecionar quando semPermissao (exibir = false)', () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        roles: {
          permissaoPorMenu: {
            [MenuEnum.CadastroProposta]: {
              exibir: false,
              permissao: {},
            },
          },
        },
      }),
    );

    render(<GuardPermissao menuKey={MenuEnum.CadastroProposta} />);

    expect(MockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ROUTES.SEM_PERMISSAO,
        replace: true,
        state: expect.objectContaining({
          from: expect.any(Object),
        }),
      }),
      {},
    );
  });

  it('deve passar location no state ao redirecionar', () => {
    const locationMock = { pathname: '/pagina' };

    mockUseLocation.mockReturnValue(locationMock);

    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        roles: {
          permissaoPorMenu: {
            [MenuEnum.CadastroProposta]: {
              exibir: false,
              permissao: {},
            },
          },
        },
      }),
    );

    render(<GuardPermissao menuKey={MenuEnum.CadastroProposta} />);

    expect(MockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          from: locationMock,
        }),
      }),
      {},
    );
  });

  it('deve renderizar Outlet quando há permissão', () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        roles: {
          permissaoPorMenu: {
            [MenuEnum.CadastroProposta]: {
              exibir: true,
              permissao: {
                somenteConsulta: true,
              },
            },
          },
        },
      }),
    );

    render(<GuardPermissao menuKey={MenuEnum.CadastroProposta} />);

    expect(MockOutlet).toHaveBeenCalled();
    expect(MockNavigate).not.toHaveBeenCalled();
  });
});