/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { Form } from 'antd';
import SelectPublicoAlvo from './index';
import { obterPublicoAlvo } from '../../../../core/services/cargo-funcao-service';
import { obterPublicoAlvoPublico } from '../../../../core/services/area-publica-service';

jest.mock('~/core/services/cargo-funcao-service', () => ({
  obterPublicoAlvo: jest.fn(),
}));

jest.mock('~/core/services/area-publica-service', () => ({
  obterPublicoAlvoPublico: jest.fn(),
}));

jest.mock('antd/es/tooltip', () => {
  const actual = jest.requireActual('antd');
  return { __esModule: true, default: actual.Tooltip };
});

jest.mock('~/components/lib/inputs/select', () => {
  return {
    __esModule: true,
    default: ({ options, placeholder, id }: { options: { label: string; value: string }[]; placeholder: string; id: string }) => (
      <select aria-label={placeholder} id={id} multiple>
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

const mockedObterPublicoAlvo = obterPublicoAlvo as jest.Mock;
const mockedObterPublicoAlvoPublico = obterPublicoAlvoPublico as jest.Mock;

const renderComponent = (props: Partial<React.ComponentProps<typeof SelectPublicoAlvo>> = {}) => {
  return render(
    <Form>
      <SelectPublicoAlvo {...props} />
    </Form>,
  );
};

describe('SelectPublicoAlvo', () => {
  beforeEach(() => {
    mockedObterPublicoAlvo.mockReset();
    mockedObterPublicoAlvoPublico.mockReset();
  });

  it('busca as opções via obterPublicoAlvo por padrão', async () => {
    mockedObterPublicoAlvo.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Professor' }],
    });
    renderComponent();
    await waitFor(() => expect(mockedObterPublicoAlvo).toHaveBeenCalledTimes(1));
    expect(mockedObterPublicoAlvoPublico).not.toHaveBeenCalled();
  });

  it('busca as opções via obterPublicoAlvoPublico quando areaPublica é true', async () => {
    mockedObterPublicoAlvoPublico.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '2', nome: 'Coordenador' }],
    });
    renderComponent({ areaPublica: true });
    await waitFor(() => expect(mockedObterPublicoAlvoPublico).toHaveBeenCalledTimes(1));
    expect(mockedObterPublicoAlvo).not.toHaveBeenCalled();
  });

  it('renderiza as opções retornadas pelo serviço', async () => {
    mockedObterPublicoAlvo.mockResolvedValue({
      sucesso: true,
      dados: [{ id: '1', nome: 'Professor' }],
    });
    const { findByText } = renderComponent();
    expect(await findByText('Professor')).toBeInTheDocument();
  });

  it('não renderiza opções quando o serviço falha', async () => {
    mockedObterPublicoAlvo.mockResolvedValue({ sucesso: false, dados: [] });
    const { container } = renderComponent();
    await waitFor(() => expect(mockedObterPublicoAlvo).toHaveBeenCalledTimes(1));
    expect(container.querySelectorAll('option')).toHaveLength(0);
  });

  it('renderiza o rótulo "Público alvo"', () => {
    mockedObterPublicoAlvo.mockResolvedValue({ sucesso: true, dados: [] });
    const { container } = renderComponent();
    expect(container.querySelector('label[for="publicosAlvo"]')).toHaveTextContent('Público alvo');
  });
});
