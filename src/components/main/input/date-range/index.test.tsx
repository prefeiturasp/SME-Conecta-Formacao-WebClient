/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

import { DatePickerPeriodo } from './index';

const formItemMock = jest.fn();
const rangePickerMock = jest.fn();

jest.mock('antd', () => {

  const RangePicker = (props: any) => {
    rangePickerMock(props);

    return (
      <div
        data-testid="range-picker"
        id={props.id}
      />
    );
  };

  return {
    Form: {
      Item: ({ children, ...props }: any) => {
        formItemMock(props);

        return <div>{children}</div>;
      },
    },
    DatePicker: {
      RangePicker,
    },
  };
});

describe('DatePickerPeriodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o RangePicker', () => {
    render(<DatePickerPeriodo />);

    expect(screen.getByTestId('range-picker')).toBeInTheDocument();
  });

  it('deve repassar as propriedades do Form.Item', () => {
    render(
      <DatePickerPeriodo
        formItemProps={{
          name: 'periodo',
          label: 'Período',
          required: true,
        }}
      />
    );

    const props = formItemMock.mock.calls[0][0];

    expect(props.name).toBe('periodo');
    expect(props.label).toBe('Período');
    expect(props.required).toBe(true);
  });

  it('deve repassar as propriedades do RangePicker', () => {
    const onChange = jest.fn();

    render(
      <DatePickerPeriodo
        rangerPickerProps={{
          allowClear: false,
          disabled: true,
          onChange,
        }}
      />
    );

    const props = rangePickerMock.mock.calls[0][0];

    expect(props.allowClear).toBe(false);
    expect(props.disabled).toBe(true);
    expect(props.onChange).toBe(onChange);
  });

  it('deve utilizar o id padrão', () => {
    render(<DatePickerPeriodo />);

    expect(screen.getByTestId('range-picker')).toHaveAttribute(
      'id',
      'rangerPicker'
    );
  });

  it('deve utilizar o formato DD/MM/YYYY', () => {
    render(<DatePickerPeriodo />);

    const props = rangePickerMock.mock.calls[0][0];

    expect(props.format).toBe('DD/MM/YYYY');
  });

  it('deve definir largura de 100%', () => {
    render(<DatePickerPeriodo />);

    const props = rangePickerMock.mock.calls[0][0];

    expect(props.style).toEqual({
      width: '100%',
    });
  });

  it('deve repassar o locale', () => {
    render(<DatePickerPeriodo />);

    const props = rangePickerMock.mock.calls[0][0];

    expect(props.locale).toBeDefined();
  });
});