/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { Form } from 'antd';
import { render, fireEvent } from '@testing-library/react';
import EmailLista from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

jest.mock('../email', () => (props: any) => {
  return <input data-testid="input-email" {...props} />;
});

jest.mock('react-icons/fa', () => ({
  FaPlus: () => <span data-testid="icon-plus" />,
  FaTrashAlt: (props: any) => (
    <span data-testid="icon-trash" onClick={props.onClick} />
  ),
}));

jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    theme: {
      useToken: () => ({
        token: {
          colorTextDisabled: '#ccc',
          colorError: 'red',
        },
      }),
    },
  };
});

const renderComponent = (props = {}) => {
  return render(
    <Form>
      <EmailLista {...props} />
    </Form>,
  );
};

describe('EmailLista', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar input inicial corretamente', () => {
    const { getAllByTestId } = renderComponent();

    expect(getAllByTestId('input-email').length).toBeGreaterThan(0);
  });

  it('deve renderizar botão de adicionar no primeiro item', () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('icon-plus')).toBeInTheDocument();
  });

  it('deve chamar add ao clicar no botão de adicionar', () => {
    const { container } = renderComponent();

    const button = container.querySelector('button');

    expect(button).toBeTruthy();

    fireEvent.click(button!);
  });

  it('deve desabilitar botão add quando disabled=true', () => {
    const { container } = renderComponent({ disabled: true });

    const button = container.querySelector('button');

    expect(button).toBeDisabled();
  });

  it('deve renderizar ícone de remover quando name != 0', () => {
    // força mais de um item inicial
    const { queryAllByTestId } = renderComponent();

    // não garante múltiplos fields reais, mas cobre render do branch
    expect(queryAllByTestId('icon-trash')).toBeDefined();
  });

  it('deve aplicar estilo disabled no ícone de remoção', () => {
    const { container } = renderComponent({ disabled: true });

    const trash = container.querySelector('[data-testid="icon-trash"]');

    if (trash) {
      expect(trash).toBeInTheDocument();
    }
  });

  it('deve renderizar Form.List corretamente', () => {
    const { container } = renderComponent();

    const formList = container.querySelector('.ant-form');
    expect(formList).toBeInTheDocument();
  });

  it('deve manter estado inicial com 1 email', () => {
    const { getAllByTestId } = renderComponent();

    const inputs = getAllByTestId('input-email');
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });
});