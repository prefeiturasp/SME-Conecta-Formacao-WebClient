/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { CamposBaseFormularioCodaf } from './index';

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
  const Form = ({ children }: any) => <form>{children}</form>;
  Form.Item = ({ label, children }: any) => (
    <div>
      {label && <span>{label}</span>}
      {children}
    </div>
  );
  return {
    ...actual,
    Form,
  };
});

describe('CamposBaseFormularioCodaf', () => {
  test('deve renderizar os campos padrão, disparar eventos e renderizar children', () => {
    const onChangeCodigoFormacao = jest.fn();
    const onBlurCodigoFormacao = jest.fn();

    render(
      <CamposBaseFormularioCodaf
        onChangeCodigoFormacao={onChangeCodigoFormacao}
        onBlurCodigoFormacao={onBlurCodigoFormacao}
        codigoFormacaoDisabled={false}
      >
        <div data-testid='campo-turma-slot'>Turma Slot</div>
      </CamposBaseFormularioCodaf>,
    );

    expect(screen.getByText('Nome da formação')).toBeInTheDocument();
    expect(screen.getByText('Código da formação')).toBeInTheDocument();
    expect(screen.getByText('Número de homologação')).toBeInTheDocument();
    expect(screen.getByTestId('campo-turma-slot')).toBeInTheDocument();

    const inputCodigo = screen.getByPlaceholderText('Código da formação');
    expect(inputCodigo).not.toBeDisabled();
    fireEvent.change(inputCodigo, { target: { value: '446' } });
    fireEvent.blur(inputCodigo, { target: { value: '446' } });

    expect(onChangeCodigoFormacao).toHaveBeenCalledWith('446');
    expect(onBlurCodigoFormacao).toHaveBeenCalledWith('446');
  });

  test('deve aceitar labelNumeroHomologacao customizado e desabilitar código da formação', () => {
    render(
      <CamposBaseFormularioCodaf
        onChangeCodigoFormacao={jest.fn()}
        onBlurCodigoFormacao={jest.fn()}
        codigoFormacaoDisabled
        labelNumeroHomologacao='Código de homologação'
      />,
    );

    expect(screen.getByText('Código de homologação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Código da formação')).toBeDisabled();
  });
});
