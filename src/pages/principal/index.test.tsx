/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Principal from './index';

jest.mock('react-router-dom', () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

jest.mock('~/components/lib/header', () => () => (
  <div data-testid="header" />
));

jest.mock('~/components/lib/footer', () => () => (
  <div data-testid="footer" />
));

jest.mock('~/components/main/sider', () => () => (
  <div data-testid="sider" />
));

const layoutMock = jest.fn();
const contentMock = jest.fn();

jest.mock('antd', () => {
  const Layout = ({ children, ...props }: any) => {
    layoutMock(props);

    return <div data-testid="layout">{children}</div>;
  };

  Layout.Content = ({ children, ...props }: any) => {
    contentMock(props);

    return <div data-testid="content">{children}</div>;
  };

  return { Layout };
});

describe('Principal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o layout', () => {
    render(<Principal />);

    expect(screen.getAllByTestId('layout')).toHaveLength(2);
  });

  it('deve renderizar o menu lateral', () => {
    render(<Principal />);

    expect(screen.getByTestId('sider')).toBeInTheDocument();
  });

  it('deve renderizar o header', () => {
    render(<Principal />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('deve renderizar o footer', () => {
    render(<Principal />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('deve renderizar o Outlet', () => {
    render(<Principal />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('deve configurar o layout principal', () => {
    render(<Principal />);

    expect(layoutMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        hasSider: true,
        style: {
          minHeight: '100vh',
        },
      })
    );
  });

  it('deve configurar o layout interno', () => {
    render(<Principal />);

    expect(layoutMock).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        style: {
          marginLeft: '88px',
        },
      })
    );
  });

  it('deve configurar o Content corretamente', () => {
    render(<Principal />);

    expect(contentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        style: {
          margin: '16px 32px',
        },
      })
    );
  });
});