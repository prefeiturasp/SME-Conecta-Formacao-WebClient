/**
 * @jest-environment jsdom
 */

declare const require: any;

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import ListCoordenadoria from './index';

import {
  atualizarCoordenadoria,
  criarCoordenadoria,
  excluirCoordenadoria,
  obterCoordenadoriaPorId,
} from '../../../core/services/coordenadoria-service';

import { notification } from '../../../components/lib/notification';

import { obterPermissaoPorMenu } from '../../../core/utils/perfil';
import { onClickVoltar } from '../../../core/utils/form';

jest.mock('~/core/services/coordenadoria-service');

jest.mock('~/core/utils/perfil', () => ({
  obterPermissaoPorMenu: jest.fn(),
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
  value: jest.fn(),
  writable: true,
});

jest.mock('antd', () => {
  const React = require('react');

  const Form = ({ children }: any) => React.createElement('div', null, children);
  Form.Item = ({ children }: any) =>
    React.createElement('div', null, typeof children === 'function' ? children() : children);

  const Button = ({ children, htmlType, type, block, ...rest }: any) =>
    React.createElement('button', { type: 'button', ...rest }, children);

  const Col = ({ children }: any) => React.createElement('div', null, children);
  const Row = ({ children }: any) => React.createElement('div', null, children);
  const Typography = {
    Title: ({ children }: any) => React.createElement('h4', null, children),
    Paragraph: ({ children }: any) => React.createElement('p', null, children),
  };
  const Input = (props: any) => React.createElement('input', props);
  const Select = (props: any) => React.createElement('select', props);

  return {
    __esModule: true,
    Button,
    Col,
    Form,
    Input,
    Row,
    Select,
    Typography,
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [
    {
      getFieldValue: jest.fn(),
      setFieldsValue: jest.fn(),
      isFieldsTouched: jest.fn(() => false),
    },
  ],
}));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: ({ onClick }: any) => <button type='button' onClick={onClick}>Voltar</button>,
}));

jest.mock('~/components/lib/card-content', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('~/components/main/text/input-text', () => ({
  __esModule: true,
  default: ({ formItemProps, inputProps }: any) => (
    <input {...inputProps} aria-label={formItemProps.name} />
  ),
}));

const mockData = {
  id: 1,
  nome: 'Coordenadoria Teste',
  sigla: 'CT',
  areasPromotoras: [],
};

jest.mock('~/components/lib/card-table', () => ({
  __esModule: true,
  default: ({ onRow }: any) => {
    const rowHandlers = onRow(mockData);

    return (
      <div role='button' tabIndex={0} data-testid='linha' onClick={rowHandlers.onClick}>
        Linha
      </div>
    );
  },
}));

jest.mock('./components/modal-salvar-coordernadoria/modal-salvar-coordernadoria', () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <span>ModalSalvar</span>
      <button
          type='button'
        data-testid='confirmar'
        onClick={() =>
          props.onConfirm({
            id: 1,
            nome: 'Teste',
            sigla: 'TT',
          })
        }
      >
        Confirmar
      </button>
      <button type='button' data-testid='cancelar' onClick={props.onCancel}>
        Cancelar
      </button>
      <button type='button' data-testid='deletar' onClick={props.onDelete}>
        Deletar
      </button>
    </div>
  ),
}));

jest.mock('./components/modal-excluir-coordenadoria/modal-excluir-coordenadoria', () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      ModalExcluir
      <button type='button' data-testid='confirmar-excluir' onClick={props.onConfirm}>
        ConfirmarExcluir
      </button>
    </div>
  ),
}));

jest.mock('./components/modal-vinculo-area-promotora/modal-vinculo-area-promotora', () => ({
  __esModule: true,
  default: () => <div>ModalVinculo</div>,
}));

const renderPage = () =>
  render(
    <BrowserRouter>
      <ListCoordenadoria />
    </BrowserRouter>,
  );

describe('ListCoordenadoria', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (obterPermissaoPorMenu as jest.Mock).mockReturnValue({
      podeIncluir: true,
    });
  });

  test('deve renderizar tela', () => {
    renderPage();

    expect(screen.getByText('Adicionar coordenadoria')).toBeInTheDocument();
  });

  test('deve voltar ao clicar botão voltar', () => {
    renderPage();

    fireEvent.click(screen.getByText('Voltar'));

    expect(onClickVoltar).toHaveBeenCalled();
  });

  test('deve abrir modal novo', () => {
    renderPage();

    fireEvent.click(screen.getByText('Adicionar coordenadoria'));

    expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
  });

  test('não deve permitir incluir sem permissão', () => {
    (obterPermissaoPorMenu as jest.Mock).mockReturnValue({
      podeIncluir: false,
    });

    renderPage();

    expect(screen.getByText('Adicionar coordenadoria')).toBeDisabled();
  });

  test('deve abrir edição ao clicar linha', async () => {
    (obterCoordenadoriaPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockData,
    });

    renderPage();

    fireEvent.click(screen.getByTestId('linha'));

    await waitFor(() => {
      expect(obterCoordenadoriaPorId).toHaveBeenCalledWith(1);
    });

    expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
  });

  test('deve cancelar modal', () => {
    renderPage();

    fireEvent.click(screen.getByText('Adicionar coordenadoria'));
    fireEvent.click(screen.getByTestId('cancelar'));

    expect(screen.queryByText('ModalSalvar')).not.toBeInTheDocument();
  });

  test('deve criar coordenadoria com sucesso', async () => {
    (criarCoordenadoria as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderPage();

    fireEvent.click(screen.getByText('Adicionar coordenadoria'));
    fireEvent.click(screen.getByTestId('confirmar'));

    await waitFor(() => {
      expect(criarCoordenadoria).toHaveBeenCalled();
    });

    expect(notification.success).toHaveBeenCalled();
  });

  test('deve criar coordenadoria com erro', async () => {
    (criarCoordenadoria as jest.Mock).mockResolvedValue({
      sucesso: false,
      mensagens: ['Erro'],
    });

    renderPage();

    fireEvent.click(screen.getByText('Adicionar coordenadoria'));
    fireEvent.click(screen.getByTestId('confirmar'));

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
    });
  });

  test('deve atualizar coordenadoria', async () => {
    (obterCoordenadoriaPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockData,
    });
    (atualizarCoordenadoria as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderPage();

    fireEvent.click(screen.getByTestId('linha'));

    await waitFor(() => {
      expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('confirmar'));

    await waitFor(() => {
      expect(atualizarCoordenadoria).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          id: 1,
          nome: 'Teste',
          sigla: 'TT',
        }),
      );
    });
  });

  test('deve excluir coordenadoria sem áreas', async () => {
    (obterCoordenadoriaPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockData,
    });
    (excluirCoordenadoria as jest.Mock).mockResolvedValue({
      sucesso: true,
    });

    renderPage();

    fireEvent.click(screen.getByTestId('linha'));

    await waitFor(() => {
      expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('deletar'));
    fireEvent.click(screen.getByTestId('confirmar-excluir'));

    await waitFor(() => {
      expect(excluirCoordenadoria).toHaveBeenCalledWith(1);
    });
  });

  test('deve abrir modal vinculo quando possui áreas', async () => {
    (obterCoordenadoriaPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        ...mockData,
        areasPromotoras: [{ id: 1 }],
      },
    });

    renderPage();

    fireEvent.click(screen.getByTestId('linha'));

    await waitFor(() => {
      expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('deletar'));
    fireEvent.click(screen.getByTestId('confirmar-excluir'));

    expect(screen.getByText('ModalVinculo')).toBeInTheDocument();
  });

  test('erro excluir com mensagens', async () => {
    (obterCoordenadoriaPorId as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: mockData,
    });
    (excluirCoordenadoria as jest.Mock).mockResolvedValue({
      sucesso: false,
      mensagens: ['Não permitido'],
    });

    renderPage();

    fireEvent.click(screen.getByTestId('linha'));

    await waitFor(() => {
      expect(screen.getByText('ModalSalvar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('deletar'));
    fireEvent.click(screen.getByTestId('confirmar-excluir'));

    await waitFor(() => {
      expect(notification.error).toHaveBeenCalled();
    });
  });
});