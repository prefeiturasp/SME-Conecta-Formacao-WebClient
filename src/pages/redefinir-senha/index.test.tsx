/**
 * @jest-environment jsdom
 */
import React from 'react';
import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';

(global as any).React = React;

// --------------------
// Mocks
// --------------------

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: 'usuario_teste' }),
}));

jest.mock('~/core/hooks/use-redux', () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock('~/core/redux/modules/spin/actions', () => ({
  setSpinning: () => ({ type: 'SPIN' }),
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('react-icons/io5', () => ({
  IoInformationCircleSharp: () => React.createElement('span', null, 'icon'),
}));

jest.mock('~/components/lib/modal', () => ({
  __esModule: true,
  default: ({ open, children }: any) =>
    open ? React.createElement('div', { 'data-testid': 'modal' }, children) : null,
}));

jest.mock('~/components/main/erro-geral-login', () => ({
  __esModule: true,
  default: ({ erros }: any) =>
    React.createElement('div', { 'data-testid': 'erro' }, erros?.join(',')),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    solicitarRecuperacaoSenha: jest.fn(),
  },
}));

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children, onFinish }: any) =>
    React.createElement(
      'form',
      {
        onSubmit: (e: any) => {
          e.preventDefault();
          onFinish && onFinish({ login: 'teste123' });
        },
      },
      children,
    );

  Form.Item = ({ children }: any) => React.createElement('div', null, children);

  const Button = ({ children, htmlType, block, ...rest }: any) =>
    React.createElement(
      'button',
      {
        type: htmlType === 'submit' ? 'submit' : 'button',
        ...rest,
      },
      children,
    );

  const Input = (props: any) => React.createElement('input', props);

  const Row = ({ children }: any) => React.createElement('div', null, children);
  const Col = ({ children }: any) => React.createElement('div', null, children);

  const Typography = {
    Text: ({ children }: any) => React.createElement('span', null, children),
  };

  return { Form, Button, Input, Row, Col, Typography };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [{}],
  useWatch: () => 'teste123',
}));

// --------------------
// Imports
// --------------------
import RedefinirSenha from './';
import usuarioService from '~/core/services/usuario-service';
import { onClickVoltar } from '~/core/utils/form';

// --------------------
// Utils
// --------------------
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// --------------------
// Tests
// --------------------

describe('RedefinirSenha', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(jest.fn());
  });

  test('renderiza sem quebrar', () => {
    render(<RedefinirSenha />);
    expect(screen.getByText(/Esqueci minha senha/i)).toBeTruthy();
  });

  test('sucesso abre modal', async () => {
    (usuarioService.solicitarRecuperacaoSenha as jest.Mock).mockResolvedValue({
      data: 'Email enviado',
    });

    await act(async () => {
      render(<RedefinirSenha />);
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /continuar/i }).closest('form')!);
      await flushPromises();
    });

    expect(usuarioService.solicitarRecuperacaoSenha).toHaveBeenCalled();
    expect(await screen.findByTestId('modal')).toBeTruthy();
  });

  test('erro string', async () => {
    (usuarioService.solicitarRecuperacaoSenha as jest.Mock).mockRejectedValue({
      response: { data: 'Erro simples' },
    });

    await act(async () => {
      render(<RedefinirSenha />);
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /continuar/i }).closest('form')!);
      await flushPromises();
    });

    const erro = await screen.findByTestId('erro');
    expect(erro.textContent).toContain('Erro simples');
  });

  test('erro lista', async () => {
    (usuarioService.solicitarRecuperacaoSenha as jest.Mock).mockRejectedValue({
      response: { data: { mensagens: ['Erro 1', 'Erro 2'] } },
    });

    await act(async () => {
      render(<RedefinirSenha />);
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /continuar/i }).closest('form')!);
      await flushPromises();
    });

    const erro = await screen.findByTestId('erro');
    expect(erro.textContent).toContain('Erro 1');
    expect(erro.textContent).toContain('Erro 2');
  });

  test('erro fallback', async () => {
    (usuarioService.solicitarRecuperacaoSenha as jest.Mock).mockRejectedValue({
      response: { data: {} },
    });

    await act(async () => {
      render(<RedefinirSenha />);
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button', { name: /continuar/i }).closest('form')!);
      await flushPromises();
    });

    expect(await screen.findByTestId('erro')).toBeTruthy();
  });

  test('voltar chama função', () => {
    render(<RedefinirSenha />);
    fireEvent.click(screen.getByText('Voltar'));
    expect(onClickVoltar).toHaveBeenCalled();
  });
});