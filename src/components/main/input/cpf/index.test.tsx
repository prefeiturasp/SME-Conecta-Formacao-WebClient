/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import InputCPF from './index';
import {
  formatterCPFMask,
  removerTudoQueNaoEhDigito,
} from '../../../../core/utils/functions';

jest.mock('~/core/utils/functions', () => ({
  formatterCPFMask: jest.fn(),
  removerTudoQueNaoEhDigito: jest.fn(),
}));

const formItemMock = jest.fn();

jest.mock('antd', () => {
  return {
    Form: {
      Item: (props: any) => {
        formItemMock(props);
        return <div>{props.children}</div>;
      },
    },
    Input: Object.assign(
      (props: any) => (
        <input
          data-testid="input-cpf"
          placeholder={props.placeholder}
          {...props}
        />
      ),
      {
        Search: (props: any) => (
          <input
            data-testid="input-search-cpf"
            placeholder={props.placeholder}
            {...props}
          />
        ),
      }
    ),
  };
});

describe('InputCPF', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o Input padrão', () => {
    render(<InputCPF />);

    expect(screen.getByTestId('input-cpf')).toBeInTheDocument();
  });

  it('deve renderizar o Input.Search', () => {
    render(<InputCPF habilitarInputSearch />);

    expect(screen.getByTestId('input-search-cpf')).toBeInTheDocument();
  });

  it('deve formatar o CPF no getValueFromEvent', () => {
    (removerTudoQueNaoEhDigito as jest.Mock).mockReturnValue('12345678901');
    (formatterCPFMask as jest.Mock).mockReturnValue(
      '123.456.789-01'
    );

    render(<InputCPF />);

    const props = formItemMock.mock.calls[0][0];

    const result = props.getValueFromEvent({
      target: {
        value: '123.456.789-01',
      },
    });

    expect(removerTudoQueNaoEhDigito).toHaveBeenCalledWith(
      '123.456.789-01'
    );

    expect(formatterCPFMask).toHaveBeenCalledWith(
      '12345678901'
    );

    expect(result).toBe('123.456.789-01');
  });

  it('deve retornar vazio quando não houver valor', () => {
    (removerTudoQueNaoEhDigito as jest.Mock).mockReturnValue('');

    render(<InputCPF />);

    const props = formItemMock.mock.calls[0][0];

    const result = props.getValueFromEvent({
      target: {
        value: '',
      },
    });

    expect(result).toBe('');
    expect(formatterCPFMask).not.toHaveBeenCalled();
  });

  describe('validator', () => {
    it('deve aceitar valor vazio', async () => {
      (removerTudoQueNaoEhDigito as jest.Mock).mockReturnValue('');

      render(<InputCPF />);

      const validator = formItemMock.mock.calls[0][0].rules[1].validator;

      await expect(validator({}, '')).resolves.toBeUndefined();
    });

    it('deve aceitar CPF com 11 dígitos', async () => {
      (removerTudoQueNaoEhDigito as jest.Mock).mockReturnValue(
        '12345678901'
      );

      render(<InputCPF />);

      const validator = formItemMock.mock.calls[0][0].rules[1].validator;

      await expect(
        validator({}, '123.456.789-01')
      ).resolves.toBeUndefined();
    });

    it('deve rejeitar CPF inválido', async () => {
      (removerTudoQueNaoEhDigito as jest.Mock).mockReturnValue(
        '123'
      );

      render(<InputCPF />);

      const validator = formItemMock.mock.calls[0][0].rules[1].validator;

      await expect(
        validator({}, '123')
      ).rejects.toBeUndefined();
    });
  });

  it('deve configurar required quando informado', () => {
    render(
      <InputCPF
        formItemProps={{
          required: true,
        }}
      />
    );

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules[0].required).toBe(true);
  });

  it('deve configurar required como false por padrão', () => {
    render(<InputCPF />);

    const props = formItemMock.mock.calls[0][0];

    expect(props.rules[0].required).toBe(false);
  });
});