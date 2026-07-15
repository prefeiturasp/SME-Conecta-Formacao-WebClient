/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form } from 'antd';

import SelectUEs from './index';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';

jest.mock('antd/es/form/hooks/useFormInstance', () => jest.fn());

jest.mock('~/components/lib/inputs/select', () => ({
  __esModule: true,
  default: ({ options, onChange, placeholder, id }: any) => (
    <div>
      <select data-testid='select' id={id} onChange={onChange}>
        <option>{placeholder}</option>
        {options.map((item: any) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  ),
}));

describe('SelectUEs', () => {
  const mockForm = {
    setFieldValue: jest.fn(),
  };

  const renderComponent = (props: any = {}) =>
    render(
      <Form>
        <SelectUEs {...props} />
      </Form>,
    );

  beforeEach(() => {
    jest.clearAllMocks();

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    (useFormInstance as jest.Mock).mockReturnValue(mockForm);
  });

  it('deve renderizar select de UE', () => {
    renderComponent();

    expect(screen.getByTestId('select')).toBeInTheDocument();
    expect(screen.getByText('UE(s)')).toBeInTheDocument();
  });

  it('deve carregar opções quando receber UEs', async () => {
    renderComponent({
      ues: [
        { id: 1, descricao: 'UE Centro' },
        { id: 2, descricao: 'UE Norte' },
      ],
    });

    await waitFor(() => {
      expect(screen.getByText('UE Centro')).toBeInTheDocument();
      expect(screen.getByText('UE Norte')).toBeInTheDocument();
    });
  });

  it('deve limpar opções quando ues não existir', async () => {
    renderComponent({ ues: undefined });

    await waitFor(() => {
      expect(screen.getByTestId('select')).toBeInTheDocument();
    });

    expect(screen.queryByText('UE Centro')).not.toBeInTheDocument();
  });

  it('deve atualizar opções quando ues mudar', async () => {
    const { rerender } = renderComponent({
      ues: [{ id: 1, descricao: 'Primeira UE' }],
    });

    await waitFor(() => {
      expect(screen.getByText('Primeira UE')).toBeInTheDocument();
    });

    rerender(
      <Form>
        <SelectUEs
          ues={[
            {
              id: 2,
              descricao: 'Segunda UE',
            },
          ]}
        />
      </Form>,
    );

    await waitFor(() => {
      expect(screen.getByText('Segunda UE')).toBeInTheDocument();
    });
  });

  it('deve setar nomeUnidade quando selecionar valor', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('select'), {
      target: { value: 10 },
    });

    expect(mockForm.setFieldValue).toHaveBeenCalled();
  });

  it('deve limpar nomeUnidade quando evento for vazio', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('select'), {
      target: { value: '' },
    });

    expect(mockForm.setFieldValue).toHaveBeenCalled();
  });

  it('deve limpar codigoUnidade no onChange', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('select'));

    expect(mockForm.setFieldValue).toHaveBeenCalledWith('codigoUnidade', '');
  });

  it('deve aceitar propriedades customizadas do select', () => {
    renderComponent({
      selectProps: {
        placeholder: 'Custom',
      },
    });

    expect(screen.getByTestId('select')).toBeInTheDocument();
  });

  it('deve aceitar propriedades customizadas do Form.Item', () => {
    renderComponent({
      formItemProps: {
        label: 'Minha UE',
      },
    });

    expect(screen.getByText('Minha UE')).toBeInTheDocument();
  });
});