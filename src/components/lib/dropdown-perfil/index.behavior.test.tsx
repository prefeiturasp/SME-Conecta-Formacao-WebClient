/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DropdownPerfil from './index';
import { useAppSelector } from '~/core/hooks/use-redux';
import autenticacaoService from '~/core/services/autenticacao-service';
import { validarAutenticacao } from '~/core/utils/perfil';

const mockNavigate = jest.fn();
const mockUseLocation = jest.fn();

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => mockUseLocation(),
}));

jest.mock('~/core/services/autenticacao-service', () => ({
  __esModule: true,
  default: {
    alterarPerfilSelecionado: jest.fn(),
  },
}));

jest.mock('~/core/utils/perfil', () => ({
  validarAutenticacao: jest.fn(),
}));

jest.mock('@ant-design/icons', () => ({
  DownOutlined: () => <span>icon-down</span>,
  UpOutlined: () => <span>icon-up</span>,
}));

jest.mock('antd', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Dropdown: ({ children, menu, onOpenChange }: any) => (
    <div>
      <button type='button' onClick={() => onOpenChange(true)}>
        open-dropdown
      </button>
      <button type='button' onClick={() => onOpenChange(false)}>
        close-dropdown
      </button>
      {menu?.items?.map((item: any) => (
        <button key={item.key} type='button' onClick={() => menu.onClick({ key: item.key })}>
          item-{item.label}
        </button>
      ))}
      {children}
    </div>
  ),
}));

describe('DropdownPerfil behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLocation.mockReturnValue({ pathname: '/principal' });
    (autenticacaoService.alterarPerfilSelecionado as jest.Mock).mockResolvedValue({
      data: { token: 'token-novo' },
    });

    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        auth: {
          usuarioLogin: '1234567',
          usuarioNome: 'Usuário Teste',
          perfilUsuario: [
            { perfil: '1', perfilNome: 'Administrador' },
            { perfil: '2', perfilNome: 'Gestor' },
          ],
        },
        perfil: {
          perfilSelecionado: { perfil: '1', perfilNome: 'Administrador' },
        },
      }),
    );
  });

  test('deve exibir tipo de login RF para login com 7 dígitos', async () => {
    render(<DropdownPerfil />);

    expect(await screen.findByText('RF: 1234567')).toBeInTheDocument();
    expect(screen.getByText('Usuário Teste')).toBeInTheDocument();
  });

  test('deve exibir tipo de login CPF para login com 11 dígitos', async () => {
    (useAppSelector as jest.Mock).mockImplementation((selector: any) =>
      selector({
        auth: {
          usuarioLogin: '123.456.789-01',
          usuarioNome: 'Usuário Teste',
          perfilUsuario: [{ perfil: '1', perfilNome: 'Administrador' }],
        },
        perfil: {
          perfilSelecionado: { perfil: '1', perfilNome: 'Administrador' },
        },
      }),
    );

    render(<DropdownPerfil />);

    expect(await screen.findByText('CPF: 123.456.789-01')).toBeInTheDocument();
  });

  test('deve trocar ícone ao abrir dropdown', async () => {
    render(<DropdownPerfil />);

    expect(screen.getByText('icon-down')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'open-dropdown' }));
    expect(await screen.findByText('icon-up')).toBeInTheDocument();
  });

  test('deve alterar perfil e navegar para principal fora da área pública', async () => {
    render(<DropdownPerfil />);

    fireEvent.click(screen.getByRole('button', { name: 'item-Gestor' }));

    await waitFor(() => {
      expect(autenticacaoService.alterarPerfilSelecionado).toHaveBeenCalledWith('2');
      expect(validarAutenticacao).toHaveBeenCalledWith({ token: 'token-novo' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('deve navegar para área pública ao alterar perfil em rota pública', async () => {
    mockUseLocation.mockReturnValue({ pathname: '/area-publica/formacao' });

    render(<DropdownPerfil />);

    fireEvent.click(screen.getByRole('button', { name: 'item-Administrador' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/area-publica');
    });
  });
});
