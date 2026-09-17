/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { BarraCursistasSelecionados } from './index';

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

describe('BarraCursistasSelecionados', () => {
  const onClickRegistrarDados = jest.fn();
  const onClickEditarDados = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderizar = (props: Partial<React.ComponentProps<typeof BarraCursistasSelecionados>> = {}) =>
    render(
      <BarraCursistasSelecionados
        quantidadeSelecionados={2}
        onClickRegistrarDados={onClickRegistrarDados}
        onClickEditarDados={onClickEditarDados}
        registrarDadosDesabilitado={false}
        editarDadosDesabilitado={false}
        modoEdicao={false}
        {...props}
      />,
    );

  it('exibe a quantidade de cursistas selecionados', () => {
    renderizar({ quantidadeSelecionados: 5 });

    expect(screen.getByText('5 cursistas selecionados')).toBeInTheDocument();
  });

  it('exibe o botão Registrar dados e oculta Editar dados quando não está em modo edição', () => {
    renderizar({ modoEdicao: false });

    expect(screen.getByRole('button', { name: /Registrar dados/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Editar dados/i })).not.toBeInTheDocument();
  });

  it('exibe o botão Editar dados e oculta Registrar dados quando está em modo edição', () => {
    renderizar({ modoEdicao: true });

    expect(screen.getByRole('button', { name: /Editar dados/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Registrar dados/i })).not.toBeInTheDocument();
  });

  it('chama onClickRegistrarDados ao clicar no botão Registrar dados', () => {
    renderizar({ modoEdicao: false });

    fireEvent.click(screen.getByRole('button', { name: /Registrar dados/i }));

    expect(onClickRegistrarDados).toHaveBeenCalledTimes(1);
  });

  it('chama onClickEditarDados ao clicar no botão Editar dados', () => {
    renderizar({ modoEdicao: true });

    fireEvent.click(screen.getByRole('button', { name: /Editar dados/i }));

    expect(onClickEditarDados).toHaveBeenCalledTimes(1);
  });

  it('desabilita o botão Registrar dados quando registrarDadosDesabilitado é true', () => {
    renderizar({ modoEdicao: false, registrarDadosDesabilitado: true });

    expect(screen.getByRole('button', { name: /Registrar dados/i })).toBeDisabled();
  });

  it('desabilita o botão Editar dados quando editarDadosDesabilitado é true', () => {
    renderizar({ modoEdicao: true, editarDadosDesabilitado: true });

    expect(screen.getByRole('button', { name: /Editar dados/i })).toBeDisabled();
  });
});
