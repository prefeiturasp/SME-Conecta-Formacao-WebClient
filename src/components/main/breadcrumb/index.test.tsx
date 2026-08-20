/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BreadcrumbConecta from './index';

// Mock the icons to verify their presence
jest.mock('@ant-design/icons', () => ({
  HomeOutlined: () => <span data-testid="home-icon" />,
}));

// Mock the menus to test the findTrail algorithm without depending on the real menus file
jest.mock('~/components/main/sider/menus', () => {
  return {
    menus: [
      {
        title: 'Menu Pai',
        url: '/pai',
        children: [
          {
            title: 'Menu Filho',
            url: '/pai/filho',
            children: [
              {
                title: 'Neto',
                url: '/pai/filho/neto',
              }
            ]
          }
        ]
      },
      {
        title: 'Simples',
        url: '/simples',
      }
    ]
  };
});

describe('BreadcrumbConecta', () => {
  it('deve renderizar breadcrumb com props explicitas ignorando a rota', () => {
    render(
      <MemoryRouter initialEntries={['/alguma-rota']}>
        <BreadcrumbConecta urlMainPage="/home" menu="MenuTeste" mainPage="MainTeste" title="TituloTeste" />
      </MemoryRouter>
    );
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('MenuTeste')).toBeInTheDocument();
    expect(screen.getByText('MainTeste')).toBeInTheDocument();
    expect(screen.getByText('TituloTeste')).toBeInTheDocument();
  });

  it('não deve renderizar Menu se props forem omitidas mas urlMainPage existir', () => {
    render(
      <MemoryRouter initialEntries={['/alguma-rota']}>
        <BreadcrumbConecta urlMainPage="/home" />
      </MemoryRouter>
    );
    expect(screen.queryByText('Menu')).not.toBeInTheDocument();
  });

  it('deve calcular o breadcrumb a partir da rota simples (1 nivel)', () => {
    render(
      <MemoryRouter initialEntries={['/simples']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Simples')).toBeInTheDocument();
  });

  it('deve calcular o breadcrumb a partir da rota aninhada (2 niveis)', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Menu Pai')).toBeInTheDocument();
    expect(screen.getByText('Menu Filho')).toBeInTheDocument();
  });

  it('deve calcular o breadcrumb a partir da rota aninhada (3 niveis)', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/neto']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Menu Pai')).toBeInTheDocument();
    expect(screen.getByText('Neto')).toBeInTheDocument();
  });

  it('deve identificar sufixos como editar, novo, etc.', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/editar/123']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Menu Pai')).toBeInTheDocument();
    expect(screen.getByText('Menu Filho')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('deve identificar sufixo novo', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/novo']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Novo')).toBeInTheDocument();
  });

  it('deve identificar sufixo visualizar', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/visualizar/123']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Visualizar')).toBeInTheDocument();
  });

  it('deve identificar sufixo arquivo', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/arquivo/123']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Arquivo')).toBeInTheDocument();
  });

  it('deve identificar sufixo detalhes', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho/detalhes/123']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    expect(screen.getByText('Detalhes')).toBeInTheDocument();
  });

  it('nao deve encontrar menu se a rota for apenas raiz', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <BreadcrumbConecta />
      </MemoryRouter>
    );
    // Deve exibir apenas inicio
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.queryByText('Menu Pai')).not.toBeInTheDocument();
  });

  it('deve aplicar title passado por prop mesmo ao usar route parsing', () => {
    render(
      <MemoryRouter initialEntries={['/pai/filho']}>
        <BreadcrumbConecta title="TituloSobrescrito" />
      </MemoryRouter>
    );
    expect(screen.getByText('Menu Pai')).toBeInTheDocument();
    expect(screen.getByText('TituloSobrescrito')).toBeInTheDocument();
  });
});