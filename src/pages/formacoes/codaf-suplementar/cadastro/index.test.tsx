import { describe, expect, test } from '@jest/globals';

describe('CadastroCodafSuplementar - Regras de Negócio', () => {
  const resolveAtividade = (atividade: string | null): boolean | null => {
    if (atividade === 'S') {
      return true;
    }

    if (atividade === 'N') {
      return false;
    }

    return null;
  };

  const mapearAtividadeObrigatoria = (atividadeObrigatorio: boolean | null | undefined) => {
    if (atividadeObrigatorio === true) {
      return 'S';
    }

    if (atividadeObrigatorio === false) {
      return 'N';
    }

    return null;
  };

  const normalizeDocument = (value: string | number) => String(value).replace(/\D/g, '');

  const construirRetificacoes = (
    retificacoes: number[],
    values: Record<string, string | number | null | undefined>,
    originais: Map<number, { id: number }>,
    isEditing: boolean,
  ) =>
    retificacoes
      .map((numero) => {
        const numeroFormatado = numero.toString().padStart(2, '0');
        const dataRetificacao = values[`dataRetificacao${numeroFormatado}`] as string | null;
        const paginaRetificacao = values[`paginaRetificacao${numeroFormatado}`] as number | null;

        if (!dataRetificacao && !paginaRetificacao) {
          return null;
        }

        const retificacaoOriginal = isEditing ? originais.get(numero) : null;
        return {
          id: retificacaoOriginal?.id ?? 0,
          dataRetificacao,
          paginaRetificacaoDom: Number(paginaRetificacao) || 0,
        };
      })
      .filter((item) => item !== null);

  const getErrorMessage = (error: any, fallback: string) =>
    error?.response?.data?.erros?.[0] ??
    error?.response?.data?.mensagens?.[0] ??
    error?.message ??
    fallback;

  test('deve converter atividade S/N para boolean', () => {
    expect(resolveAtividade('S')).toBe(true);
    expect(resolveAtividade('N')).toBe(false);
    expect(resolveAtividade(null)).toBeNull();
  });

  test('deve converter atividade obrigatória boolean para S/N', () => {
    expect(mapearAtividadeObrigatoria(true)).toBe('S');
    expect(mapearAtividadeObrigatoria(false)).toBe('N');
    expect(mapearAtividadeObrigatoria(undefined)).toBeNull();
  });

  test('deve normalizar documento removendo caracteres não numéricos', () => {
    expect(normalizeDocument('123.456.789-00')).toBe('12345678900');
    expect(normalizeDocument('RF-9988')).toBe('9988');
  });

  test('deve filtrar inscritos duplicados por documento normalizado', () => {
    const existentes = [{ rfOuCpf: '123.456.789-00' }];
    const novos = [{ documento: '12345678900' }, { documento: '111.222.333-44' }];

    const apenasNovos = novos.filter(
      (novo) => !existentes.some((existente) => normalizeDocument(existente.rfOuCpf) === normalizeDocument(novo.documento)),
    );

    expect(apenasNovos).toHaveLength(1);
    expect(apenasNovos[0].documento).toBe('111.222.333-44');
  });

  test('deve construir retificações apenas quando houver dados preenchidos', () => {
    const values = {
      dataRetificacao01: '2026-01-10',
      paginaRetificacao01: 12,
      dataRetificacao02: null,
      paginaRetificacao02: null,
    };

    const result = construirRetificacoes([1, 2], values, new Map(), false);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      id: 0,
      dataRetificacao: '2026-01-10',
      paginaRetificacaoDom: 12,
    });
  });

  test('deve preservar id da retificação original no modo edição', () => {
    const values = {
      dataRetificacao01: '2026-01-10',
      paginaRetificacao01: 12,
    };

    const originais = new Map<number, { id: number }>([[1, { id: 77 }]]);
    const result = construirRetificacoes([1], values, originais, true);

    expect(result[0]).toEqual({
      id: 77,
      dataRetificacao: '2026-01-10',
      paginaRetificacaoDom: 12,
    });
  });

  test('deve priorizar mensagens de erro da API', () => {
    const error = {
      response: {
        data: {
          erros: ['Erro específico'],
        },
      },
    };

    expect(getErrorMessage(error, 'Fallback')).toBe('Erro específico');
  });

  test('deve usar fallback quando não houver mensagem no erro', () => {
    expect(getErrorMessage({}, 'Fallback')).toBe('Fallback');
  });

  test('deve mapear inscritos para payload mantendo regra de atividade', () => {
    const inscritos = [
      {
        inscricaoId: 1,
        frequencia: 100,
        conceitoFinal: 'P',
        atividade: 'S',
        aprovado: true,
      },
    ];

    const payload = inscritos.map((c) => ({
      inscricaoId: c.inscricaoId,
      percentualFrequencia: c.frequencia ?? null,
      conceitoFinal: c.conceitoFinal ?? null,
      atividadeObrigatorio: resolveAtividade(c.atividade),
      aprovado: c.aprovado ?? null,
    }));

    expect(payload).toEqual([
      {
        inscricaoId: 1,
        percentualFrequencia: 100,
        conceitoFinal: 'P',
        atividadeObrigatorio: true,
        aprovado: true,
      },
    ]);
  });
});
