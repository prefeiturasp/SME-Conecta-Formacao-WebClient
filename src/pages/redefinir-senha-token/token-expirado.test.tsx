/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TokenExpirado from './token-expirado';
import { onClickVoltar } from '../../core/utils/form';
import { ROUTES } from '../../core/enum/routes-enum';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

describe('TokenExpirado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <TokenExpirado />
      </MemoryRouter>
    );

  it('deve renderizar título da página', () => {
    renderComponent();

    expect(
      screen.getByText('Redefinição de Senha')
    ).toBeInTheDocument();
  });

  it('deve renderizar mensagem de link expirado', () => {
    renderComponent();

    expect(
      screen.getByText(
        /Este link expirou, utilize a opção/i
      )
    ).toBeInTheDocument();
  });

  it('deve renderizar botão voltar', () => {
    renderComponent();

    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });

  it('deve chamar onClickVoltar ao clicar no botão', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Voltar'));

    expect(onClickVoltar).toHaveBeenCalledWith({
      navigate: expect.any(Function),
      route: ROUTES.PRINCIPAL,
    });
  });
});