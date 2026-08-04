import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import dayjs from 'dayjs';
import type { FormInstance } from 'antd';
import {
  formatRetificacaoKey,
  hydrateRetificacoesForm,
  extractRetificacoesPayload,
  RetificacaoDTO,
  RetificacaoMapEntry,
  calcularAprovacao
} from './codaf-utils';
import { RegrasAprovacaoCursistaCodafDto } from '../dto/cursista-dto';

describe('CodafUtils - Retificacoes', () => {
  describe('formatRetificacaoKey', () => {
    test('DadoNumeroMenorQueDez_QuandoFormatarChave_EntaoDevePreencherComZeroAEsquerda', () => {
      // Arrange & Act
      const resultado = formatRetificacaoKey(5);

      // Assert
      expect(resultado).toBe('05');
    });

    test('DadoNumeroMaiorOuIgualADez_QuandoFormatarChave_EntaoDeveRetornarAStringOriginal', () => {
      // Arrange & Act
      const resultado = formatRetificacaoKey(12);

      // Assert
      expect(resultado).toBe('12');
    });
  });

  describe('hydrateRetificacoesForm', () => {
    let formMock: jest.Mocked<FormInstance<any>>;

    beforeEach(() => {
      // Mock básico da interface FormInstance do AntD focado apenas no método que o SUT utiliza
      formMock = {
        setFieldsValue: jest.fn()
      } as unknown as jest.Mocked<FormInstance<any>>;
    });

    test('DadoArrayDeRetificacoesNuloOuVazio_QuandoHidratarFormulario_EntaoDeveRetornarNuloENaoPreencher', () => {
      // Arrange
      const retificacoesVazias: RetificacaoDTO[] = [];

      // Act
      const resultadoNulo = hydrateRetificacoesForm(formMock, undefined);
      const resultadoVazio = hydrateRetificacoesForm(formMock, retificacoesVazias);

      // Assert
      expect(resultadoNulo).toBeNull();
      expect(resultadoVazio).toBeNull();
      expect(formMock.setFieldsValue).not.toHaveBeenCalled();
    });

    test('DadoArrayDeRetificacoesValido_QuandoHidratarFormulario_EntaoDevePreencherChavesPlanasERetornarMapaDeEstado', () => {
      // Arrange
      const retificacoesApi: RetificacaoDTO[] = [
        { id: 101, dataRetificacao: '2026-07-13', paginaRetificacaoDom: 5 },
        { id: 102, dataRetificacao: null, paginaRetificacaoDom: 12 }
      ];

      // Act
      const resultado = hydrateRetificacoesForm(formMock, retificacoesApi);

      // Assert
      expect(resultado).not.toBeNull();
      expect(resultado?.contadorRetificacoes).toBe(2);
      expect(resultado?.retificacaoKeys).toEqual([1, 2]);

      // Validação do Mapa
      const mapa = resultado!.retificacoesMap;
      expect(mapa.get(1)).toEqual({ id: 101, dataRetificacao: '2026-07-13', paginaRetificacaoDom: 5 });
      expect(mapa.get(2)).toEqual({ id: 102, dataRetificacao: null, paginaRetificacaoDom: 12 });

      // Validação da Hidratação do Form (Flat Fields)
      const chamadasSetFields = formMock.setFieldsValue.mock.calls[0][0];
      
      expect(chamadasSetFields.paginaRetificacao01).toBe(5);
      expect(dayjs.isDayjs(chamadasSetFields.dataRetificacao01)).toBe(true);
      expect((chamadasSetFields.dataRetificacao01 as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2026-07-13');

      expect(chamadasSetFields.paginaRetificacao02).toBe(12);
      expect(chamadasSetFields.dataRetificacao02).toBeNull();
    });
  });

  describe('extractRetificacoesPayload', () => {
    test('DadoFormularioComNovasRetificacoes_QuandoExtrairPayload_EntaoDeveMapearParaDtoComIdZeroEDatasFormatadas', () => {
      // Arrange
      const formValues = {
        dataRetificacao01: dayjs('2026-07-14'),
        paginaRetificacao01: 8,
        dataRetificacao02: dayjs('2026-07-15'),
        paginaRetificacao02: 10
      };
      const activeKeys = [1, 2];

      // Act
      const payload = extractRetificacoesPayload(formValues, activeKeys);

      // Assert
      expect(payload).toHaveLength(2);
      expect(payload[0]).toEqual({
        id: 0,
        dataRetificacao: '2026-07-14',
        paginaRetificacaoDom: 8
      });
      expect(payload[1]).toEqual({
        id: 0,
        dataRetificacao: '2026-07-15',
        paginaRetificacaoDom: 10
      });
    });

    test('DadoFormularioComRetificacoesOriginais_QuandoExtrairPayload_EntaoDevePreservarOIdOriginal', () => {
      // Arrange
      const formValues = {
        dataRetificacao01: dayjs('2026-07-20'),
        paginaRetificacao01: 3
      };
      const activeKeys = [1];
      
      const originaisMap = new Map<number, RetificacaoMapEntry>();
      originaisMap.set(1, { id: 999, dataRetificacao: '2026-07-01', paginaRetificacaoDom: 1 });

      // Act
      const payload = extractRetificacoesPayload(formValues, activeKeys, originaisMap);

      // Assert
      expect(payload).toHaveLength(1);
      expect(payload[0]).toEqual({
        id: 999, // ID preservado do mapa original
        dataRetificacao: '2026-07-20', // Dados atualizados do form
        paginaRetificacaoDom: 3
      });
    });

    test('DadoCamposVaziosEAdicionadosSemPreenchimento_QuandoExtrairPayload_EntaoDeveFiltrarEIgnorarEssasEntradas', () => {
      // Arrange
      const formValues = {
        dataRetificacao01: dayjs('2026-07-10'),
        paginaRetificacao01: 5,
        dataRetificacao02: null, // Campo vazio adicionado e não preenchido
        paginaRetificacao02: undefined 
      };
      const activeKeys = [1, 2];

      // Act
      const payload = extractRetificacoesPayload(formValues, activeKeys);

      // Assert
      expect(payload).toHaveLength(1);
      expect(payload[0].paginaRetificacaoDom).toBe(5);
    });

    test('DadoDataComoStringPadrao_QuandoExtrairPayload_EntaoDeveFazerParseCorretamenteOuDeixarNuloSeInvalida', () => {
      // Arrange
      const formValues = {
        dataRetificacao01: new Date('2026-08-01T00:00:00'), // Objeto Date nativo
        paginaRetificacao01: 2
      };
      const activeKeys = [1];

      // Act
      const payload = extractRetificacoesPayload(formValues, activeKeys);

      // Assert
      expect(payload).toHaveLength(1);
      expect(payload[0].dataRetificacao).toBe('2026-08-01');
    });
  });
});

describe('CodafUtils - Motor de Regras de Certificacao (calcularAprovacao)', () => {
  
  // Arrange global para reaproveitamento (DRY)
  const regrasBaseMock: RegrasAprovacaoCursistaCodafDto = {
    frequenciaMinima: 75,
    conceitosAceitos: ['S', 'P'],
    exigeAtividadeObrigatoria: true,
    possuiRegraAvaliacao: true
  };

  test('DadoRegrasNulas_QuandoCalcularAprovacao_EntaoDeveRetornarNulo', () => {
    // Arrange
    const regrasNulas = undefined;

    // Act
    const resultado = calcularAprovacao(100, 'S', 'S', regrasNulas);

    // Assert
    expect(resultado).toBeNull();
  });

  test('DadoRegraSemAvaliacaoAtiva_QuandoCalcularAprovacao_EntaoDeveRetornarNulo', () => {
    // Arrange
    const regrasInativas: RegrasAprovacaoCursistaCodafDto = { 
      ...regrasBaseMock, 
      possuiRegraAvaliacao: false 
    };

    // Act
    const resultado = calcularAprovacao(100, 'S', 'S', regrasInativas);

    // Assert
    expect(resultado).toBeNull();
  });

  test('DadoFrequenciaMenorQueMinimaExigida_QuandoCalcularAprovacao_EntaoDeveRetornarFalso', () => {
    // Arrange
    const frequenciaInsuficiente = 74;

    // Act
    const resultado = calcularAprovacao(frequenciaInsuficiente, 'S', 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoFrequenciaNula_QuandoFrequenciaMinimaSendoExigida_EntaoDeveRetornarFalso', () => {
    // Arrange
    const frequenciaNula = null;

    // Act
    const resultado = calcularAprovacao(frequenciaNula, 'S', 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoConceitoFinalNaoMapeadoNosAceitos_QuandoCalcularAprovacao_EntaoDeveRetornarFalso', () => {
    // Arrange
    const conceitoInvalido = 'NS';

    // Act
    const resultado = calcularAprovacao(100, conceitoInvalido, 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoConceitoFinalNulo_QuandoRegraExigeConceito_EntaoDeveRetornarFalso', () => {
    // Arrange
    const conceitoNulo = null;

    // Act
    const resultado = calcularAprovacao(100, conceitoNulo, 'S', regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoAtividadeObrigatoriaComStatusDiferenteDeSim_QuandoCalcularAprovacao_EntaoDeveRetornarFalso', () => {
    // Arrange
    const atividadeNaoRealizada = 'N';

    // Act
    const resultado = calcularAprovacao(100, 'P', atividadeNaoRealizada, regrasBaseMock);

    // Assert
    expect(resultado).toBe(false);
  });

  test('DadoTodasAsInvariantesSatisfeitas_QuandoCalcularAprovacao_EntaoDeveRetornarVerdadeiro', () => {
    // Arrange
    const frequenciaAdequada = 80;
    const conceitoAdequado = 'P';
    const atividadeAdequada = 'S';

    // Act
    const resultado = calcularAprovacao(frequenciaAdequada, conceitoAdequado, atividadeAdequada, regrasBaseMock);

    // Assert
    expect(resultado).toBe(true);
  });

  test('DadoRegraSemThresholdDeFrequencia_QuandoCalcularAprovacaoComQualquerFrequencia_EntaoDeveIgnorarEValidarVerdadeiro', () => {
    // Arrange
    const regrasSemFrequencia: RegrasAprovacaoCursistaCodafDto = { 
      ...regrasBaseMock, 
      frequenciaMinima: 0 
    };

    // Act
    const resultado = calcularAprovacao(10, 'P', 'S', regrasSemFrequencia);

    // Assert
    expect(resultado).toBe(true);
  });

  test('DadoRegraComVetorDeConceitosVazio_QuandoCalcularAprovacaoComQualquerConceito_EntaoDeveIgnorarEValidarVerdadeiro', () => {
    // Arrange
    const regrasSemConceito: RegrasAprovacaoCursistaCodafDto = { 
      ...regrasBaseMock, 
      conceitosAceitos: [] 
    };

    // Act
    const resultado = calcularAprovacao(100, 'NS', 'S', regrasSemConceito);

    // Assert
    expect(resultado).toBe(true);
  });

  test('DadoRegraSemExigenciaDeAtividade_QuandoCalcularAprovacaoComQualquerAtividade_EntaoDeveIgnorarEValidarVerdadeiro', () => {
    // Arrange
    const regrasSemAtividade: RegrasAprovacaoCursistaCodafDto = { 
      ...regrasBaseMock, 
      exigeAtividadeObrigatoria: false 
    };

    // Act
    const resultado = calcularAprovacao(100, 'P', 'N', regrasSemAtividade);

    // Assert
    expect(resultado).toBe(true);
  });
});