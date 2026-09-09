/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { DrawerEdicaoLoteCursistas } from './index';

type SelectOption = { label: string; value: boolean };

type SelectMockProps = {
  options?: SelectOption[];
  placeholder?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  disabled?: boolean;
};

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

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');

  const Select = ({ options = [], placeholder, value, onChange, disabled }: SelectMockProps) => (
    <select
      role='combobox'
      aria-label={placeholder}
      value={value === undefined ? '' : String(value)}
      disabled={disabled}
      onChange={(event) => {
        const selecionado = options.find((option) => String(option.value) === event.target.value);
        onChange?.(selecionado ? selecionado.value : undefined as unknown as boolean);
      }}
    >
      <option value='' disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return {
    ...actual,
    Select,
  };
});

describe('DrawerEdicaoLoteCursistas', () => {
  const onClose = jest.fn();
  const onConfirmar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = (props: Partial<React.ComponentProps<typeof DrawerEdicaoLoteCursistas>> = {}) =>
    render(
      <DrawerEdicaoLoteCursistas
        open
        modo='registrar'
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
        {...props}
      />,
    );

  it('não exibe o conteúdo quando o drawer está fechado', () => {
    renderizar({ open: false });

    expect(screen.queryByText('Registrar dados')).not.toBeInTheDocument();
  });

  it('exibe título e texto do botão para o modo registrar', () => {
    renderizar({ modo: 'registrar' });

    expect(screen.getByText('Registrar dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
  });

  it('exibe título e texto do botão para o modo editar', () => {
    renderizar({ modo: 'editar' });

    expect(screen.getByText('Editar dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
  });

  it('mantém o botão de confirmação desabilitado enquanto nenhuma opção for selecionada', () => {
    renderizar();

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
  });

  it('habilita o botão de confirmação após selecionar uma opção', () => {
    renderizar();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'true' } });

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeEnabled();
  });

  it('chama onClose ao clicar em Cancelar', () => {
    renderizar();

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botão Cancelar quando loading é true', () => {
    renderizar({ loading: true });

    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  });

  it('chama onConfirmar com participou true ao selecionar Sim e confirmar', async () => {
    renderizar();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'true' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onConfirmar).toHaveBeenCalledWith({ participou: true });
    });
  });

  it('chama onConfirmar com participou false ao selecionar Não e confirmar', async () => {
    renderizar();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'false' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onConfirmar).toHaveBeenCalledWith({ participou: false });
    });
  });

  it('reseta o formulário quando o drawer é reaberto', () => {
    const { rerender } = renderizar({ open: true });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'true' } });
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeEnabled();

    rerender(
      <DrawerEdicaoLoteCursistas
        open={false}
        modo='registrar'
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
      />,
    );

    rerender(
      <DrawerEdicaoLoteCursistas
        open
        modo='registrar'
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
      />,
    );

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
  });
});
