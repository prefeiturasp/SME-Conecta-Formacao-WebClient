/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import SelectFuncaoAtividade from './index';
import { CF_SELECT_FUNCAO_ATIVIDADE } from '../../../../../core/constants/ids/select';

type FormValues = {
  usuarioCargoSelecionado?: string | number;
  usuarioCargos?: Array<{
    codigo: string | number;
    funcoes?: Array<{
      codigo: string | number;
      descricao: string;
      [key: string]: unknown;
    }>;
  }>;
};

type CapturedSelectProps = {
  allowClear?: boolean;
  labelInValue?: boolean;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  options?: unknown[];
  onChange?: (...args: unknown[]) => void;
};

type CapturedFormItemProps = {
  label?: React.ReactNode;
  name?: string;
  required?: boolean;
  getValueFromEvent?: (...args: unknown[]) => unknown;
};

let mockFormValues: FormValues;
let mockCapturedSelectProps: CapturedSelectProps;
let mockCapturedInnerFormItemProps: CapturedFormItemProps;

const mockGetFieldsValue = jest.fn(() => mockFormValues);

jest.mock('antd', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');

  const FormItem = ({
    children,
    label,
    name,
    getValueFromEvent,
    required,
  }: {
    children:
      | React.ReactNode
      | ((form: { getFieldsValue: jest.Mock }) => React.ReactNode);
    label?: React.ReactNode;
    name?: string;
    getValueFromEvent?: (...args: unknown[]) => unknown;
    required?: boolean;
  }) => {
    mockCapturedInnerFormItemProps = {
      label,
      name,
      required,
      getValueFromEvent,
    };

    if (typeof children === 'function') {
      return ReactModule.createElement(
        ReactModule.Fragment,
        null,
        children({
          getFieldsValue: mockGetFieldsValue,
        }),
      );
    }

    return ReactModule.createElement(
      'div',
      {
        'data-testid': 'inner-form-item',
        'data-label': String(label),
        'data-name': name,
        'data-required': String(Boolean(required)),
      },
      children,
    );
  };

  return {
    Form: {
      Item: FormItem,
    },
  };
});

jest.mock('~/components/lib/inputs/select', () => {
  const ReactModule = jest.requireActual<typeof import('react')>('react');

  return {
    __esModule: true,
    default: (props: CapturedSelectProps) => {
      mockCapturedSelectProps = props;

      return ReactModule.createElement(
        'button',
        {
          type: 'button',
          'data-testid': 'select-funcao-atividade',
          disabled: props.disabled,
          onClick: () => props.onChange?.('codigo-evento', 'opcao-evento'),
        },
        props.placeholder,
      );
    },
  };
});

jest.mock('~/core/constants/ids/select', () => ({
  CF_SELECT_FUNCAO_ATIVIDADE: 'cf-select-funcao-atividade',
}));

describe('SelectFuncaoAtividade', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockFormValues = {};
    mockCapturedSelectProps = {};
    mockCapturedInnerFormItemProps = {};
  });

  it('renderiza o campo com as propriedades padrão', () => {
    render(<SelectFuncaoAtividade />);

    expect(screen.getByTestId('inner-form-item').getAttribute('data-label')).toBe(
      'Função/Atividade',
    );

    expect(screen.getByTestId('inner-form-item').getAttribute('data-name')).toBe(
      'usuarioFuncaoSelecionado',
    );

    expect(screen.getByTestId('select-funcao-atividade')).toHaveTextContent(
      'Selecione uma Função/Atividade',
    );

    expect(mockCapturedSelectProps).toEqual(
      expect.objectContaining({
        allowClear: true,
        labelInValue: true,
        options: [],
        placeholder: 'Selecione uma Função/Atividade',
        id: CF_SELECT_FUNCAO_ATIVIDADE,
      }),
    );

    expect(mockGetFieldsValue).toHaveBeenCalledTimes(2);
    expect(mockGetFieldsValue).toHaveBeenCalledWith(true);
  });

  it('mantém as opções vazias quando não existe cargo selecionado', () => {
    mockFormValues = {
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [
            {
              codigo: 10,
              descricao: 'Administrador',
            },
          ],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('mantém as opções vazias quando usuarioCargos não está definido', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 1,
      usuarioCargos: undefined,
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('mantém as opções vazias quando o cargo selecionado não é encontrado', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 999,
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [
            {
              codigo: 10,
              descricao: 'Administrador',
            },
          ],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('mantém as opções vazias quando o cargo não possui funções', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 1,
      usuarioCargos: [
        {
          codigo: 1,
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('mantém as opções vazias quando a lista de funções está vazia', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 1,
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('transforma as funções do cargo selecionado em opções do Select', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 2,
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [
            {
              codigo: 10,
              descricao: 'Função incorreta',
            },
          ],
        },
        {
          codigo: 2,
          funcoes: [
            {
              codigo: 20,
              descricao: 'Analista',
              ativo: true,
            },
            {
              codigo: 21,
              descricao: 'Coordenador',
              ativo: false,
            },
          ],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([
      {
        codigo: 20,
        descricao: 'Analista',
        ativo: true,
        label: 'Analista',
        value: 20,
      },
      {
        codigo: 21,
        descricao: 'Coordenador',
        ativo: false,
        label: 'Coordenador',
        value: 21,
      },
    ]);
  });

  it('transforma as funções em opções mapeadas corretamente', () => {
    mockFormValues = {
      usuarioCargoSelecionado: 1,
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [
            {
              codigo: 100,
              descricao: 'Gerente',
            },
          ],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([
      {
        codigo: 100,
        descricao: 'Gerente',
        label: 'Gerente',
        value: 100,
      },
    ]);
  });

  it('compara o código do cargo de forma estrita', () => {
    mockFormValues = {
      usuarioCargoSelecionado: '1',
      usuarioCargos: [
        {
          codigo: 1,
          funcoes: [
            {
              codigo: 10,
              descricao: 'Administrador',
            },
          ],
        },
      ],
    };

    render(<SelectFuncaoAtividade />);

    expect(mockCapturedSelectProps.options).toEqual([]);
  });

  it('repassa selectProps para o Select', () => {
    const onChange = jest.fn();

    render(
      <SelectFuncaoAtividade
        selectProps={{
          disabled: true,
          placeholder: 'Placeholder customizado',
          allowClear: false,
          onChange,
        }}
      />,
    );

    expect(mockCapturedSelectProps).toEqual(
      expect.objectContaining({
        disabled: true,
        placeholder: 'Placeholder customizado',
        allowClear: false,
        onChange,
      }),
    );

    expect(screen.getByTestId('select-funcao-atividade')).toBeDisabled();
    expect(screen.getByTestId('select-funcao-atividade')).toHaveTextContent(
      'Placeholder customizado',
    );
  });

  it('executa o onChange recebido em selectProps', () => {
    const onChange = jest.fn();

    render(
      <SelectFuncaoAtividade
        selectProps={{
          onChange,
        }}
      />,
    );

    fireEvent.click(screen.getByTestId('select-funcao-atividade'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      'codigo-evento',
      'opcao-evento',
    );
  });

  it('permite sobrescrever o id por meio de selectProps', () => {
    render(
      <SelectFuncaoAtividade
        selectProps={{
          id: 'id-customizado',
        }}
      />,
    );

    expect(mockCapturedSelectProps.id).toBe('id-customizado');
  });

  it('repassa formItemProps para o Form.Item interno', () => {
    render(
      <SelectFuncaoAtividade
        formItemProps={{
          required: true,
        }}
      />,
    );

    expect(mockCapturedInnerFormItemProps).toEqual(
      expect.objectContaining({
        required: true,
        label: 'Função/Atividade',
        name: 'usuarioFuncaoSelecionado',
      }),
    );
  });

  it('não permite que formItemProps sobrescreva label e name fixos', () => {
    render(
      <SelectFuncaoAtividade
        formItemProps={{
          label: 'Label customizado',
          name: 'nomeCustomizado',
        }}
      />,
    );

    expect(mockCapturedInnerFormItemProps.label).toBe('Função/Atividade');
    expect(mockCapturedInnerFormItemProps.name).toBe(
      'usuarioFuncaoSelecionado',
    );
  });

  it('getValueFromEvent retorna o segundo argumento recebido', () => {
    render(<SelectFuncaoAtividade />);

    const getValueFromEvent =
      mockCapturedInnerFormItemProps.getValueFromEvent;

    expect(getValueFromEvent).toBeInstanceOf(Function);
    expect(
      getValueFromEvent?.(
        {
          target: {
            value: 'valor-do-evento',
          },
        },
        {
          value: 20,
          label: 'Analista',
        },
      ),
    ).toEqual({
      value: 20,
      label: 'Analista',
    });
  });

  it('getValueFromEvent retorna undefined quando o segundo argumento é undefined', () => {
    render(<SelectFuncaoAtividade />);

    const getValueFromEvent =
      mockCapturedInnerFormItemProps.getValueFromEvent;

    expect(getValueFromEvent?.('evento', undefined)).toBeUndefined();
  });
});