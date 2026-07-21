import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import dayjs from 'dayjs';
import type { FormInstance } from 'antd';
import {
  formatRetificacaoKey,
  hydrateRetificacoesForm,
  extractRetificacoesPayload,
  RetificacaoDTO,
  RetificacaoMapEntry
} from './codaf-utils';

describe('CodafUtils - Retificacoes', () => {
  describe('formatRetificacaoKey', () => {
    test('DadoNumeroMenorQueDezQuandoFormatarChaveEntaoDevePreencherComZeroAEsquerda', () => {
      // Arrange & Act
      const resultado = formatRetificacaoKey(5);

      // Assert
      expect(resultado).toBe('05');
    });

    test('DadoNumeroMaiorOuIgualADezQuandoFormatarChaveEntaoDeveRetornarAStringOriginal', () => {
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

    test('DadoArrayDeRetificacoesNuloOuVazioQuandoHidratarFormularioEntaoDeveRetornarNuloENaoPreencher', () => {
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

    test('DadoArrayDeRetificacoesValidoQuandoHidratarFormularioEntaoDevePreencherChavesPlanasERetornarMapaDeEstado', () => {
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
    test('DadoFormularioComNovasRetificacoesQuandoExtrairPayloadEntaoDeveMapearParaDtoComIdZeroEDatasFormatadas', () => {
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

    test('DadoFormularioComRetificacoesOriginaisQuandoExtrairPayloadEntaoDevePreservarOIdOriginal', () => {
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

    test('DadoCamposVaziosEAdicionadosSemPreenchimentoQuandoExtrairPayloadEntaoDeveFiltrarEIgnorarEssasEntradas', () => {
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

    test('DadoDataComoStringPadraoQuandoExtrairPayloadEntaoDeveFazerParseCorretamenteOuDeixarNuloSeInvalida', () => {
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