/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { Form } from 'antd';
import DatePickerMultiplos from './index';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
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

jest.mock('antd/es/date-picker/locale/pt_BR', () => ({}));

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Form.useFormInstance };
});

const renderComponent = (initialValues = { datas: [{}] }, props = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <DatePickerMultiplos disabledDate={() => false} onchange={jest.fn()} {...props} />
    </Form>,
  );
};

describe('DatePickerMultiplos', () => {
  it('renderiza a primeira linha com os campos de data e horário', () => {
    renderComponent();

    expect(screen.getByText('Data Inicial')).toBeInTheDocument();
    expect(screen.getByText('Hora de início e Fim')).toBeInTheDocument();
  });

  it('exibe o botão de adicionar na primeira linha', () => {
    const { container } = renderComponent();

    expect(container.querySelector('button')).toBeInTheDocument();
  });

  it('adiciona uma nova linha ao clicar no botão de adicionar', () => {
    const { container } = renderComponent();

    const addButton = container.querySelector('button') as HTMLElement;
    fireEvent.click(addButton);

    expect(screen.getAllByText('Data Inicial')).toHaveLength(2);
  });

  it('remove uma linha ao clicar no ícone de remover', () => {
    const { container } = renderComponent({ datas: [{}, {}] });

    expect(screen.getAllByText('Data Inicial')).toHaveLength(2);

    const svgs = container.querySelectorAll('svg');
    const removeIcon = svgs[svgs.length - 1] as unknown as HTMLElement;
    fireEvent.click(removeIcon);

    expect(screen.getAllByText('Data Inicial')).toHaveLength(1);
  });

  it('chama onchange ao alterar a data', () => {
    const onchange = jest.fn();
    const { container } = renderComponent(undefined, { onchange });

    const dateInput = container.querySelector('input[id^="CF_INPUT_DATA_"]') as HTMLElement;
    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, { target: { value: '01/01/2025' } });
    fireEvent.keyDown(dateInput, { key: 'Enter', code: 'Enter' });

    expect(onchange).toHaveBeenCalled();
  });
});
