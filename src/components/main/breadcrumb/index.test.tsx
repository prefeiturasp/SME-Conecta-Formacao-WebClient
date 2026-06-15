/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import BreadcrumbCDEP from './index';

// Mock do ícone
jest.mock('@ant-design/icons', () => ({
  HomeOutlined: () => <span data-testid="home-icon" />,
}));

// Mock do Ant Design Breadcrumb
jest.mock('antd', () => ({
  Breadcrumb: ({ items }: any) => (
    <div data-testid="breadcrumb">
      {items.map((item: any, index: number) => (
        <div key={index} data-testid={`breadcrumb-item-${index}`}>
          <span data-testid={`title-${index}`}>
            {item.title}
          </span>
          <span data-testid={`href-${index}`}>
            {item.href}
          </span>
        </div>
      ))}
    </div>
  ),
}));

describe('BreadcrumbCDEP', () => {
  it('deve renderizar breadcrumb com valores padrão', () => {
    render(<BreadcrumbCDEP urlMainPage="/home" />);

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Nome da Página')).toBeInTheDocument();

    expect(screen.getByTestId('href-2')).toHaveTextContent('/home');
  });

  it('deve renderizar breadcrumb com props customizadas', () => {
    render(
      <BreadcrumbCDEP
        menu="Gestão"
        mainPage="Dashboard"
        urlMainPage="/dashboard"
        title="Relatório"
      />
    );

    expect(screen.getByTestId('title-1')).toHaveTextContent('Gestão');
    expect(screen.getByTestId('title-2')).toHaveTextContent('Dashboard');
    expect(screen.getByTestId('href-2')).toHaveTextContent('/dashboard');
    expect(screen.getByTestId('title-3')).toHaveTextContent('Relatório');
  });

  it('deve conter o ícone HomeOutlined', () => {
    render(<BreadcrumbCDEP urlMainPage="/home" />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('deve sempre renderizar o title mesmo sendo padrão', () => {
    render(<BreadcrumbCDEP urlMainPage="/home" />);

    expect(screen.getByTestId('title-3')).toHaveTextContent('Nome da Página');
  });

  it('deve renderizar title customizado quando informado', () => {
    render(<BreadcrumbCDEP urlMainPage="/home" title="Tela X" />);

    expect(screen.getByTestId('title-3')).toHaveTextContent('Tela X');
  });
});