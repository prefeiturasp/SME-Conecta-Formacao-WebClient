/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Form } from 'antd';
import { SecaoInformacoesAdicionais } from './index';

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

const renderComForm = (props?: { disabled?: boolean }) =>
  render(
    <Form>
      <SecaoInformacoesAdicionais {...props} />
    </Form>,
  );

describe('SecaoInformacoesAdicionais', () => {
  test('DadoComponenteRenderizado_QuandoMontado_EntaoTituloInformacoesAdicionaisVisivel', () => {
    // Arrange / Act
    renderComForm();

    // Assert
    expect(screen.getByText('Informações adicionais')).toBeInTheDocument();
  });

  test('DadoComponenteRenderizado_QuandoMontado_EntaoTextoAjudaCampoOpcionalVisivel', () => {
    // Arrange / Act
    renderComForm();

    // Assert
    expect(screen.getByText(/Este é um campo opcional\./i)).toBeInTheDocument();
  });

  test('DadoDisabledNaoInformado_QuandoRenderizado_EntaoTextAreaHabilitada', () => {
    // Arrange / Act
    renderComForm();
    const textarea = screen.getByPlaceholderText('Digite as informações adicionais...');

    // Assert
    expect(textarea).not.toBeDisabled();
  });

  test('DadoDisabledTrue_QuandoRenderizado_EntaoTextAreaDesabilitada', () => {
    // Arrange / Act
    renderComForm({ disabled: true });
    const textarea = screen.getByPlaceholderText('Digite as informações adicionais...');

    // Assert
    expect(textarea).toBeDisabled();
  });

  test('DadoDisabledFalse_QuandoRenderizado_EntaoTextAreaHabilitada', () => {
    // Arrange / Act
    renderComForm({ disabled: false });
    const textarea = screen.getByPlaceholderText('Digite as informações adicionais...');

    // Assert
    expect(textarea).not.toBeDisabled();
  });
});
