/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { MinhasInscricoes } from './index';
import { ROUTES } from '~/core/enum/routes-enum';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

let mockPerfil = 'Cursista';
jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: (selector: any) =>
    selector({
      perfil: {
        perfilSelecionado: {
          perfilNome: mockPerfil,
        },
      },
    }),
}));

jest.mock('~/components/lib/header-page', () => {
  return function MockHeaderPage({ title, children }: any) {
    return (
      <div data-testid='header-page'>
        <h1>{title}</h1>
        {children}
      </div>
    );
  };
});

jest.mock('~/components/lib/card-content', () => {
  return function MockCardContent({ children }: any) {
    return <div data-testid='card-content'>{children}</div>;
  };
});

jest.mock('~/components/lib/card-table/provider', () => {
  return function MockDataTableContextProvider({ children }: any) {
    return <div data-testid='data-table-provider'>{children}</div>;
  };
});

jest.mock('./listagem', () => ({
  MinhasInscricoesListaPaginada: () => (
    <div data-testid='lista-paginada-desktop'>Lista Desktop</div>
  ),
}));

jest.mock('./components/minhas-inscricoes-mobile', () => {
  return function MockMinhasInscricoesMobile({ ehCursista }: any) {
    return (
      <div data-testid='minhas-inscricoes-mobile-comp'>
        Mobile Comp - Cursista: {String(ehCursista)}
      </div>
    );
  };
});

describe('MinhasInscricoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerfil = 'Cursista';
  });

  describe('Renderização e Estrutura Responsiva', () => {
    it('deve renderizar os wrappers desktop e mobile', () => {
      render(<MinhasInscricoes />);

      expect(screen.getByTestId('minhas-inscricoes-desktop')).toBeInTheDocument();
      expect(screen.getByTestId('minhas-inscricoes-mobile-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('lista-paginada-desktop')).toBeInTheDocument();
      expect(screen.getByTestId('minhas-inscricoes-mobile-comp')).toBeInTheDocument();
    });

    it('deve ter título "Minhas Inscrições" no header desktop', () => {
      render(<MinhasInscricoes />);
      expect(screen.getByText('Minhas Inscrições')).toBeInTheDocument();
    });

    it('deve navegar para AREA_PUBLICA ao clicar em Explorar formações no desktop', () => {
      render(<MinhasInscricoes />);

      const btnExplorar = screen.getByText('Explorar formações');
      fireEvent.click(btnExplorar);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
    });
  });

  describe('Verificação de perfil de acesso', () => {
    it('não deve redirecionar quando perfil for Cursista', () => {
      mockPerfil = 'Cursista';
      render(<MinhasInscricoes />);

      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('deve redirecionar para PRINCIPAL quando perfil não for Cursista', () => {
      mockPerfil = 'Administrador';
      render(<MinhasInscricoes />);

      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
    });

    it('não deve navegar para AREA_PUBLICA ao clicar em nova inscrição se não for cursista', () => {
      mockPerfil = 'Administrador';
      render(<MinhasInscricoes />);

      mockNavigate.mockClear();

      const btnExplorar = screen.getByText('Explorar formações');
      fireEvent.click(btnExplorar);

      expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.AREA_PUBLICA);
    });
  });
});
