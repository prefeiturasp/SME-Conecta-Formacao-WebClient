/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useAppSelector } from '../../core/hooks/use-redux';

import AreaPublica from './index';

jest.mock('antd', () => ({
  __esModule: true,
  Layout: Object.assign(
    ({ children }: any) => <div>{children}</div>,
    {
      Content: ({ children }: any) => <div>{children}</div>,
    },
  ),
}));

jest.mock('antd/es/layout/layout', () => ({
  __esModule: true,
  Footer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('../../core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));


jest.mock('~/components/lib/header', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="header">
      Header
    </div>
  ),
}));


jest.mock('~/components/main/sider', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="sider">
      Sider
    </div>
  ),
}));


jest.mock('react-router-dom', () => ({
  Outlet: () => (
    <div data-testid="outlet">
      Outlet
    </div>
  ),
}));


const useAppSelectorMock =
  useAppSelector as jest.Mock;



describe('AreaPublica', () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });



  it('deve renderizar layout completo quando usuário está autenticado', () => {

    useAppSelectorMock.mockImplementation(
      (callback) =>
        callback({
          auth: {
            autenticado: true,
          },
        }),
    );


    render(
      <AreaPublica />
    );


    expect(
      screen.getByTestId('header')
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('sider')
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('outlet')
    ).toBeInTheDocument();

  });



  it('deve renderizar layout público quando usuário não está autenticado', () => {


    useAppSelectorMock.mockImplementation(
      (callback) =>
        callback({
          auth: {
            autenticado: false,
          },
        }),
    );


    render(
      <AreaPublica />
    );


    expect(
      screen.getByTestId('header')
    ).toBeInTheDocument();


    expect(
      screen.getByTestId('outlet')
    ).toBeInTheDocument();


    expect(
      screen.queryByTestId('sider')
    ).not.toBeInTheDocument();

  });


});