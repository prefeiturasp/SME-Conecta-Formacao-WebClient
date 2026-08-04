/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'antd';

import { InputNomeSocial } from './index';
import { CF_INPUT_NOME_SOCIAL } from '../../../../core/constants/ids/input';

jest.mock('styled-components', () => {
  const actual = jest.requireActual('styled-components');

  return {
    __esModule: true,
    ...actual,
    default: actual.default,
  };
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
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

class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserverMock,
});

describe('InputNomeSocial', () => {
  const renderComponent = (
    props: React.ComponentProps<typeof InputNomeSocial> = {},
  ) => {
    return render(
      <Form>
        <InputNomeSocial {...props} />
      </Form>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o campo com as propriedades padrão', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    expect(screen.getByText('Nome Social')).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', CF_INPUT_NOME_SOCIAL);
    expect(input).toHaveAttribute(
      'placeholder',
      'Exemplo: João da Silva',
    );
  });

  it('deve aplicar as propriedades recebidas em inputProps', () => {
    renderComponent({
      inputProps: {
        placeholder: 'Informe seu nome social',
        disabled: true,
        maxLength: 80,
        'aria-label': 'Campo de nome social',
      },
    });

    const input = screen.getByRole('textbox', {
      name: 'Campo de nome social',
    });

    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('maxlength', '80');
    expect(input).toHaveAttribute(
      'placeholder',
      'Informe seu nome social',
    );
  });

  it('deve permitir sobrescrever o id através de inputProps', () => {
    renderComponent({
      inputProps: {
        id: 'nome-social-customizado',
      },
    });

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    expect(input).toHaveAttribute('id', 'nome-social-customizado');
  });

  it('deve aplicar as propriedades recebidas em formItemProps', () => {
    const { container } = renderComponent({
      formItemProps: {
        label: 'Como deseja ser chamado?',
        name: 'nomeSocialCustomizado',
        required: true,
        help: 'Informe o nome pelo qual deseja ser chamado',
        validateStatus: 'warning',
        className: 'form-item-customizado',
      },
    });

    expect(
      screen.getByText('Como deseja ser chamado?'),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Informe o nome pelo qual deseja ser chamado',
      ),
    ).toBeInTheDocument();

    expect(
      container.querySelector('.form-item-customizado'),
    ).toBeInTheDocument();

    expect(
      container.querySelector('.ant-form-item-has-warning'),
    ).toBeInTheDocument();
  });

  it('deve vincular o valor ao name sobrescrito em formItemProps', () => {
    const onValuesChange = jest.fn();

    render(
      <Form onValuesChange={onValuesChange}>
        <InputNomeSocial
          formItemProps={{
            label: 'Nome de preferência',
            name: 'nomePreferencia',
          }}
        />
      </Form>,
    );

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    fireEvent.change(input, {
      target: {
        value: 'João da Silva',
      },
    });

    expect(screen.getByText('Nome de preferência')).toBeInTheDocument();
    expect(input).toHaveValue('João da Silva');

    expect(onValuesChange).toHaveBeenCalledTimes(1);
    expect(onValuesChange).toHaveBeenCalledWith(
      {
        nomePreferencia: 'João da Silva',
      },
      {
        nomePreferencia: 'João da Silva',
      },
    );
  });

  it('deve atualizar o valor digitado pelo usuário', () => {
    renderComponent();

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    fireEvent.change(input, {
      target: {
        value: 'Maria Souza',
      },
    });

    expect(input).toHaveValue('Maria Souza');
  });

  it('deve executar o onChange recebido em inputProps', () => {
    const onChange = jest.fn();

    renderComponent({
      inputProps: {
        onChange,
      },
    });

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    fireEvent.change(input, {
      target: {
        value: 'Ana Pereira',
      },
    });

    expect(onChange).toHaveBeenCalledTimes(1);

    const evento = onChange.mock.calls[0][0];

    expect(evento.target.value).toBe('Ana Pereira');
  });

  it('deve repassar a classe customizada para o Input', () => {
    renderComponent({
      inputProps: {
        className: 'input-nome-social-customizado',
      },
    });

    const input = screen.getByPlaceholderText('Exemplo: João da Silva');

    expect(input).toHaveClass('input-nome-social-customizado');
  });

  it('deve aceitar inputProps e formItemProps não informados', () => {
    expect(() => renderComponent()).not.toThrow();

    expect(
      screen.getByPlaceholderText('Exemplo: João da Silva'),
    ).toBeInTheDocument();
  });
});
