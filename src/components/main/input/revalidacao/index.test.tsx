/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { Form } from 'antd';
import SelectRevalidacao from './index';

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

jest.mock('~/components/lib/inputs/select', () => {
  return {
    __esModule: true,
    default: ({
      options,
      placeholder,
      id,
      onChange,
    }: {
      options: { label: string; value: string }[];
      placeholder: string;
      id: string;
      onChange?: (value: string) => void;
    }) => (
      <select
        aria-label={placeholder}
        id={id}
        onChange={(event) => onChange?.(event.target.value)}
      >
        <option value=''></option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

const renderComponent = (onRevalidacaoChange?: (value: boolean) => void) => {
  return render(
    <Form>
      <SelectRevalidacao onRevalidacaoChange={onRevalidacaoChange} />
    </Form>,
  );
};

describe('SelectRevalidacao', () => {
  it('renderiza o rótulo "Revalidação"', () => {
    const { container } = renderComponent();
    expect(container.querySelector('label[for="revalidacao"]')).toHaveTextContent('Revalidação');
  });

  it('renderiza as opções Sim e Não', () => {
    const { getByText } = renderComponent();
    expect(getByText('Sim')).toBeInTheDocument();
    expect(getByText('Não')).toBeInTheDocument();
  });

  it('chama onRevalidacaoChange com true ao selecionar Sim', async () => {
    const onRevalidacaoChange = jest.fn();
    const { getByLabelText } = renderComponent(onRevalidacaoChange);
    await act(async () => {
      fireEvent.change(getByLabelText('Revalidação'), { target: { value: 'true' } });
    });
    expect(onRevalidacaoChange).toHaveBeenCalledWith(true);
  });

  it('chama onRevalidacaoChange com false ao selecionar Não', async () => {
    const onRevalidacaoChange = jest.fn();
    const { getByLabelText } = renderComponent(onRevalidacaoChange);
    await act(async () => {
      fireEvent.change(getByLabelText('Revalidação'), { target: { value: 'false' } });
    });
    expect(onRevalidacaoChange).toHaveBeenCalledWith(false);
  });
});
