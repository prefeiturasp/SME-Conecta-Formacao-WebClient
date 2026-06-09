/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './';

import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '~/core/hooks/use-redux';

import autenticacaoService from '~/core/services/autenticacao-service';
import usuarioService from '~/core/services/usuario-service';

import { notification } from '~/components/lib/notification';
import { ERRO_EMAIL_NAO_VALIDADO } from '~/core/constants/mensagens';

(window as any).React = React;

jest.mock('antd/es/form/Form', () => {
  const antd = jest.requireActual('antd');
  return {
    __esModule: true,
    default: antd.Form,
    useForm: antd.Form.useForm,
    useWatch: antd.Form.useWatch,
  };
});

jest.mock('antd/es/input/Search', () => {
  const antd = jest.requireActual('antd');
  return {
    __esModule: true,
    default: antd.Input.Search,
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
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

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.mock('~/core/services/autenticacao-service', () => ({
  autenticar: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  alterarEmailDeValidacao: jest.fn(),
  reenviarEmail: jest.fn(),
}));

jest.mock('~/components/main/erro-geral-login', () => (props: any) => (
  <div>Erro: {props.erros?.join(',')}</div>
));

jest.mock('~/core/styles/colors', () => ({
  Colors: {
    Neutral: { DARK: '#000' },
    SystemSME: { ConectaFormacao: { PRIMARY: '#003d92' } },
  },
}));

const renderComponent = () => render(<Login />);

describe('Login', () => {
  const navigateMock = jest.fn();
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
  });

  it('renders form fields and buttons', () => {
    renderComponent();

    expect(screen.getByPlaceholderText('Informe o usuário')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe a senha')).toBeInTheDocument();
    expect(screen.getByText('Acessar')).toBeInTheDocument();
    expect(screen.getByText('Cadastre-se')).toBeInTheDocument();
  });

  it('shows validation error when submitting empty form', async () => {
    renderComponent();

    fireEvent.click(screen.getByText('Acessar'));

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });

  it('calls autenticar on valid submit', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: true },
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    await waitFor(() => {
      expect(autenticacaoService.autenticar).toHaveBeenCalled();
    });
  });

  it('handles authentication error and shows message', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: false },
      mensagens: ['Erro de login'],
      status: 401,
      sucesso: false,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    await waitFor(() => {
      expect(screen.getByText(/Erro:/)).toBeInTheDocument();
    });
  });

  it('opens modal when email is not validated', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: false },
      mensagens: [ERRO_EMAIL_NAO_VALIDADO],
      status: 401,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    expect(await screen.findByText('Atenção')).toBeInTheDocument();
  });

  it('calls reenviarEmail from modal', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: false },
      mensagens: [ERRO_EMAIL_NAO_VALIDADO],
      status: 401,
    });

    (usuarioService.reenviarEmail as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    const btn = await screen.findByText('Reenviar');
    fireEvent.click(btn);

    await waitFor(() => {
      expect(usuarioService.reenviarEmail).toHaveBeenCalled();
      expect(notification.success).toHaveBeenCalled();
    });
  });

  it('validates email before calling alterarEmail', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: false },
      mensagens: [ERRO_EMAIL_NAO_VALIDADO],
      status: 401,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    const editBtn = await screen.findByText('Editar e-mail');
    fireEvent.click(editBtn);

    const input = await screen.findByPlaceholderText('Informe o e-mail');

    fireEvent.change(input, { target: { value: 'invalid-email' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(notification.warning).toHaveBeenCalled();
    });
  });

  it('calls alterarEmail successfully', async () => {
    (autenticacaoService.autenticar as jest.Mock).mockResolvedValue({
      dados: { autenticado: false },
      mensagens: [ERRO_EMAIL_NAO_VALIDADO],
      status: 401,
    });

    (usuarioService.alterarEmailDeValidacao as jest.Mock).mockResolvedValue({
      status: 200,
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText('Informe o usuário'), {
      target: { value: 'usuario123' },
    });

    fireEvent.change(screen.getByPlaceholderText('Informe a senha'), {
      target: { value: '1234' },
    });

    fireEvent.click(screen.getByText('Acessar'));

    const editBtn = await screen.findByText('Editar e-mail');
    fireEvent.click(editBtn);

    const input = await screen.findByPlaceholderText('Informe o e-mail');

    fireEvent.change(input, { target: { value: 'teste@email.com' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() => {
      expect(usuarioService.alterarEmailDeValidacao).toHaveBeenCalled();
      expect(notification.success).toHaveBeenCalled();
    });
  });

  it('navigates correctly', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Esqueci minha senha'));
    fireEvent.click(screen.getByText('Cadastre-se'));

    expect(navigateMock).toHaveBeenCalledTimes(2);
  });
});