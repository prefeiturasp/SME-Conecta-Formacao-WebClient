/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import VoltarAoTopoButton from './index';

describe('VoltarAoTopoButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('nao deve renderizar o botao quando scroll esta no topo', () => {
    render(<VoltarAoTopoButton limiteScroll={200} />);
    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();
  });

  it('deve renderizar o botao quando scroll ultrapassar o limite via window.scrollY', () => {
    render(<VoltarAoTopoButton limiteScroll={200} />);

    Object.defineProperty(window, 'scrollY', { value: 300 });
    fireEvent.scroll(window);

    const botao = screen.getByTestId('btn-voltar-ao-topo');
    expect(botao).toBeInTheDocument();
    expect(botao).toHaveAttribute('aria-label', 'Voltar ao topo');
    expect(botao).toHaveAttribute('title', 'Voltar ao topo');
  });

  it('deve renderizar o botao quando scroll ultrapassar o limite via document.documentElement.scrollTop', () => {
    render(<VoltarAoTopoButton limiteScroll={150} />);

    Object.defineProperty(window, 'scrollY', { value: 0 });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 250 });
    fireEvent.scroll(window);

    expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();
  });

  it('deve ocultar o botao novamente quando o usuario voltar ao topo', () => {
    render(<VoltarAoTopoButton limiteScroll={100} />);

    Object.defineProperty(window, 'scrollY', { value: 200 });
    fireEvent.scroll(window);
    expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 50 });
    fireEvent.scroll(window);
    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();
  });

  it('deve executar window.scrollTo ao clicar no botao', () => {
    const scrollToMock = jest.fn();
    window.scrollTo = scrollToMock;

    Object.defineProperty(window, 'scrollY', { value: 500 });
    render(<VoltarAoTopoButton limiteScroll={250} />);

    fireEvent.scroll(window);

    const botao = screen.getByTestId('btn-voltar-ao-topo');
    fireEvent.click(botao);

    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('deve remover o listener de scroll ao desmontar', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = render(<VoltarAoTopoButton limiteScroll={250} />);

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('deve lidar com fallback de scroll quando scrollY e scrollTop forem indefinidos', () => {
    Object.defineProperty(window, 'scrollY', { value: undefined });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: undefined });

    render(<VoltarAoTopoButton limiteScroll={200} />);
    fireEvent.scroll(window);

    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();
  });

  it('deve usar 0 como fallback quando scrollY for 0 e scrollTop for 0', () => {
    Object.defineProperty(window, 'scrollY', { value: 0 });
    Object.defineProperty(document.documentElement, 'scrollTop', { value: 0 });

    render(<VoltarAoTopoButton limiteScroll={200} />);
    fireEvent.scroll(window);

    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();
  });

  it('deve usar o limite padrao de 250 quando nenhuma prop for informada', () => {
    render(<VoltarAoTopoButton />);

    Object.defineProperty(window, 'scrollY', { value: 240 });
    fireEvent.scroll(window);
    expect(screen.queryByTestId('btn-voltar-ao-topo')).not.toBeInTheDocument();

    Object.defineProperty(window, 'scrollY', { value: 260 });
    fireEvent.scroll(window);
    expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();
  });

  it('deve renderizar o botao imediatamente quando sempreVisivel for true', () => {
    Object.defineProperty(window, 'scrollY', { value: 0 });
    render(<VoltarAoTopoButton sempreVisivel />);

    expect(screen.getByTestId('btn-voltar-ao-topo')).toBeInTheDocument();
  });
});
