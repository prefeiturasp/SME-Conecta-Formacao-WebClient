/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeaderPage from './index';

// Mock BreadcrumbCDEP to isolate the test to HeaderPage
jest.mock('~/components/main/breadcrumb', () => {
  return function DummyBreadcrumb() {
    return <div data-testid="mock-breadcrumb">Breadcrumb</div>;
  };
});

describe('HeaderPage', () => {
  it('deve renderizar o titulo corretamente', () => {
    render(
      <MemoryRouter>
        <HeaderPage title="Cadastro de Propostas" />
      </MemoryRouter>
    );
    expect(screen.getByText('Cadastro de Propostas')).toBeInTheDocument();
  });

  it('deve renderizar children opcionais', () => {
    render(
      <MemoryRouter>
        <HeaderPage title="Titulo">
          <button data-testid="child-button">Salvar</button>
        </HeaderPage>
      </MemoryRouter>
    );
    expect(screen.getByTestId('child-button')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve renderizar o breadcrumb', () => {
    render(
      <MemoryRouter>
        <HeaderPage title="Titulo" />
      </MemoryRouter>
    );
    expect(screen.getByTestId('mock-breadcrumb')).toBeInTheDocument();
  });
});
