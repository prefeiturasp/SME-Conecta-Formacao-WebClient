/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BotoesAcaoCodaf } from './index';

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

jest.mock('~/components/main/button/voltar', () => ({
  __esModule: true,
  default: (props: any) => <button data-testid='btn-voltar' onClick={props.onClick}>Voltar</button>,
}));

jest.mock('~/core/constants/ids/button/intex', () => ({
  CF_BUTTON_VOLTAR: 'CF_BUTTON_VOLTAR',
  CF_BUTTON_EXCLUIR: 'CF_BUTTON_EXCLUIR',
  CF_BUTTON_CANCELAR: 'CF_BUTTON_CANCELAR',
  CF_BUTTON_SALVAR: 'CF_BUTTON_SALVAR',
}));

const mockProps = {
  loading: false,
  formValido: true,
  onClickVoltar: jest.fn(),
  onClickExcluir: jest.fn(),
  onClickCancelar: jest.fn(),
  onClickSalvar: jest.fn(),
};

const bloqueiosBotoesPadrao = {
  excluir: { visivel: false, bloqueado: false },
  salvar: { visivel: false, bloqueado: false },
  enviarDF: { visivel: false, bloqueado: false },
  devolver: { visivel: false, bloqueado: false },
};

beforeEach(() => jest.clearAllMocks());

describe('BotoesAcaoCodaf', () => {
  test('DadoPropsMinimas_QuandoRenderizado_EntaoNaoCrash', () => {
    // Arrange / Act / Assert
    expect(() =>
      render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueiosBotoesPadrao} />)
    ).not.toThrow();
  });

  test('DadoSempreRenderizado_QuandoMontado_EntaoButtonVoltarVisivel', () => {
    // Arrange / Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueiosBotoesPadrao} />);

    // Assert
    expect(screen.getByTestId('btn-voltar')).toBeInTheDocument();
  });

  test('DadoExcluirVisivelTrue_QuandoRenderizado_EntaoButtonExcluirVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, excluir: { visivel: true, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  test('DadoExcluirVisivelFalse_QuandoRenderizado_EntaoButtonExcluirNaoVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, excluir: { visivel: false, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.queryByText('Excluir')).not.toBeInTheDocument();
  });

  test('DadoExcluirBloqueadoTrue_QuandoRenderizado_EntaoButtonExcluirDisabled', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, excluir: { visivel: true, bloqueado: true } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.getByText('Excluir').closest('button')).toBeDisabled();
  });

  test('DadoSalvarVisivelTrue_QuandoRenderizado_EntaoBotoesCancelarESalvarVisiveis', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, salvar: { visivel: true, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  test('DadoSalvarVisivelFalse_QuandoRenderizado_EntaoBotoesCancelarESalvarNaoVisiveis', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, salvar: { visivel: false, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.queryByText('Cancelar')).not.toBeInTheDocument();
    expect(screen.queryByText('Salvar')).not.toBeInTheDocument();
  });

  test('DadoEnviarParaDFComVisivelTrue_QuandoRenderizado_EntaoBotaoEnviarDFVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, enviarDF: { visivel: true, bloqueado: false } };

    // Act
    render(
      <BotoesAcaoCodaf
        {...mockProps}
        bloqueiosBotoes={bloqueios}
        onClickEnviarParaDF={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Enviar para DF')).toBeInTheDocument();
  });

  test('DadoEnviarParaDFSemCallback_QuandoRenderizado_EntaoBotaoEnviarDFNaoVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, enviarDF: { visivel: true, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.queryByText('Enviar para DF')).not.toBeInTheDocument();
  });

  test('DadoDevolverParaDFComVisivelTrue_QuandoRenderizado_EntaoBotaoDevolverVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, devolver: { visivel: true, bloqueado: false } };

    // Act
    render(
      <BotoesAcaoCodaf
        {...mockProps}
        bloqueiosBotoes={bloqueios}
        onClickDevolverParaDF={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Devolver')).toBeInTheDocument();
  });

  test('DadoDevolverParaDFSemCallback_QuandoRenderizado_EntaoBotaoDevolverNaoVisivel', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, devolver: { visivel: true, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} />);

    // Assert
    expect(screen.queryByText('Devolver')).not.toBeInTheDocument();
  });

  test('DadoFormValidoFalse_QuandoEnviarParaDFRenderizado_EntaoBotaoEnviarDFDisabled', () => {
    // Arrange
    const bloqueios = { ...bloqueiosBotoesPadrao, enviarDF: { visivel: true, bloqueado: false } };

    // Act
    render(
      <BotoesAcaoCodaf
        {...mockProps}
        formValido={false}
        bloqueiosBotoes={bloqueios}
        onClickEnviarParaDF={jest.fn()}
      />,
    );

    // Assert
    expect(screen.getByText('Enviar para DF').closest('button')).toBeDisabled();
  });

  test('DadoSalvarBloqueadoFalse_QuandoSalvarClicado_EntaoChamaOnClickSalvar', () => {
    // Arrange
    const onClickSalvar = jest.fn();
    const bloqueios = { ...bloqueiosBotoesPadrao, salvar: { visivel: true, bloqueado: false } };

    // Act
    render(<BotoesAcaoCodaf {...mockProps} bloqueiosBotoes={bloqueios} onClickSalvar={onClickSalvar} />);
    fireEvent.click(screen.getByText('Salvar'));

    // Assert
    expect(onClickSalvar).toHaveBeenCalledTimes(1);
  });
});
