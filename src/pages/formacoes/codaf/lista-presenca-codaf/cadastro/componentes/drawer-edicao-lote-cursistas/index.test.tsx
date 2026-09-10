/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { DrawerEdicaoLoteCursistas } from './index';
import { calcularAprovacao } from '../../../../../../../core/utils/codaf-utils';
import { RegrasAprovacaoCursistaCodafDto } from '../../../../../../../core/dto/cursista-dto';

type SelectOption = { label: string; value: string };

type SelectMockProps = {
  options?: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
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

jest.mock('~/core/utils/codaf-utils', () => ({
  calcularAprovacao: jest.fn(),
}));

jest.mock('antd', () => {
  const actual = jest.requireActual('antd');

  const Select = ({ options = [], placeholder, value, onChange, disabled }: SelectMockProps) => (
    <select
      role='combobox'
      aria-label={placeholder}
      value={value === undefined ? '' : value}
      disabled={disabled}
      onChange={(event) => {
        const selecionado = options.find((option) => option.value === event.target.value);
        onChange?.(selecionado ? selecionado.value : (undefined as unknown as string));
      }}
    >
      <option value='' disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
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

const calcularAprovacaoMock = calcularAprovacao as jest.Mock;

describe('DrawerEdicaoLoteCursistas (lista-presenca-codaf)', () => {
  const onClose = jest.fn();
  const onConfirmar = jest.fn();

  const regrasBaseMock: RegrasAprovacaoCursistaCodafDto = {
    frequenciaMinima: 75,
    conceitosAceitos: ['S', 'P'],
    exigeAtividadeObrigatoria: true,
    possuiRegraAvaliacao: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = (props: Partial<React.ComponentProps<typeof DrawerEdicaoLoteCursistas>> = {}) =>
    render(
      <DrawerEdicaoLoteCursistas
        open
        modo='registrar'
        quantidadeSelecionados={3}
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
        {...props}
      />,
    );

  const selects = () => screen.getAllByRole('combobox');

  it('não exibe o conteúdo quando o drawer está fechado', () => {
    renderizar({ open: false });

    expect(screen.queryByText('Registrar dados')).not.toBeInTheDocument();
  });

  it('exibe título, texto e botão para o modo registrar', () => {
    renderizar({ modo: 'registrar', quantidadeSelecionados: 3 });

    expect(screen.getByText('Registrar dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
    expect(
      screen.getByText('Os valores informados serão aplicados a todos os 3 cursistas selecionados.'),
    ).toBeInTheDocument();
  });

  it('exibe título, texto e aviso de substituição para o modo editar', () => {
    renderizar({ modo: 'editar' });

    expect(screen.getByText('Editar dados')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
    expect(
      screen.getByText(/independentemente de possuírem ou não informações já preenchidas/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/substituirão as informações atuais dos cursistas selecionados/i),
    ).toBeInTheDocument();
  });

  it('mantém o botão de confirmação desabilitado enquanto os campos não estiverem todos preenchidos', () => {
    renderizar();

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
  });

  it('habilita o botão de confirmação após preencher todos os campos', () => {
    renderizar();

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '90' } });
    fireEvent.change(selects()[0], { target: { value: 'S' } });
    fireEvent.change(selects()[1], { target: { value: 'P' } });
    fireEvent.change(selects()[2], { target: { value: 'S' } });

    expect(screen.getByRole('button', { name: 'Registrar' })).toBeEnabled();
  });

  it('chama onConfirmar com os valores convertidos ao confirmar', async () => {
    renderizar();

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '90%' } });
    fireEvent.change(selects()[0], { target: { value: 'S' } });
    fireEvent.change(selects()[1], { target: { value: 'P' } });
    fireEvent.change(selects()[2], { target: { value: 'S' } });

    fireEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => {
      expect(onConfirmar).toHaveBeenCalledWith({
        frequencia: 90,
        atividade: 'S',
        conceitoFinal: 'P',
        aprovado: true,
      });
    });
  });

  it('não chama calcularAprovacao quando não há regras de avaliação', () => {
    renderizar({ regrasAprovacao: undefined });

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '85' } });

    expect(calcularAprovacaoMock).not.toHaveBeenCalled();
  });

  it('preenche automaticamente o campo aprovado quando o motor de regras retorna verdadeiro', async () => {
    calcularAprovacaoMock.mockReturnValue(true);

    renderizar({ regrasAprovacao: regrasBaseMock });

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '90' } });
    fireEvent.change(selects()[0], { target: { value: 'S' } });
    fireEvent.change(selects()[1], { target: { value: 'P' } });

    await waitFor(() => {
      expect(selects()[2]).toHaveValue('S');
    });
  });

  it('preenche automaticamente o campo aprovado quando o motor de regras retorna falso', async () => {
    calcularAprovacaoMock.mockReturnValue(false);

    renderizar({ regrasAprovacao: regrasBaseMock });

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '50' } });
    fireEvent.change(selects()[0], { target: { value: 'N' } });
    fireEvent.change(selects()[1], { target: { value: 'NS' } });

    await waitFor(() => {
      expect(selects()[2]).toHaveValue('N');
    });
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

  it('reseta o formulário quando o drawer é reaberto', () => {
    const { rerender } = renderizar({ open: true });

    fireEvent.change(screen.getByPlaceholderText('Digite a frequência...'), { target: { value: '90' } });

    rerender(
      <DrawerEdicaoLoteCursistas
        open={false}
        modo='registrar'
        quantidadeSelecionados={3}
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
      />,
    );

    rerender(
      <DrawerEdicaoLoteCursistas
        open
        modo='registrar'
        quantidadeSelecionados={3}
        loading={false}
        onClose={onClose}
        onConfirmar={onConfirmar}
      />,
    );

    expect(screen.getByPlaceholderText('Digite a frequência...')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeDisabled();
  });
});
