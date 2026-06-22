/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { Form } from 'antd';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import { SelectCoordenadoria } from './select-coordenadoria';

import {
  listarCoordenadorias,
} from '../../../../../core/services/coordenadoria-service';

jest.useFakeTimers();

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

// Mock para evitar que o Select do Ant Design quebre o parser do JSDOM 
// Injetando uma estrutura limpa de DOM
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Select: Object.assign(
      ({ children, onChange, onSearch, onPopupScroll, placeholder, ...props }: any) => (
        <div data-testid="mock-select-wrapper">
          <input
            role="combobox"
            placeholder={placeholder}
            disabled={props.disabled}
            onChange={(e) => {
              if (onChange) onChange(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
          />
          <div
            className="ant-select-dropdown"
            onScroll={(e) => {
              if (onPopupScroll) onPopupScroll(e);
            }}
          >
            {children}
          </div>
        </div>
      ),
      {
        Option: ({ children, value }: any) => (
          <div data-testid="select-option" data-value={value}>
            {children}
          </div>
        ),
      }
    ),
  };
});

jest.mock(
  '~/components/main/empty',
  () => () => (
    <div data-testid="empty">
      vazio
    </div>
  ),
);

jest.mock(
  '~/core/services/coordenadoria-service',
  () => ({
    listarCoordenadorias: jest.fn(),
  }),
);

const listarMock =
  listarCoordenadorias as jest.Mock;

////////////////////////////////////////////////////////////////////////////////

const renderComponent = (props = {}) =>
  render(
    <Form>
      <SelectCoordenadoria
        formItemProps={{
          name: 'coordenadoria',
        }}
        {...props}
      />
    </Form>,
  );

////////////////////////////////////////////////////////////////////////////////

describe('SelectCoordenadoria', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    listarMock.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [
          {
            id: 1,
            nome: 'Pedagógica',
            sigla: 'PED',
          },
          {
            id: 2,
            nome: 'Tecnologia',
            sigla: '',
          },
        ],
        totalPaginas: 2,
      },
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('deve carregar dados ao montar', async () => {
    renderComponent();

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalledTimes(1);
    });

    expect(listarMock).toHaveBeenCalledWith({
      nome: '',
      numeroPagina: 1,
      numeroRegistros: 15,
    });

    // Flush promises finais
    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve renderizar o select', async () => {
    renderComponent();

    expect(
      screen.getByRole('combobox'),
    ).toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve pesquisar após debounce', async () => {
    renderComponent();

    const input = screen.getByRole('combobox');

    fireEvent.change(input, {
      target: {
        value: 'ped',
      },
    });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalledTimes(2);
    });

    expect(listarMock).toHaveBeenLastCalledWith({
      nome: 'ped',
      numeroPagina: 1,
      numeroRegistros: 15,
    });

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve cancelar timeout anterior', async () => {
    renderComponent();

    const clearSpy = jest.spyOn(
      window,
      'clearTimeout',
    );

    const input = screen.getByRole('combobox');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(clearSpy).toHaveBeenCalled();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve carregar próxima página ao chegar no final', async () => {
    renderComponent();

    // GARANTIA DE ESTADO: Espera os itens renderizarem na tela
    // Isso garante que loading = false e hasMore = true
    await waitFor(() => {
      expect(screen.getByText('PED - Pedagógica')).toBeInTheDocument();
    });

    const selector = document.querySelector('.ant-select-dropdown') as HTMLElement;
    if (!selector) return;

    // Forçamos o DOM a simular as dimensões do final do scroll
    Object.defineProperty(selector, 'scrollTop', { value: 500, configurable: true });
    Object.defineProperty(selector, 'clientHeight', { value: 500, configurable: true });
    Object.defineProperty(selector, 'offsetHeight', { value: 500, configurable: true });
    Object.defineProperty(selector, 'scrollHeight', { value: 1000, configurable: true });

    fireEvent.scroll(selector);

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalledTimes(2);
    });

    expect(listarMock).toHaveBeenLastCalledWith({
      nome: '',
      numeroPagina: 2,
      numeroRegistros: 15,
    });

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('não deve carregar próxima página quando não existir mais páginas', async () => {
    listarMock.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [{ id: 99, nome: 'Único', sigla: 'UNI' }],
        totalPaginas: 1,
      },
    });

    renderComponent();

    // GARANTIA DE ESTADO: Espera o item único para garantir que
    // o processamento da promise acabou (loading = false, hasMore = false)
    await waitFor(() => {
      expect(screen.getByText('UNI - Único')).toBeInTheDocument();
    });

    const selector = document.querySelector('.ant-select-dropdown') as HTMLElement;
    if (!selector) return;

    // Simula scroll até o fim
    Object.defineProperty(selector, 'scrollTop', { value: 500, configurable: true });
    Object.defineProperty(selector, 'clientHeight', { value: 500, configurable: true });
    Object.defineProperty(selector, 'offsetHeight', { value: 500, configurable: true });
    Object.defineProperty(selector, 'scrollHeight', { value: 1000, configurable: true });

    fireEvent.scroll(selector);

    // O serviço ainda deve ter sido chamado apenas 1 vez (da montagem)
    expect(listarMock).toHaveBeenCalledTimes(1);

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('não deve atualizar lista quando serviço retornar sucesso=false', async () => {
    listarMock.mockResolvedValue({
      sucesso: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalled();
    });

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve aceitar selectProps', async () => {
    renderComponent({
      selectProps: {
        disabled: true,
      },
    });

    expect(screen.getByRole('combobox')).toBeDisabled();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('deve aceitar formItemProps', async () => {
    renderComponent({
      formItemProps: {
        label: 'Coordenadoria',
        name: 'coordenadoria',
      },
    });

    expect(screen.getByText('Coordenadoria')).toBeInTheDocument();

    await act(async () => {
      await Promise.resolve();
    });
  });
});