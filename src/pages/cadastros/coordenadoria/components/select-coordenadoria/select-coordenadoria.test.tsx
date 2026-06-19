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
  value: jest.fn().mockImplementation(query => ({
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
  });

  it('deve renderizar o select', () => {
    renderComponent();

    expect(
      screen.getByRole('combobox'),
    ).toBeInTheDocument();
  });

  it('deve pesquisar após debounce', async () => {
    renderComponent();

    const input =
      screen.getByRole('combobox');

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
  });

  it('deve cancelar timeout anterior', async () => {
    renderComponent();

    const clearSpy = jest.spyOn(
      window,
      'clearTimeout',
    );

    const input =
      screen.getByRole('combobox');

    fireEvent.change(input, {
      target: {
        value: 'a',
      },
    });

    fireEvent.change(input, {
      target: {
        value: 'ab',
      },
    });

    act(() => {
      jest.advanceTimersByTime(600);
    });

    expect(clearSpy).toHaveBeenCalled();
  });

  it('deve carregar próxima página ao chegar no final', async () => {
    renderComponent();

    await waitFor(() =>
      expect(listarMock).toHaveBeenCalled(),
    );

    const selector = document.querySelector(
      '.ant-select-dropdown',
    );

    if (!selector) return;

    fireEvent.scroll(selector, {
      target: {
        scrollTop: 500,
        offsetHeight: 500,
        scrollHeight: 900,
      },
    });

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalledTimes(
        2,
      );
    });

    expect(listarMock).toHaveBeenLastCalledWith({
      nome: '',
      numeroPagina: 2,
      numeroRegistros: 15,
    });
  });

  it('não deve carregar próxima página quando não existir mais páginas', async () => {
    listarMock.mockResolvedValue({
      sucesso: true,
      dados: {
        items: [],
        totalPaginas: 1,
      },
    });

    renderComponent();

    await waitFor(() =>
      expect(listarMock).toHaveBeenCalled(),
    );

    const selector = document.querySelector(
      '.ant-select-dropdown',
    );

    if (!selector) return;

    fireEvent.scroll(selector, {
      target: {
        scrollTop: 400,
        offsetHeight: 400,
        scrollHeight: 700,
      },
    });

    expect(listarMock).toHaveBeenCalledTimes(
      1,
    );
  });

  it('não deve atualizar lista quando serviço retornar sucesso=false', async () => {
    listarMock.mockResolvedValue({
      sucesso: false,
    });

    renderComponent();

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalled();
    });

    expect(
      screen.getByRole('combobox'),
    ).toBeInTheDocument();
  });

  it('deve aceitar selectProps', () => {
    renderComponent({
      selectProps: {
        disabled: true,
      },
    });

    expect(
      screen.getByRole('combobox'),
    ).toBeDisabled();
  });

  it('deve aceitar formItemProps', () => {
    renderComponent({
      formItemProps: {
        label: 'Coordenadoria',
        name: 'coordenadoria',
      },
    });

    expect(
      screen.getByText('Coordenadoria'),
    ).toBeInTheDocument();
  });
});