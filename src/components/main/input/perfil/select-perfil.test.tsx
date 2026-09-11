/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectPerfil from './select-perfil';
import { obterGruposPerfis } from '../../../../core/services/grupo-service';

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

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Form.useFormInstance };
});

jest.mock('~/core/services/grupo-service', () => ({
  obterGruposPerfis: jest.fn(),
}));

jest.mock('~/components/lib/inputs/select', () => ({
  __esModule: true,
  default: ({ options, onChange, placeholder }: any) => (
    <select
      aria-label={placeholder}
      onChange={(event) => onChange?.({ value: event.target.value })}
    >
      <option value='' />
      {options?.map((option: any) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
}));

const obterGruposPerfisMock = obterGruposPerfis as jest.Mock;

const renderComponent = (initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <SelectPerfil />
      <Form.Item name='dreId'>
        <input />
      </Form.Item>
    </Form>,
  );
};

describe('SelectPerfil', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('busca os grupos de perfil ao montar', async () => {
    obterGruposPerfisMock.mockResolvedValue({ sucesso: true, dados: [] });

    renderComponent();

    await waitFor(() => {
      expect(obterGruposPerfisMock).toHaveBeenCalled();
    });
  });

  it('renderiza o campo corretamente', () => {
    const { container } = renderComponent();

    expect(container.querySelector('label[for="perfil"]')).toHaveTextContent('Perfil');
  });

  it('renderiza as opções retornadas pelo serviço', async () => {
    obterGruposPerfisMock.mockResolvedValue({
      sucesso: true,
      dados: [
        { id: 1, nome: 'Perfil 1' },
        { id: 2, nome: 'Perfil 2' },
      ],
    });

    const { getByLabelText } = renderComponent();

    await waitFor(() => {
      expect(obterGruposPerfisMock).toHaveBeenCalled();
    });

    const select = getByLabelText('Selecione o Perfil') as HTMLSelectElement;

    expect(select.querySelectorAll('option')).toHaveLength(3);
  });

  it('não atualiza a lista quando a API falha', async () => {
    obterGruposPerfisMock.mockResolvedValue({ sucesso: false, dados: [] });

    const { getByLabelText } = renderComponent();

    await waitFor(() => {
      expect(obterGruposPerfisMock).toHaveBeenCalled();
    });

    const select = getByLabelText('Selecione o Perfil') as HTMLSelectElement;
    expect(select.querySelectorAll('option')).toHaveLength(1);
  });

  it('limpa o campo dreId ao alterar o perfil selecionado', async () => {
    obterGruposPerfisMock.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, nome: 'Perfil 1' }],
    });

    const { container } = renderComponent();

    await waitFor(() => {
      expect(obterGruposPerfisMock).toHaveBeenCalled();
    });

    const dreInput = container.querySelector('input[id="dreId"]') as HTMLInputElement;
    fireEvent.change(dreInput, { target: { value: '10' } });
    expect(dreInput.value).toBe('10');

    const select = container.querySelector('select') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: '1' } });

    await waitFor(() => {
      const updatedDreInput = container.querySelector('input[id="dreId"]') as HTMLInputElement;
      expect(updatedDreInput.value).toBe('');
    });
  });
});
