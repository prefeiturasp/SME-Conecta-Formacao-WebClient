/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { INPUTS_NAMES } from './inputs-cadastros';

describe('INPUTS_NAMES', () => {
  it('exporta o agrupamento TEXT', () => {
    expect(INPUTS_NAMES).toHaveProperty('TEXT');
  });

  it('possui todos os nomes de campos esperados', () => {
    expect(INPUTS_NAMES.TEXT).toEqual({
      NOME: 'nome',
      TIPO: 'tipo',
      PERFIL: 'grupoId',
      TELEFONE: 'telefone',
      EMAIL: 'email',
    });
  });

  it.each([
    ['NOME', 'nome'],
    ['TIPO', 'tipo'],
    ['PERFIL', 'grupoId'],
    ['TELEFONE', 'telefone'],
    ['EMAIL', 'email'],
  ] as const)(
    'define INPUTS_NAMES.TEXT.%s como %s',
    (propriedade, valorEsperado) => {
      expect(INPUTS_NAMES.TEXT[propriedade]).toBe(
        valorEsperado,
      );
    },
  );

  it('possui exatamente cinco campos no agrupamento TEXT', () => {
    expect(Object.keys(INPUTS_NAMES.TEXT)).toHaveLength(5);
  });

  it('não possui campos inesperados no agrupamento TEXT', () => {
    expect(Object.keys(INPUTS_NAMES.TEXT)).toEqual([
      'NOME',
      'TIPO',
      'PERFIL',
      'TELEFONE',
      'EMAIL',
    ]);
  });

  it('possui apenas valores do tipo string', () => {
    Object.values(INPUTS_NAMES.TEXT).forEach((value) => {
      expect(typeof value).toBe('string');
    });
  });

  it('não possui valores vazios', () => {
    Object.values(INPUTS_NAMES.TEXT).forEach((value) => {
      expect(value.trim()).not.toBe('');
    });
  });

  it('não possui nomes de campos duplicados', () => {
    const values = Object.values(INPUTS_NAMES.TEXT);
    const uniqueValues = new Set(values);

    expect(uniqueValues.size).toBe(values.length);
  });
});
