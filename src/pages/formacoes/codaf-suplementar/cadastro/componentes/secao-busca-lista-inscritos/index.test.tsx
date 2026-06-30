import { describe, expect, test } from '@jest/globals';

describe('SecaoBuscaEListaInscritos - Regras de Negócio', () => {
  const removeNonDigits = (value: string) => value.replace(/\D/g, '');

  const getAprovadoValue = (aprovado: boolean | null) => {
    if (aprovado === null) {
      return null;
    }

    return aprovado ? 'S' : 'N';
  };

  const escapeForRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

  const shouldLoadMore = (args: {
    scrollTop: number;
    clientHeight: number;
    scrollHeight: number;
    temMaisResultados: boolean;
    buscando: boolean;
    carregandoMais: boolean;
  }) => {
    const reachedBottom = args.scrollTop + args.clientHeight >= args.scrollHeight - 5;
    return reachedBottom && args.temMaisResultados && !args.buscando && !args.carregandoMais;
  };

  const mergeOptionsForRender = (
    opcoesAtuais: Array<{ inscricaoId: number }>,
    opcoesEmCache: Array<{ inscricaoId: number }>,
    itensSelecionados: number[],
  ) => {
    const selecionadosMasNaoAtuais = opcoesEmCache.filter(
      (opt) =>
        itensSelecionados.includes(opt.inscricaoId) &&
        !opcoesAtuais.some((atual) => atual.inscricaoId === opt.inscricaoId),
    );

    return [...selecionadosMasNaoAtuais, ...opcoesAtuais];
  };

  test('deve remover todos os caracteres não numéricos da frequência', () => {
    expect(removeNonDigits('85%')).toBe('85');
    expect(removeNonDigits('ab12c3')).toBe('123');
  });

  test('deve mapear aprovado para valores do select', () => {
    expect(getAprovadoValue(true)).toBe('S');
    expect(getAprovadoValue(false)).toBe('N');
    expect(getAprovadoValue(null)).toBeNull();
  });

  test('deve escapar texto para uso seguro em regex', () => {
    const escaped = escapeForRegex('nome (teste) [1]');
    expect(escaped).toBe('nome \\(teste\\) \\[1\\]');
  });

  test('deve habilitar carregamento de próxima página apenas no cenário completo', () => {
    expect(
      shouldLoadMore({
        scrollTop: 100,
        clientHeight: 200,
        scrollHeight: 302,
        temMaisResultados: true,
        buscando: false,
        carregandoMais: false,
      }),
    ).toBe(true);

    expect(
      shouldLoadMore({
        scrollTop: 100,
        clientHeight: 200,
        scrollHeight: 302,
        temMaisResultados: false,
        buscando: false,
        carregandoMais: false,
      }),
    ).toBe(false);
  });

  test('deve preservar selecionados do cache quando não estiverem na página atual', () => {
    const opcoesAtuais = [{ inscricaoId: 2 }, { inscricaoId: 3 }];
    const opcoesEmCache = [{ inscricaoId: 1 }, { inscricaoId: 2 }, { inscricaoId: 3 }];
    const itensSelecionados = [1, 3];

    const result = mergeOptionsForRender(opcoesAtuais, opcoesEmCache, itensSelecionados);

    expect(result.map((item) => item.inscricaoId)).toEqual([1, 2, 3]);
  });

  test('deve limitar frequência máxima em 100', () => {
    const toFrequencyValue = (value: string) => {
      const valueAsNumber = removeNonDigits(value);
      return valueAsNumber ? Math.min(parseInt(valueAsNumber, 10), 100) : null;
    };

    expect(toFrequencyValue('150%')).toBe(100);
    expect(toFrequencyValue('99')).toBe(99);
    expect(toFrequencyValue('')).toBeNull();
  });

  test('deve remover duplicidade ao acumular opções em cache por inscricaoId', () => {
    const cache = [{ inscricaoId: 1 }, { inscricaoId: 2 }];
    const items = [{ inscricaoId: 2 }, { inscricaoId: 3 }];

    const novosItems = items.filter(
      (item) => !cache.some((cached) => cached.inscricaoId === item.inscricaoId),
    );

    expect(novosItems).toEqual([{ inscricaoId: 3 }]);
  });
});
