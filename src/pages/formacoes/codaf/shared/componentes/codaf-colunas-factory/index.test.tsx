/**
 * @jest-environment jsdom
 */
import { describe, test, expect, jest } from '@jest/globals';
import {
  criarColunasCodafHomologado,
  criarColunasCodafNaoHomologado,
  criarColunasBaseListagemCodaf,
} from './index';

const mockOnChangeCampo = jest.fn();
const mockOnChangeParticipou = jest.fn();
const mockObterSituacaoTexto = jest.fn((status: number) => `Situação ${status}`);

beforeEach(() => jest.clearAllMocks());

describe('criarColunasCodafHomologado', () => {
  test('DadoColunasCodafHomologado_QuandoCriadas_EntaoRetorna7Colunas', () => {
    // Arrange / Act
    const colunas = criarColunasCodafHomologado(1, 10, false, mockOnChangeCampo);

    // Assert
    expect(colunas).toHaveLength(7);
  });

  test('DadoColunasCodafHomologado_QuandoCriadas_EntaoChavesCorretas', () => {
    // Arrange / Act
    const colunas = criarColunasCodafHomologado(1, 10, false, mockOnChangeCampo);
    const keys = colunas.map((c: any) => c.key);

    // Assert
    expect(keys).toEqual(['indice', 'rfOuCpf', 'nomeCursista', 'frequencia', 'atividade', 'conceitoFinal', 'aprovado']);
  });

  test('DadoPagina2Tamanho10_QuandoRenderizaIndice_EntaoRetorna11ParaPrimeiroItem', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(2, 10, false, mockOnChangeCampo);
    const colunaIndice: any = colunas[0];

    // Act
    const resultado = colunaIndice.render(null, {}, 0);

    // Assert
    expect(resultado).toBe(11);
  });

  test('DadoPagina1Tamanho10_QuandoRenderizaIndice_EntaoRetorna1ParaPrimeiroItem', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(1, 10, false, mockOnChangeCampo);
    const colunaIndice: any = colunas[0];

    // Act
    const resultado = colunaIndice.render(null, {}, 0);

    // Assert
    expect(resultado).toBe(1);
  });

  test('DadoPagina3Tamanho5_QuandoRenderizaIndice_EntaoRetorna13ParaTerceiroItem', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(3, 5, false, mockOnChangeCampo);
    const colunaIndice: any = colunas[0];

    // Act
    const resultado = colunaIndice.render(null, {}, 2);

    // Assert
    expect(resultado).toBe(13);
  });

  test('DadoColunasHomologado_QuandoRenderizaFrequenciaComValor_EntaoInputValueComPorcentagem', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(1, 10, false, mockOnChangeCampo);
    const colunaFrequencia: any = colunas[3];

    // Act
    const elemento = colunaFrequencia.render(80, { id: 1 });

    // Assert
    expect(elemento).toBeTruthy();
    expect(elemento.props.value).toBe('80%');
  });

  test('DadoColunasHomologado_QuandoFrequenciaEhNull_EntaoInputValueEhStringVazia', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(1, 10, false, mockOnChangeCampo);
    const colunaFrequencia: any = colunas[3];

    // Act
    const elemento = colunaFrequencia.render(null, { id: 1 });

    // Assert
    expect(elemento.props.value).toBe('');
  });

  test('DadoColunasHomologado_QuandoBloqueadoTrue_EntaoFrequenciaDisabled', () => {
    // Arrange
    const colunas = criarColunasCodafHomologado(1, 10, true, mockOnChangeCampo);
    const colunaFrequencia: any = colunas[3];

    // Act
    const elemento = colunaFrequencia.render(50, { id: 1 });

    // Assert
    expect(elemento.props.disabled).toBe(true);
  });
});

describe('criarColunasCodafNaoHomologado', () => {
  test('DadoColunasCodafNaoHomologado_QuandoCriadas_EntaoRetorna4Colunas', () => {
    // Arrange / Act
    const colunas = criarColunasCodafNaoHomologado(1, 10, false, mockOnChangeParticipou);

    // Assert
    expect(colunas).toHaveLength(4);
  });

  test('DadoColunasCodafNaoHomologado_QuandoCriadas_EntaoChavesCorretas', () => {
    // Arrange / Act
    const colunas = criarColunasCodafNaoHomologado(1, 10, false, mockOnChangeParticipou);
    const keys = colunas.map((c: any) => c.key);

    // Assert
    expect(keys).toEqual(['indice', 'rfOuCpf', 'nomeCursista', 'participou']);
  });

  test('DadoPagina2Tamanho10_QuandoRenderizaIndice_EntaoRetorna11ParaPrimeiroItem', () => {
    // Arrange
    const colunas = criarColunasCodafNaoHomologado(2, 10, false, mockOnChangeParticipou);
    const colunaIndice: any = colunas[0];

    // Act
    const resultado = colunaIndice.render(null, {}, 0);

    // Assert
    expect(resultado).toBe(11);
  });

  test('DadoColunasNaoHomologado_QuandoRenderizaParticipou_EntaoRetornaSelectComValor', () => {
    // Arrange
    const colunas = criarColunasCodafNaoHomologado(1, 10, false, mockOnChangeParticipou);
    const colunaParticipou: any = colunas[3];

    // Act
    const elemento = colunaParticipou.render(true, { id: 5 });

    // Assert
    expect(elemento).toBeTruthy();
    expect(elemento.props.value).toBe(true);
  });

  test('DadoColunasNaoHomologado_QuandoBloqueadoTrue_EntaoParticipouDisabled', () => {
    // Arrange
    const colunas = criarColunasCodafNaoHomologado(1, 10, true, mockOnChangeParticipou);
    const colunaParticipou: any = colunas[3];

    // Act
    const elemento = colunaParticipou.render(false, { id: 2 });

    // Assert
    expect(elemento.props.disabled).toBe(true);
  });
});

describe('criarColunasBaseListagemCodaf', () => {
  test('DadoColunasBaseListagem_QuandoCriadas_EntaoRetorna6Colunas', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(false, mockObterSituacaoTexto);

    // Assert
    expect(colunas).toHaveLength(6);
  });

  test('DadoColunasBaseListagem_QuandoCriadas_EntaoChavesCorretas', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(false, mockObterSituacaoTexto);
    const keys = colunas.map((c: any) => c.key);

    // Assert
    expect(keys).toEqual([
      'codigoFormacao',
      'numeroHomologacao',
      'nomeFormacao',
      'nomeAreaPromotora',
      'nomeTurma',
      'status',
    ]);
  });

  test('DadoColunasBaseListagem_QuandoRenderizaStatus_EntaoChamaObterSituacaoTexto', () => {
    // Arrange
    const colunas = criarColunasBaseListagemCodaf(false, mockObterSituacaoTexto);
    const colunaStatus: any = colunas[5];

    // Act
    const resultado = colunaStatus.render(3);

    // Assert
    expect(mockObterSituacaoTexto).toHaveBeenCalledWith(3);
    expect(resultado).toBe('Situação 3');
  });

  test('DadoOcultarColunasTrue_QuandoCriadas_EntaoCodigoFormacaoWidthEh100', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(true, mockObterSituacaoTexto);
    const colunaCodigo: any = colunas[0];

    // Assert
    expect(colunaCodigo.width).toBe(100);
  });

  test('DadoOcultarColunasFalse_QuandoCriadas_EntaoCodigoFormacaoWidthEh80', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(false, mockObterSituacaoTexto);
    const colunaCodigo: any = colunas[0];

    // Assert
    expect(colunaCodigo.width).toBe(80);
  });

  test('DadoOcultarColunasTrue_QuandoCriadas_EntaoAreaPromotoraWidthEh200', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(true, mockObterSituacaoTexto);
    const colunaArea: any = colunas[3];

    // Assert
    expect(colunaArea.width).toBe(200);
  });

  test('DadoOcultarColunasFalse_QuandoCriadas_EntaoAreaPromotoraWidthEh150', () => {
    // Arrange / Act
    const colunas = criarColunasBaseListagemCodaf(false, mockObterSituacaoTexto);
    const colunaArea: any = colunas[3];

    // Assert
    expect(colunaArea.width).toBe(150);
  });
});
