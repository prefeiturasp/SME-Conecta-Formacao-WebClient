/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import GuardAutenticacao from './index';
import { useAppSelector } from '../../../../core/hooks/use-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { ROUTES } from '../../../../core/enum/routes-enum';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  Navigate: jest.fn(() => null),
  Outlet: jest.fn(() => null),
}));

describe('GuardAutenticacao', () => {
  const mockUseAppSelector = useAppSelector as jest.Mock;
  const mockUseLocation = useLocation as jest.Mock;
  const MockNavigate = Navigate as unknown as jest.Mock;
  const MockOutlet = Outlet as unknown as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseLocation.mockReturnValue({
      pathname: '/rota-protegida',
    });
  });

  it('deve redirecionar para login quando não autenticado', () => {
    mockUseAppSelector.mockImplementation((cb) =>
      cb({ auth: { autenticado: false } }),
    );

    render(<GuardAutenticacao />);

    expect(MockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: ROUTES.LOGIN,
        replace: true,
        state: expect.objectContaining({
          from: expect.any(Object),
        }),
      }),
      {},
    );
  });

  it('deve passar location no state.from ao redirecionar', () => {
    const locationMock = { pathname: '/minha-rota' };

    mockUseLocation.mockReturnValue(locationMock);

    mockUseAppSelector.mockImplementation((cb) =>
      cb({ auth: { autenticado: false } }),
    );

    render(<GuardAutenticacao />);

    expect(MockNavigate).toHaveBeenCalledWith(
      expect.objectContaining({
        state: expect.objectContaining({
          from: locationMock,
        }),
      }),
      {},
    );
  });

  it('deve renderizar Outlet quando usuário estiver autenticado', () => {
    mockUseAppSelector.mockImplementation((cb) =>
      cb({ auth: { autenticado: true } }),
    );

    render(<GuardAutenticacao />);

    expect(MockOutlet).toHaveBeenCalled();
    expect(MockNavigate).not.toHaveBeenCalled();
  });
});