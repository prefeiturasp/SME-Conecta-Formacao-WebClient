/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectResponsavelDf from './index';
import { obterUsuariosAdminDf } from '../../../../core/services/funcionario-service';

jest.mock('~/core/services/funcionario-service', () => ({
  obterUsuariosAdminDf: jest.fn(),
}));

jest.mock('antd/es/form/hooks/useFormInstance', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Form.useFormInstance };
});

jest.mock('~/components/lib/inputs/select', () => {
  return {
    __esModule: true,
    default: ({ options, placeholder, id }: { options: { label: string; value: string }[]; placeholder: string; id: string }) => (
      <select aria-label={placeholder} id={id}>
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

const mockedObterUsuariosAdminDf = obterUsuariosAdminDf as jest.Mock;

const renderComponent = (initialValues = {}) => {
  return render(
    <Form initialValues={initialValues}>
      <SelectResponsavelDf />
    </Form>,
  );
};

describe('SelectResponsavelDf', () => {
  beforeEach(() => {
    mockedObterUsuariosAdminDf.mockReset();
  });

  it('busca os dados ao montar', async () => {
    mockedObterUsuariosAdminDf.mockResolvedValue({ sucesso: true, dados: [] });
    renderComponent();
    await waitFor(() => expect(mockedObterUsuariosAdminDf).toHaveBeenCalledTimes(1));
  });

  it('renderiza o rótulo "Responsável DF"', () => {
    mockedObterUsuariosAdminDf.mockResolvedValue({ sucesso: true, dados: [] });
    const { container } = renderComponent();
    expect(container.querySelector('label[for="rfResponsavelDf"]')).toHaveTextContent(
      'Responsável DF',
    );
  });

  it('renderiza as opções retornadas pelo serviço', async () => {
    mockedObterUsuariosAdminDf.mockResolvedValue({
      sucesso: true,
      dados: [{ login: 'rf1', nome: 'Fulano' }],
    });
    const { findByText } = renderComponent();
    expect(await findByText('Fulano')).toBeInTheDocument();
  });

  it('não renderiza opções quando o serviço falha', async () => {
    mockedObterUsuariosAdminDf.mockResolvedValue({ sucesso: false, dados: [] });
    const { container } = renderComponent();
    await waitFor(() => expect(mockedObterUsuariosAdminDf).toHaveBeenCalledTimes(1));
    expect(container.querySelectorAll('option')).toHaveLength(1);
  });

  it('limpa o valor selecionado quando ele não existe mais nas opções', async () => {
    mockedObterUsuariosAdminDf.mockResolvedValue({
      sucesso: true,
      dados: [{ login: 'rf2', nome: 'Ciclano' }],
    });
    const { container } = renderComponent({ rfResponsavelDf: 'rf1' });
    await waitFor(() => {
      const select = container.querySelector(
        'select[id="CF_SELECT_RESPONSAVEL_DF"]',
      ) as HTMLSelectElement;
      expect(select.value).toBe('');
    });
  });
});
