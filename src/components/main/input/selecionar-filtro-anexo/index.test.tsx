/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import { Form } from 'antd';
import SelectFormacaoComAnexo from './index';

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
      options: { label: string; value: string | null }[];
      placeholder: string;
      id: string;
      onChange?: (value?: string) => void;
    }) => (
      <select
        aria-label={placeholder}
        id={id}
        onChange={(event) => onChange?.(event.target.value || undefined)}
      >
        {options.map((option) => (
          <option key={String(option.value)} value={option.value ?? ''}>
            {option.label}
          </option>
        ))}
      </select>
    ),
  };
});

const renderComponent = (onChange?: (value: boolean | undefined) => void) => {
  return render(
    <Form>
      <SelectFormacaoComAnexo onChange={onChange} />
    </Form>,
  );
};

describe('SelectFormacaoComAnexo', () => {
  it('renderiza o rótulo "Formação com anexos?"', () => {
    const { container } = renderComponent();
    expect(container.querySelector('label[for="possuiAnexo"]')).toHaveTextContent(
      'Formação com anexos?',
    );
  });

  it('renderiza as opções Todas, Com anexos e Sem anexos', () => {
    const { getByText } = renderComponent();
    expect(getByText('Todas')).toBeInTheDocument();
    expect(getByText('Com anexos')).toBeInTheDocument();
    expect(getByText('Sem anexos')).toBeInTheDocument();
  });

  it('chama onChange com true ao selecionar "Com anexos"', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderComponent(onChange);
    await act(async () => {
      fireEvent.change(getByLabelText('Selecione'), { target: { value: 'true' } });
    });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('chama onChange com false ao selecionar "Sem anexos"', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderComponent(onChange);
    await act(async () => {
      fireEvent.change(getByLabelText('Selecione'), { target: { value: 'false' } });
    });
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('chama onChange com undefined ao selecionar "Todas"', async () => {
    const onChange = jest.fn();
    const { getByLabelText } = renderComponent(onChange);
    await act(async () => {
      fireEvent.change(getByLabelText('Selecione'), { target: { value: '' } });
    });
    expect(onChange).toHaveBeenCalledWith(undefined);
  });
});
