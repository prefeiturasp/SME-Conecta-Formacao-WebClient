/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import CardInscrito from './card-inscrito';

type FormItemMockProps = {
  label?: React.ReactNode;
  name?: Array<number | string>;
  rules?: Array<{
    required?: boolean;
    message?: string;
  }>;
  children?: React.ReactNode;
};

type InputMockProps = {
  placeholder?: string;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

type SelectMockProps = {
  placeholder?: string;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
};

type SelectOptionMockProps = {
  value?: string;
  children?: React.ReactNode;
};

let capturedFormItems: FormItemMockProps[] = [];

jest.mock('./card-inscrito.module.css', () => ({
  cardContainer: 'cardContainer',
  cardHeader: 'cardHeader',
  subscriberName: 'subscriberName',
  subscriberDocument: 'subscriberDocument',
  cardBody: 'cardBody',
}));

jest.mock('antd', () => {
  const FormItem = ({
    label,
    name,
    rules,
    children,
  }: FormItemMockProps) => {
    capturedFormItems.push({
      label,
      name,
      rules,
      children,
    });

    return (
      <div
        data-testid={`form-item-${String(name?.[1])}`}
        data-name={JSON.stringify(name)}
        data-rules={JSON.stringify(rules)}
      >
        <label>{label}</label>
        {children}
      </div>
    );
  };

  const Input = ({
    placeholder,
    maxLength,
    onChange,
  }: InputMockProps) => (
    <input
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
    />
  );

  const Select = ({
    placeholder,
    onChange,
    children,
  }: SelectMockProps) => (
    <select
      aria-label={placeholder}
      value=''
      onChange={(event) => onChange?.(event.target.value)}
    >
      <option value='' disabled>
        {placeholder}
      </option>
      {children}
    </select>
  );

  Select.Option = ({
    value,
    children,
  }: SelectOptionMockProps) => (
    <option value={value}>{children}</option>
  );

  const Row = ({
    children,
  }: {
    children?: React.ReactNode;
  }) => <div data-testid='row'>{children}</div>;

  const Col = ({
    children,
    xs,
    md,
  }: {
    children?: React.ReactNode;
    xs?: number;
    md?: number;
  }) => (
    <div
      data-testid='col'
      data-xs={xs}
      data-md={md}
    >
      {children}
    </div>
  );

  return {
    Col,
    Form: {
      Item: FormItem,
    },
    Input,
    Row,
    Select,
  };
});

describe('CardInscrito', () => {
  const onChangeForm = jest.fn();

  const renderizar = (
    overrides: Partial<
      React.ComponentProps<typeof CardInscrito>
    > = {},
  ) =>
    render(
      <CardInscrito
        name={0}
        nome='Maria da Silva'
        documento='123.456.789-00'
        onChangeForm={onChangeForm}
        {...overrides}
      />,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    capturedFormItems = [];
  });

  it('renderiza o nome e o documento do inscrito', () => {
    renderizar();

    expect(
      screen.getByRole('heading', {
        name: 'Maria da Silva',
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'RF ou CPF: 123.456.789-00',
      ),
    ).toBeInTheDocument();
  });

  it('aplica as classes CSS esperadas', () => {
    const { container } = renderizar();

    expect(
      container.querySelector('.cardContainer'),
    ).toBeInTheDocument();

    expect(
      container.querySelector('.cardHeader'),
    ).toBeInTheDocument();

    expect(
      container.querySelector('.subscriberName'),
    ).toBeInTheDocument();

    expect(
      container.querySelector(
        '.subscriberDocument',
      ),
    ).toBeInTheDocument();

    expect(
      container.querySelector('.cardBody'),
    ).toBeInTheDocument();
  });

  it('renderiza quatro campos do formulário', () => {
    renderizar();

    expect(capturedFormItems).toHaveLength(4);

    expect(
      screen.getByText('Frequência (%)'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Atividade obrigatória'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Conceito final'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('Aprovado'),
    ).toBeInTheDocument();
  });

  it('usa o índice recebido nos nomes dos campos', () => {
    renderizar({
      name: 7,
    });

    expect(
      screen.getByTestId('form-item-frequencia'),
    ).toHaveAttribute(
      'data-name',
      JSON.stringify([7, 'frequencia']),
    );

    expect(
      screen.getByTestId(
        'form-item-atividadeObrigatoria',
      ),
    ).toHaveAttribute(
      'data-name',
      JSON.stringify([
        7,
        'atividadeObrigatoria',
      ]),
    );

    expect(
      screen.getByTestId('form-item-conceitoFinal'),
    ).toHaveAttribute(
      'data-name',
      JSON.stringify([7, 'conceitoFinal']),
    );

    expect(
      screen.getByTestId('form-item-aprovado'),
    ).toHaveAttribute(
      'data-name',
      JSON.stringify([7, 'aprovado']),
    );
  });

  it('configura todos os campos como obrigatórios', () => {
    renderizar();

    capturedFormItems.forEach((item) => {
      expect(item.rules).toEqual([
        {
          required: true,
          message: 'Campo obrigatório',
        },
      ]);
    });
  });

  it('configura corretamente o campo de frequência', () => {
    renderizar();

    const input = screen.getByPlaceholderText('Ex: 85');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('maxlength', '3');
  });

  it('dispara onChangeForm ao alterar a frequência', () => {
    renderizar();

    fireEvent.change(
      screen.getByPlaceholderText('Ex: 85'),
      {
        target: {
          value: '85',
        },
      },
    );

    expect(onChangeForm).toHaveBeenCalledTimes(1);
  });

  it('renderiza as opções de atividade obrigatória', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    expect(selects[0]).toHaveTextContent('Sim');
    expect(selects[0]).toHaveTextContent('Não');

    expect(
      screen.getAllByRole('option', {
        name: 'Sim',
      }),
    ).toHaveLength(2);

    expect(
      screen.getAllByRole('option', {
        name: 'Não',
      }),
    ).toHaveLength(2);
  });

  it('dispara onChangeForm ao alterar atividade obrigatória', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[0], {
      target: {
        value: 'S',
      },
    });

    expect(onChangeForm).toHaveBeenCalledTimes(1);
  });

  it('renderiza as opções de conceito final', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    expect(selects[1]).toHaveTextContent(
      'Satisfatório (S)',
    );

    expect(selects[1]).toHaveTextContent(
      'Não satisfatório (NS)',
    );

    expect(selects[1]).toHaveTextContent(
      'Plenamente satisfatório (P)',
    );
  });

  it('usa os valores corretos nas opções de conceito final', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');
    const options = Array.from(
      selects[1].querySelectorAll('option'),
    );

    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          value: 'S',
        }),
        expect.objectContaining({
          value: 'NS',
        }),
        expect.objectContaining({
          value: 'P',
        }),
      ]),
    );
  });

  it('dispara onChangeForm ao alterar o conceito final', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[1], {
      target: {
        value: 'NS',
      },
    });

    expect(onChangeForm).toHaveBeenCalledTimes(1);
  });

  it('renderiza as opções de aprovado', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    expect(selects[2]).toHaveTextContent('Sim');
    expect(selects[2]).toHaveTextContent('Não');
  });

  it('dispara onChangeForm ao alterar aprovado', () => {
    renderizar();

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[2], {
      target: {
        value: 'N',
      },
    });

    expect(onChangeForm).toHaveBeenCalledTimes(1);
  });

  it('dispara onChangeForm para todos os campos alteráveis', () => {
    renderizar();

    fireEvent.change(
      screen.getByPlaceholderText('Ex: 85'),
      {
        target: {
          value: '90',
        },
      },
    );

    const selects = screen.getAllByRole('combobox');

    fireEvent.change(selects[0], {
      target: {
        value: 'S',
      },
    });

    fireEvent.change(selects[1], {
      target: {
        value: 'P',
      },
    });

    fireEvent.change(selects[2], {
      target: {
        value: 'S',
      },
    });

    expect(onChangeForm).toHaveBeenCalledTimes(4);
  });

  it('configura todas as colunas com xs 24 e md 12', () => {
    renderizar();

    const colunas = screen.getAllByTestId('col');

    expect(colunas).toHaveLength(4);

    colunas.forEach((coluna) => {
      expect(coluna).toHaveAttribute('data-xs', '24');
      expect(coluna).toHaveAttribute('data-md', '12');
    });
  });

  it('renderiza o componente com valores vazios', () => {
    renderizar({
      nome: '',
      documento: '',
    });

    expect(
      screen.getByRole('heading', {
        name: '',
        level: 3,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText('RF ou CPF:'),
    ).toBeInTheDocument();
  });
});
