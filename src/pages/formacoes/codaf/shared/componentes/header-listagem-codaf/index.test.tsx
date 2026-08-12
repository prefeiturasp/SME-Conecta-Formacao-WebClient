/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HeaderListagemCodaf } from './index';

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

jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn() }));

jest.mock('~/components/lib/header-page', () => ({
  __esModule: true,
  default: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: (props: any) => <button data-testid='btn-voltar' onClick={props.onClick}>Voltar</button>,
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_NOVO: 'CF_BUTTON_NOVO',
  CF_BUTTON_VOLTAR: 'CF_BUTTON_VOLTAR',
}));

jest.mock('~/core/enum/routes-enum', () => ({
  ROUTES: { PRINCIPAL: '/' },
}));

jest.mock('~/core/utils/form', () => ({
  onClickVoltar: jest.fn(),
}));

beforeEach(() => jest.clearAllMocks());

describe('HeaderListagemCodaf', () => {
  test('DadoTituloInformado_QuandoRenderizado_EntaoTituloVisivel', () => {
    // Arrange / Act
    render(
      <HeaderListagemCodaf titulo='Meu Título' podeIncluir={true} onClickNovo={jest.fn()} />,
    );

    // Assert
    expect(screen.getByText('Meu Título')).toBeInTheDocument();
  });

  test('DadoPodeIncluirFalse_QuandoRenderizado_EntaoBotaoNovoRegistroDisabled', () => {
    // Arrange / Act
    render(
      <HeaderListagemCodaf titulo='Título' podeIncluir={false} onClickNovo={jest.fn()} />,
    );

    // Assert
    expect(screen.getByText('Novo registro').closest('button')).toBeDisabled();
  });

  test('DadoPodeIncluirTrue_QuandoRenderizado_EntaoBotaoNovoRegistroHabilitado', () => {
    // Arrange / Act
    render(
      <HeaderListagemCodaf titulo='Título' podeIncluir={true} onClickNovo={jest.fn()} />,
    );

    // Assert
    expect(screen.getByText('Novo registro').closest('button')).not.toBeDisabled();
  });

  test('DadoBotaoNovoRegistroHabilitado_QuandoClicado_EntaoChamaOnClickNovo', () => {
    // Arrange
    const onClickNovo = jest.fn();
    render(<HeaderListagemCodaf titulo='Título' podeIncluir={true} onClickNovo={onClickNovo} />);

    // Act
    fireEvent.click(screen.getByText('Novo registro'));

    // Assert
    expect(onClickNovo).toHaveBeenCalledTimes(1);
  });

  test('DadoSempreRenderizado_QuandoMontado_EntaoButtonVoltarVisivel', () => {
    // Arrange / Act
    render(
      <HeaderListagemCodaf titulo='Título' podeIncluir={true} onClickNovo={jest.fn()} />,
    );

    // Assert
    expect(screen.getByTestId('btn-voltar')).toBeInTheDocument();
  });
});
