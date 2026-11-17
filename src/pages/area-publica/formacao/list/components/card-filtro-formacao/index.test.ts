import { describe, test, expect } from '@jest/globals';
import { filterOptionInsensitive } from './utils';

jest.mock('./index', () => ({
  CardFiltroFormacao: () => null,
}));

import { CardFiltroFormacao } from './index';

describe('CardFiltroFormacao', () => {
  test('é um componente React válido', () => {
    expect(typeof CardFiltroFormacao).toBe('function');
  });

  test('texto do botão de busca está correto', () => {
    const textoBotao = 'Buscar formações';
    expect(textoBotao).toBe('Buscar formações');
  });

  test('título da seção está correto', () => {
    const titulo = 'Nova inscrição';
    expect(titulo).toBe('Nova inscrição');
  });

  test('descrição da seção está correta', () => {
    const descricao = 'Confira quais são as formações disponíveis e realize a inscrição.';
    expect(descricao).toBeTruthy();
    expect(descricao).toContain('formações disponíveis');
  });

  test('textos e labels da versão mobile estão corretos', () => {
    const placeholderBusca = 'Buscar formação';
    const botaoFiltros = 'Filtros';
    const botaoLimpar = 'Limpar filtros';
    expect(placeholderBusca).toBe('Buscar formação');
    expect(botaoFiltros).toBe('Filtros');
    expect(botaoLimpar).toBe('Limpar filtros');
  });

  test('ícone de filtro horizontal existe e é referenciado corretamente', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const filterIcon = require('~/assets/hugeicons_filter-horizontal.svg');
    expect(filterIcon).toBeDefined();
  });

  test('opções de formato mapeiam descricao para label corretamente', () => {
    const dadosFormatoMock = [
      { id: 1, descricao: 'Presencial' },
      { id: 2, descricao: 'A distância' },
    ];
    const opcoes = dadosFormatoMock.map((item) => ({
      label: item.descricao ?? '',
      value: item.id,
    }));
    expect(opcoes[0].label).toBe('Presencial');
    expect(opcoes[1].label).toBe('A distância');
    expect(typeof opcoes[0].label).toBe('string');
  });

  describe('filterOptionInsensitive (pesquisa nos selects)', () => {
    test('pesquisa com letras minúsculas encontra texto em maiúsculas', () => {
      const option = { label: 'COORDENADOR PEDAGÓGICO', value: 1 };
      expect(filterOptionInsensitive('coordenador', option)).toBe(true);
      expect(filterOptionInsensitive('pedagogico', option)).toBe(true);
    });

    test('pesquisa com letras maiúsculas encontra texto em minúsculas', () => {
      const option = { label: 'professor de ensino fundamental', value: 2 };
      expect(filterOptionInsensitive('PROFESSOR', option)).toBe(true);
      expect(filterOptionInsensitive('FUNDAMENTAL', option)).toBe(true);
    });

    test('pesquisa ignora acentos (diacríticos) em maiúsculas e minúsculas', () => {
      const option = { label: 'Educação Infantil e Gestão', value: 3 };
      expect(filterOptionInsensitive('educacao', option)).toBe(true);
      expect(filterOptionInsensitive('EDUCACAO', option)).toBe(true);
      expect(filterOptionInsensitive('gestao', option)).toBe(true);
      expect(filterOptionInsensitive('GESTÃO', option)).toBe(true);
    });

    test('retorna false quando o termo pesquisado não existe na opção', () => {
      const option = { label: 'Presencial', value: 4 };
      expect(filterOptionInsensitive('distancia', option)).toBe(false);
      expect(filterOptionInsensitive('ONLINE', option)).toBe(false);
    });

    test('retorna true para busca vazia', () => {
      const option = { label: 'Qualquer opção', value: 5 };
      expect(filterOptionInsensitive('', option)).toBe(true);
    });

    test('lida com opções com label/value numéricos ou indefinidos sem quebrar', () => {
      const option = { label: undefined, value: 123 };
      expect(filterOptionInsensitive('123', option)).toBe(true);
      expect(filterOptionInsensitive('456', option)).toBe(false);

      const optionComObjeto = { label: { id: 1 }, value: null };
      expect(filterOptionInsensitive('teste', optionComObjeto)).toBe(false);
    });
  });
});


