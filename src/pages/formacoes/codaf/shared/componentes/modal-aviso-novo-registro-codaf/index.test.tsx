/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalAvisoNovoRegistroCodaf } from './index';

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

beforeEach(() => jest.clearAllMocks());

describe('ModalAvisoNovoRegistroCodaf', () => {
  const mockOnClose = jest.fn();
  const mockOnClickInscricoes = jest.fn();
  const mockOnClickContinuar = jest.fn();

  test('DadoVisivelFalse_QuandoRenderizado_EntaoConteudoModalNaoVisivel', () => {
    // Arrange / Act
    render(
      <ModalAvisoNovoRegistroCodaf
        visivel={false}
        onClose={mockOnClose}
        onClickInscricoes={mockOnClickInscricoes}
        onClickContinuar={mockOnClickContinuar}
      />,
    );

    // Assert
    expect(screen.queryByText(/Antes de iniciar o registro CODAF/i)).not.toBeInTheDocument();
  });

  test('DadoVisivelTrue_QuandoRenderizado_EntaoTextoAvisoVisivel', () => {
    // Arrange / Act
    render(
      <ModalAvisoNovoRegistroCodaf
        visivel={true}
        onClose={mockOnClose}
        onClickInscricoes={mockOnClickInscricoes}
        onClickContinuar={mockOnClickContinuar}
      />,
    );

    // Assert
    expect(
      screen.getByText(/Antes de iniciar o registro CODAF/i),
    ).toBeInTheDocument();
  });

  test('DadoModalAberto_QuandoClicarEmIrParaInscricoes_EntaoChamaOnClickInscricoes', () => {
    // Arrange
    render(
      <ModalAvisoNovoRegistroCodaf
        visivel={true}
        onClose={mockOnClose}
        onClickInscricoes={mockOnClickInscricoes}
        onClickContinuar={mockOnClickContinuar}
      />,
    );

    // Act
    fireEvent.click(screen.getByText('Ir para tela de inscrições'));

    // Assert
    expect(mockOnClickInscricoes).toHaveBeenCalledTimes(1);
  });

  test('DadoModalAberto_QuandoClicarEmContinuarRegistro_EntaoChamaOnClickContinuar', () => {
    // Arrange
    render(
      <ModalAvisoNovoRegistroCodaf
        visivel={true}
        onClose={mockOnClose}
        onClickInscricoes={mockOnClickInscricoes}
        onClickContinuar={mockOnClickContinuar}
      />,
    );

    // Act
    fireEvent.click(screen.getByText('Continuar registro'));

    // Assert
    expect(mockOnClickContinuar).toHaveBeenCalledTimes(1);
  });

  test('DadoModalAberto_QuandoFechadoPeloX_EntaoChamaOnClose', () => {
    // Arrange
    render(
      <ModalAvisoNovoRegistroCodaf
        visivel={true}
        onClose={mockOnClose}
        onClickInscricoes={mockOnClickInscricoes}
        onClickContinuar={mockOnClickContinuar}
      />,
    );

    // Act
    const closeButton = document.querySelector('.ant-modal-close');
    if (closeButton) fireEvent.click(closeButton);

    // Assert
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
