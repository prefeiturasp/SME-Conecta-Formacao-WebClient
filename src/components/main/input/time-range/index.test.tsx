/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

import { TimePickerPeriodo } from './index';

const formItemMock = jest.fn();
const timePickerRangeMock = jest.fn();

jest.mock('antd', () => {
  const RangePicker = (props: any) => {
    timePickerRangeMock(props);

    return <div data-testid='time-picker-range' id={props.id} />;
  };

  return {
    Form: {
      Item: ({ children, ...props }: any) => {
        formItemMock(props);

        return <div>{children}</div>;
      },
    },
    TimePicker: {
      RangePicker,
    },
  };
});

describe('TimePickerPeriodo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o TimePicker.RangePicker', () => {
    render(<TimePickerPeriodo />);

    expect(screen.getByTestId('time-picker-range')).toBeInTheDocument();
  });

  it('deve repassar as propriedades do Form.Item', () => {
    render(
      <TimePickerPeriodo
        formItemProps={{
          name: 'horaInscricao',
          label: 'Hora de início e fim',
          required: false,
        }}
      />,
    );

    const props = formItemMock.mock.calls[0][0];

    expect(props.name).toBe('horaInscricao');
    expect(props.label).toBe('Hora de início e fim');
    expect(props.required).toBe(false);
  });

  it('deve repassar as propriedades do RangePicker', () => {
    const onChange = jest.fn();

    render(
      <TimePickerPeriodo
        timePickerProps={{
          allowClear: false,
          disabled: true,
          onChange,
        }}
      />,
    );

    const props = timePickerRangeMock.mock.calls[0][0];

    expect(props.allowClear).toBe(false);
    expect(props.disabled).toBe(true);
    expect(props.onChange).toBe(onChange);
  });

  it('deve utilizar o id padrão', () => {
    render(<TimePickerPeriodo />);

    expect(screen.getByTestId('time-picker-range')).toHaveAttribute('id', 'timePickerRange');
  });

  it('deve utilizar o formato HH:mm e placeholders corretos', () => {
    render(<TimePickerPeriodo />);

    const props = timePickerRangeMock.mock.calls[0][0];

    expect(props.format).toBe('HH:mm');
    expect(props.placeholder).toEqual(['Hora inicial', 'Hora final']);
    expect(props.needConfirm).toBe(false);
    expect(props.order).toBe(false);
  });

  it('deve definir largura de 100%', () => {
    render(<TimePickerPeriodo />);

    const props = timePickerRangeMock.mock.calls[0][0];

    expect(props.style).toEqual({
      width: '100%',
    });
  });

  it('deve repassar o locale', () => {
    render(<TimePickerPeriodo />);

    const props = timePickerRangeMock.mock.calls[0][0];

    expect(props.locale).toBeDefined();
  });
});
