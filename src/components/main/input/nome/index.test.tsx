/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { InputNome } from './index';

const formItemMock = jest.fn();
const inputMock = jest.fn();

jest.mock('antd', () => ({
  Form: {
    Item: ({ children, ...props }: any) => {
      formItemMock(props);
      return <>{children}</>;
    },
  },

  Input: (props: any) => {
    inputMock(props);

    return (
      <input
        data-testid="input-nome"
        {...props}
      />
    );
  },
}));

describe('InputNome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o Input', () => {
    render(<InputNome />);

    expect(screen.getByTestId('input-nome')).toBeInTheDocument();
  });

  it('deve configurar o Form.Item corretamente', () => {
    render(
      <InputNome
        formItemProps={{
          label: 'Nome Completo',
          name: 'nomeCompleto',
          required: true,
        }}
      />
    );

    expect(formItemMock).toHaveBeenCalledWith(
      expect.objectContaining({
        label: 'Nome Completo',
        name: 'nomeCompleto',
        required: true,
      })
    );
  });

  it('deve configurar as propriedades padrão do Input', () => {
    render(<InputNome />);

    expect(inputMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'CF_INPUT_NOME',
        placeholder: 'Nome',
      })
    );
  });

  it('deve repassar inputProps', () => {
    const onChange = jest.fn();

    render(
      <InputNome
        inputProps={{
          disabled: true,
          maxLength: 50,
          onChange,
        }}
      />
    );

    expect(inputMock).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        maxLength: 50,
        onChange,
      })
    );
  });

  it('deve possuir o id correto', () => {
    render(<InputNome />);

    expect(screen.getByTestId('input-nome')).toHaveAttribute(
      'id',
      'CF_INPUT_NOME'
    );
  });

  it('deve possuir o placeholder padrão', () => {
    render(<InputNome />);

    expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument();
  });
});