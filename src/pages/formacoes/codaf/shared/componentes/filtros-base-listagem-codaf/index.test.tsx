/** @jest-environment jsdom */
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { FiltrosBaseListagemCodaf } from './index';

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

jest.mock('~/components/main/input/area-promotora', () => () => (
  <div data-testid='select-area-promotora-mock' />
));

describe('FiltrosBaseListagemCodaf', () => {
  test('deve renderizar os filtros padrão e acionar callbacks de código da formação', () => {
    const onChangeCodigoFormacao = jest.fn();
    const onBlurCodigoFormacao = jest.fn();

    render(
      <FiltrosBaseListagemCodaf
        onChangeCodigoFormacao={onChangeCodigoFormacao}
        onBlurCodigoFormacao={onBlurCodigoFormacao}
      />,
    );

    expect(screen.getByPlaceholderText('Nome da formação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Código da formação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Número de homologação')).toBeInTheDocument();
    expect(screen.getByTestId('select-area-promotora-mock')).toBeInTheDocument();

    const inputCodigo = screen.getByPlaceholderText('Código da formação');
    fireEvent.change(inputCodigo, { target: { value: '446' } });
    fireEvent.blur(inputCodigo, { target: { value: '446' } });

    expect(onChangeCodigoFormacao).toHaveBeenCalledTimes(1);
    expect(onBlurCodigoFormacao).toHaveBeenCalledWith('446');
  });

  test('deve renderizar placeholders customizados e cabeçalho opcional', () => {
    render(
      <FiltrosBaseListagemCodaf
        onChangeCodigoFormacao={jest.fn()}
        onBlurCodigoFormacao={jest.fn()}
        placeholderNomeFormacao='Digite o nome da formação'
        placeholderCodigoFormacao='Digite o código da formação'
        placeholderNumeroHomologacao='00000'
        cabecalho={<div data-testid='cabecalho-filtros'>Texto introdutório</div>}
      />,
    );

    expect(screen.getByTestId('cabecalho-filtros')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome da formação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o código da formação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('00000')).toBeInTheDocument();
  });
});
