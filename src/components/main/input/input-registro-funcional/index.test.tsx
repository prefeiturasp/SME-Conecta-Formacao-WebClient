/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import InputRegistroFuncional from './index';

const formItemMock = jest.fn();
const inputMock = jest.fn();
const inputSearchMock = jest.fn();

jest.mock('antd', () => {
  const Input = (props: any) => {
    inputMock(props);
    return <input data-testid="input-rf" {...props} />;
  };

  Input.Search = (props: any) => {
    inputSearchMock(props);
    return <input data-testid="input-search-rf" {...props} />;
  };

  return {
    Form: {
      Item: ({ children, ...props }: any) => {
        formItemMock(props);
        return <div>{children}</div>;
      },
    },
    Input,
  };
});

describe('InputRegistroFuncional', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar Input por padrão', () => {
    render(<InputRegistroFuncional />);

    expect(screen.getByTestId('input-rf')).toBeInTheDocument();
    expect(inputMock).toHaveBeenCalledTimes(1);
    expect(inputSearchMock).not.toHaveBeenCalled();
  });

  it('deve renderizar Input.Search quando habilitado', () => {
    render(<InputRegistroFuncional habilitarInputSearch />);

    expect(screen.getByTestId('input-search-rf')).toBeInTheDocument();
    expect(inputSearchMock).toHaveBeenCalledTimes(1);
    expect(inputMock).not.toHaveBeenCalled();
  });

  it('deve repassar formItemProps', () => {
    const formItemProps = {
      name: 'rf',
      required: true,
      label: 'Registro',
    };

    render(
      <InputRegistroFuncional
        formItemProps={formItemProps}
      />
    );

    const props = formItemMock.mock.calls[0][0];

    expect(props.name).toBe('rf');
    expect(props.required).toBe(true);
    expect(props.label).toBe('Registro');
  });

  it('deve configurar as propriedades padrão do Input', () => {
    render(<InputRegistroFuncional />);

    const props = inputMock.mock.calls[0][0];

    expect(props.id).toBe('INPUT_RF');
    expect(props.maxLength).toBe(7);
    expect(props.placeholder).toBe('Registro Funcional (RF)');
  });

  it('deve repassar inputProps', () => {
    const onChange = jest.fn();

    render(
      <InputRegistroFuncional
        inputProps={{
          disabled: true,
          value: '1234567',
          onChange,
        }}
      />
    );

    const props = inputMock.mock.calls[0][0];

    expect(props.disabled).toBe(true);
    expect(props.value).toBe('1234567');
    expect(props.onChange).toBe(onChange);
  });

  it('deve repassar inputProps para Input.Search', () => {
    const onSearch = jest.fn();

    render(
      <InputRegistroFuncional
        habilitarInputSearch
        inputProps={{
          allowClear: true,
          onSearch,
        }}
      />
    );

    const props = inputSearchMock.mock.calls[0][0];

    expect(props.allowClear).toBe(true);
    expect(props.onSearch).toBe(onSearch);
    expect(props.id).toBe('INPUT_RF');
    expect(props.maxLength).toBe(7);
  });
});