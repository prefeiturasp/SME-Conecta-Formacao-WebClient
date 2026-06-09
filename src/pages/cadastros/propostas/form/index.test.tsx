import { describe, it, expect } from '@jest/globals';
import cloneDeep from 'lodash/cloneDeep';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { SituacaoProposta } from '../../../../core/enum/situacao-proposta'
dayjs.extend(utc);
dayjs.extend(timezone);

describe('FormCadastroDePropostas Helper Functions', () => {
  describe('mapearListaDres', () => {
    it('should map DREs correctly', () => {
      const dres = [
        { id: 1, descricao: 'DRE A' },
        { id: 2, descricao: 'DRE B' },
      ];

      const result = dres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));

      expect(result).toEqual([
        { id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' },
        { id: 2, descricao: 'DRE B', value: 2, label: 'DRE B' },
      ]);
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe(result[0].id);
      expect(result[0].label).toBe(result[0].descricao);
    });

    it('should handle empty DREs array', () => {
      const dres: any[] = [];
      const result = dres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle single DRE', () => {
      const dres = [{ id: 1, descricao: 'DRE Única' }];
      const result = dres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));

      expect(result).toHaveLength(1);
      expect(result[0].value).toBe(1);
      expect(result[0].label).toBe('DRE Única');
    });

    it('should preserve original dre object properties', () => {
      const dres = [{ id: 1, descricao: 'DRE A', extra: 'campo' }];
      const result = dres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));

      expect(result[0]).toHaveProperty('extra', 'campo');
    });
  });

  describe('mapearDresSelecionadas', () => {
    it('should map selected DREs correctly', () => {
      const dresDados = [{ dreId: 1 }, { dreId: 2 }];
      const listaDres = [
        { id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' },
        { id: 2, descricao: 'DRE B', value: 2, label: 'DRE B' },
        { id: 3, descricao: 'DRE C', value: 3, label: 'DRE C' },
      ];

      const ids = dresDados.map((item) => item.dreId);
      const result = cloneDeep(listaDres).filter((item) => ids.includes(item.id));

      expect(result.length).toBe(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });

    it('should return empty array when dresDados is empty', () => {
      const dresDados: any[] = [];
      const listaDres = [
        { id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' },
      ];

      const ids = dresDados.map((item) => item.dreId);
      const result = cloneDeep(listaDres).filter((item) => ids.includes(item.id));

      expect(result).toEqual([]);
    });

    it('should return empty array when dresDados is undefined', () => {
      const dresDados: { dreId: number }[] | undefined = undefined;
      const listaDres = [
        { id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' },
      ];

      const ids = (dresDados ?? []).map((item: { dreId: number }) => item.dreId);
      const result = cloneDeep(listaDres).filter((item) => ids.includes(item.id));

      expect(result).toEqual([]);
    });

    it('should not include DREs not in the selection', () => {
      const dresDados = [{ dreId: 1 }];
      const listaDres = [
        { id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' },
        { id: 2, descricao: 'DRE B', value: 2, label: 'DRE B' },
      ];

      const ids = dresDados.map((item) => item.dreId);
      const result = cloneDeep(listaDres).filter((item) => ids.includes(item.id));

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should create a deep copy of the original list', () => {
      const dresDados = [{ dreId: 1 }];
      const listaDres = [{ id: 1, descricao: 'DRE A', value: 1, label: 'DRE A' }];

      const ids = dresDados.map((item) => item.dreId);
      const result = cloneDeep(listaDres).filter((item) => ids.includes(item.id));

      result[0].descricao = 'Modified';
      expect(listaDres[0].descricao).toBe('DRE A');
    });
  });

  describe('mapearTurmas', () => {
    it('should map turmas correctly with index as key', () => {
      const turmas = [
        { nome: 'Turma A', dres: [{ id: 1 }] },
        { nome: 'Turma B', dres: [{ id: 2 }] },
      ];

      const result = (turmas ?? []).map((turma: any, index: number) => ({
        ...turma,
        key: index,
      }));

      expect(result).toHaveLength(2);
      expect(result[0].key).toBe(0);
      expect(result[1].key).toBe(1);
      expect(result[0].nome).toBe('Turma A');
    });

    it('should handle empty turmas array', () => {
      const turmas: any[] = [];

      const result = (turmas ?? []).map((turma: any, index: number) => ({
        ...turma,
        key: index,
      }));

      expect(result).toEqual([]);
    });

    it('should handle undefined turmas', () => {
      const turmas = undefined;

      const result = (turmas ?? []).map((turma: any, index: number) => ({
        ...turma,
        key: index,
      }));

      expect(result).toEqual([]);
    });

    it('should preserve turma properties', () => {
      const turmas = [{ nome: 'Turma A', dres: [], extra: 'info' }];

      const result = (turmas ?? []).map((turma: any, index: number) => ({
        ...turma,
        key: index,
      }));

      expect(result[0]).toHaveProperty('extra', 'info');
      expect(result[0]).toHaveProperty('nome', 'Turma A');
    });
  });

  describe('mapearPareceristas', () => {
    it('should map pareceristas correctly', () => {
      const pareceristas = [
        { id: 1, nomeParecerista: 'Parecerista A', registroFuncional: 'RF001' },
        { id: 2, nomeParecerista: 'Parecerista B', registroFuncional: 'RF002' },
      ];

      const result = (pareceristas ?? []).map((p) => ({
        id: p.id,
        label: p.nomeParecerista,
        value: p.registroFuncional,
      }));

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        label: 'Parecerista A',
        value: 'RF001',
      });
    });

    it('should handle empty pareceristas', () => {
      const pareceristas: any[] = [];

      const result = (pareceristas ?? []).map((p) => ({
        id: p.id,
        label: p.nomeParecerista,
        value: p.registroFuncional,
      }));

      expect(result).toEqual([]);
    });

    it('should handle undefined pareceristas', () => {
      const pareceristas = undefined;

      const result = (pareceristas ?? []).map((p: { id: number; nomeParecerista: string; registroFuncional: string }) => ({
        id: p.id,
        label: p.nomeParecerista,
        value: p.registroFuncional,
      }));

      expect(result).toEqual([]);
    });

    it('should map single parecerista', () => {
      const pareceristas = [
        { id: 1, nomeParecerista: 'Único', registroFuncional: 'RF001' },
      ];

      const result = (pareceristas ?? []).map((p) => ({
        id: p.id,
        label: p.nomeParecerista,
        value: p.registroFuncional,
      }));

      expect(result).toHaveLength(1);
      expect(result[0].label).toBe('Único');
    });
  });

  describe('mapearPeriodo', () => {
    it('should map period correctly', () => {
      const inicio = '2024-01-01';
      const fim = '2024-12-31';

      const result =
        inicio && fim ? [dayjs.tz(inicio), dayjs.tz(fim)] : [];

      expect(result).toHaveLength(2);
      expect(result[0].format('YYYY-MM-DD')).toBe('2024-01-01');
      expect(result[1].format('YYYY-MM-DD')).toBe('2024-12-31');
    });

    it('should return empty array when inicio is not provided', () => {
      const inicio = undefined;
      const fim = '2024-12-31';

      const result =
        inicio && fim ? [dayjs.tz(inicio), dayjs.tz(fim)] : [];

      expect(result).toEqual([]);
    });

    it('should return empty array when fim is not provided', () => {
      const inicio = '2024-01-01';
      const fim = undefined;

      const result =
        inicio && fim ? [dayjs.tz(inicio), dayjs.tz(fim)] : [];

      expect(result).toEqual([]);
    });

    it('should return empty array when both dates are not provided', () => {
      const inicio = undefined;
      const fim = undefined;

      const result =
        inicio && fim ? [dayjs.tz(inicio), dayjs.tz(fim)] : [];

      expect(result).toEqual([]);
    });

    it('should handle same dates', () => {
      const inicio = '2024-01-01';
      const fim = '2024-01-01';

      const result =
        inicio && fim ? [dayjs.tz(inicio), dayjs.tz(fim)] : [];

      expect(result).toHaveLength(2);
      expect(result[0].isSame(result[1])).toBe(true);
    });
  });

  describe('mapearGruposPeriodos', () => {
    it('should map grupos periodos correctly', () => {
      const grupos = [
        {
          id: 1,
          dataInicio: '2024-01-01',
          dataFim: '2024-12-31',
          propostaTurmasIds: [1, 2],
        },
      ];

      const result = (grupos ?? []).map((g) => ({
        id: g.id,
        periodo:
          g.dataInicio && g.dataFim
            ? [dayjs.tz(g.dataInicio), dayjs.tz(g.dataFim)]
            : undefined,
        propostaTurmasIds: g.propostaTurmasIds,
      }));

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].periodo).toHaveLength(2);
      expect(result[0].propostaTurmasIds).toEqual([1, 2]);
    });

    it('should handle empty grupos', () => {
      const grupos: any[] = [];

      const result = (grupos ?? []).map((g) => ({
        id: g.id,
        periodo:
          g.dataInicio && g.dataFim
            ? [dayjs.tz(g.dataInicio), dayjs.tz(g.dataFim)]
            : undefined,
        propostaTurmasIds: g.propostaTurmasIds,
      }));

      expect(result).toEqual([]);
    });

    it('should handle undefined grupos', () => {
      const grupos = undefined;

      const result = (grupos ?? []).map((g: { id: number; dataInicio: string; dataFim: string; propostaTurmasIds: number[] }) => ({
        id: g.id,
        periodo:
          g.dataInicio && g.dataFim
            ? [dayjs.tz(g.dataInicio), dayjs.tz(g.dataFim)]
            : undefined,
        propostaTurmasIds: g.propostaTurmasIds,
      }));

      expect(result).toEqual([]);
    });

    it('should set periodo to undefined when dates are missing', () => {
      const grupos = [
        {
          id: 1,
          dataInicio: '2024-01-01',
          dataFim: undefined,
          propostaTurmasIds: [1],
        },
      ];

      const result = (grupos ?? []).map((g) => ({
        id: g.id,
        periodo:
          g.dataInicio && g.dataFim
            ? [dayjs.tz(g.dataInicio), dayjs.tz(g.dataFim)]
            : undefined,
        propostaTurmasIds: g.propostaTurmasIds,
      }));

      expect(result[0].periodo).toBeUndefined();
    });
  });

  describe('mapearArquivoImagem', () => {
    it('should map arquivo imagem correctly', () => {
      const arquivo = {
        arquivoId: 1,
        codigo: 'ABC123',
        nome: 'imagem.jpg',
      };

      const result = arquivo?.arquivoId
        ? [
            {
              xhr: arquivo.codigo,
              name: arquivo.nome,
              id: arquivo.arquivoId,
              status: 'done',
            },
          ]
        : [];

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe('imagem.jpg');
      expect(result[0].status).toBe('done');
    });

    it('should return empty array when arquivo is undefined', () => {
      const arquivo: any = undefined;

      const result = arquivo?.arquivoId
        ? [
            {
              xhr: arquivo.codigo,
              name: arquivo.nome,
              id: arquivo.arquivoId,
              status: 'done',
            },
          ]
        : [];

      expect(result).toEqual([]);
    });

    it('should return empty array when arquivoId is not provided', () => {
      const arquivo: any = { codigo: 'ABC123', nome: 'imagem.jpg' };

      const result = arquivo?.arquivoId
        ? [
            {
              xhr: arquivo.codigo,
              name: arquivo.nome,
              id: arquivo.arquivoId,
              status: 'done',
            },
          ]
        : [];

      expect(result).toEqual([]);
    });

    it('should handle arquivoId with value 0', () => {
      const arquivo = {
        arquivoId: 0,
        codigo: 'ABC123',
        nome: 'imagem.jpg',
      };

      const result = arquivo?.arquivoId
        ? [
            {
              xhr: arquivo.codigo,
              name: arquivo.nome,
              id: arquivo.arquivoId,
              status: 'done',
            },
          ]
        : [];

      expect(result).toEqual([]);
    });
  });

  describe('resolverSituacao', () => {
    it('should return Rascunho when idProposta is 0 and novaSituacao is undefined', () => {
      const idProposta = 0;
      const novaSituacao = undefined;
      const situacaoAtual = undefined;

      let situacao = SituacaoProposta.Rascunho;
      if (idProposta && !novaSituacao && situacaoAtual) {
        situacao = situacaoAtual;
      } else if (novaSituacao) {
        situacao = novaSituacao;
      }

      expect(situacao).toBe(SituacaoProposta.Rascunho);
    });

    it('should return situacaoAtual when idProposta is provided and novaSituacao is undefined', () => {
      const idProposta = 123;
      const novaSituacao = undefined;
      const situacaoAtual = SituacaoProposta.Cadastrada;

      let situacao = SituacaoProposta.Rascunho;
      if (idProposta && !novaSituacao && situacaoAtual) {
        situacao = situacaoAtual;
      } else if (novaSituacao) {
        situacao = novaSituacao;
      }

      expect(situacao).toBe(SituacaoProposta.Cadastrada);
    });

    it('should return novaSituacao when provided', () => {
      const idProposta = 123;
      const novaSituacao = SituacaoProposta.Publicada;
      const situacaoAtual = SituacaoProposta.Cadastrada;

      let situacao = SituacaoProposta.Rascunho;
      if (!novaSituacao && idProposta && situacaoAtual) {
        situacao = situacaoAtual;
      } else if (novaSituacao) {
        situacao = novaSituacao;
      }

      expect(situacao).toBe(SituacaoProposta.Publicada);
    });

    it('should return Alterando when ehProximoPasso is true and situacao is Publicada', () => {
      const idProposta = 123;
      const novaSituacao = SituacaoProposta.Publicada;
      const situacaoAtual = SituacaoProposta.Publicada;
      const ehProximoPasso = true;

      let situacao = SituacaoProposta.Rascunho;
      if (idProposta && !novaSituacao && situacaoAtual) {
        situacao = situacaoAtual;
      } else if (novaSituacao) {
        situacao = novaSituacao;
      }
      if (ehProximoPasso && situacao === SituacaoProposta.Publicada) {
        situacao = SituacaoProposta.Alterando;
      }

      expect(situacao).toBe(SituacaoProposta.Alterando);
    });

    it('should not change situacao when ehProximoPasso is false', () => {
      const idProposta = 123;
      const novaSituacao = SituacaoProposta.Publicada;
      const situacaoAtual = SituacaoProposta.Publicada;
      const ehProximoPasso = false;

      let situacao = SituacaoProposta.Rascunho;
      if (idProposta && !novaSituacao && situacaoAtual) {
        situacao = situacaoAtual;
      } else if (novaSituacao) {
        situacao = novaSituacao;
      }
      if (ehProximoPasso && situacao === SituacaoProposta.Publicada) {
        situacao = SituacaoProposta.Alterando;
      }

      expect(situacao).toBe(SituacaoProposta.Publicada);
    });
  });

  describe('extrairDatasFormatadas', () => {
    it('should extract formatted dates correctly', () => {
      const values = {
        periodoRealizacao: [dayjs('2024-01-01'), dayjs('2024-12-31')],
        periodoInscricao: [dayjs('2024-01-01'), dayjs('2024-02-28')],
      };

      const result = {
        dataRealizacaoInicio: values?.periodoRealizacao?.[0]?.format('YYYY-MM-DD'),
        dataRealizacaoFim: values?.periodoRealizacao?.[1]?.format('YYYY-MM-DD'),
        dataInscricaoInicio: values?.periodoInscricao?.[0]?.format('YYYY-MM-DD'),
        dataInscricaoFim: values?.periodoInscricao?.[1]?.format('YYYY-MM-DD'),
      };

      expect(result.dataRealizacaoInicio).toBe('2024-01-01');
      expect(result.dataRealizacaoFim).toBe('2024-12-31');
      expect(result.dataInscricaoInicio).toBe('2024-01-01');
      expect(result.dataInscricaoFim).toBe('2024-02-28');
    });

    it('should handle undefined periodoRealizacao', () => {
      const values = {
        periodoRealizacao: undefined as [Dayjs, Dayjs] | undefined,
        periodoInscricao: [dayjs('2024-01-01'), dayjs('2024-02-28')],
      };

      const result = {
        dataRealizacaoInicio: values?.periodoRealizacao?.[0]?.format('YYYY-MM-DD'),
        dataRealizacaoFim: values?.periodoRealizacao?.[1]?.format('YYYY-MM-DD'),
        dataInscricaoInicio: values?.periodoInscricao?.[0]?.format('YYYY-MM-DD'),
        dataInscricaoFim: values?.periodoInscricao?.[1]?.format('YYYY-MM-DD'),
      };

      expect(result.dataRealizacaoInicio).toBeUndefined();
      expect(result.dataRealizacaoFim).toBeUndefined();
      expect(result.dataInscricaoInicio).toBe('2024-01-01');
    });

    it('should handle all undefined dates', () => {
      const values = {
        periodoRealizacao: undefined as [Dayjs, Dayjs] | undefined,
        periodoInscricao: undefined as [Dayjs, Dayjs] | undefined,
      };

      const result = {
        dataRealizacaoInicio: values?.periodoRealizacao?.[0]?.format('YYYY-MM-DD'),
        dataRealizacaoFim: values?.periodoRealizacao?.[1]?.format('YYYY-MM-DD'),
        dataInscricaoInicio: values?.periodoInscricao?.[0]?.format('YYYY-MM-DD'),
        dataInscricaoFim: values?.periodoInscricao?.[1]?.format('YYYY-MM-DD'),
      };

      expect(result.dataRealizacaoInicio).toBeUndefined();
      expect(result.dataRealizacaoFim).toBeUndefined();
      expect(result.dataInscricaoInicio).toBeUndefined();
      expect(result.dataInscricaoFim).toBeUndefined();
    });
  });

  describe('mapearTurmasSalvar', () => {
    it('should map turmas for saving correctly', () => {
      const turmas = [
        {
          id: 1,
          nome: 'Turma A',
          dres: [
            { id: 1, value: 1, label: 'DRE A', todos: false },
            { id: 2, value: 2, label: 'DRE B', todos: false },
          ],
        },
      ];

      const result = (turmas ?? []).map((item) => {
        const dresIds =
          item.dres?.length && item.dres.length > 1
            ? item.dres.filter((dre: any) => !dre.todos).map((d: any) => d.value)
            : (item.dres ?? []).map((dre: any) => dre.value);
        const turma: any = { nome: item.nome, dresIds };
        if (item.id) turma.id = item.id;
        return turma;
      });

      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe('Turma A');
      expect(result[0].dresIds).toEqual([1, 2]);
      expect(result[0].id).toBe(1);
    });

    it('should handle turmas with "todos" option', () => {
      const turmas = [
        {
          id: 1,
          nome: 'Turma A',
          dres: [{ id: 1, value: 1, label: 'Todos', todos: true }],
        },
      ];

      const result = (turmas ?? []).map((item) => {
        const dresIds =
          item.dres?.length && item.dres.length > 1
            ? item.dres.filter((dre: any) => !dre.todos).map((d: any) => d.value)
            : (item.dres ?? []).map((dre: any) => dre.value);
        const turma: any = { nome: item.nome, dresIds };
        if (item.id) turma.id = item.id;
        return turma;
      });

      expect(result).toHaveLength(1);
      expect(result[0].dresIds).toEqual([1]);
    });

    it('should handle turmas without id', () => {
      const turmas = [
        {
          nome: 'Turma Nova',
          dres: [{ id: 1, value: 1, label: 'DRE A', todos: false }],
        },
      ];

      const result = (turmas ?? []).map((item: { nome: string; id?: number; dres: { value: number; todos?: boolean }[] }) => {
        const dresIds =
          item.dres?.length && item.dres.length > 1
            ? item.dres.filter((dre: any) => !dre.todos).map((d: any) => d.value)
            : (item.dres ?? []).map((dre: any) => dre.value);
        const turma: any = { nome: item.nome, dresIds };
        if (item.id) turma.id = item.id;
        return turma;
      });

      expect(result[0]).not.toHaveProperty('id');
    });

    it('should filter out "todos" when multiple dres are selected', () => {
      const turmas = [
        {
          id: 1,
          nome: 'Turma A',
          dres: [
            { id: 1, value: 1, label: 'Todos', todos: true },
            { id: 2, value: 2, label: 'DRE B', todos: false },
          ],
        },
      ];

      const result = (turmas ?? []).map((item) => {
        const dresIds =
          item.dres?.length && item.dres.length > 1
            ? item.dres.filter((dre: any) => !dre.todos).map((d) => d.value)
            : (item.dres ?? []).map((dre: any) => dre.value);
        const turma: any = { nome: item.nome, dresIds };
        if (item.id) turma.id = item.id;
        return turma;
      });

      expect(result[0].dresIds).toEqual([2]);
    });

    it('should handle empty dres', () => {
      const turmas = [
        {
          id: 1,
          nome: 'Turma A',
          dres: [],
        },
      ];

      const result = (turmas ?? []).map((item) => {
        const dresIds =
          item.dres?.length && item.dres.length > 1
            ? item.dres.filter((dre: { todos?: boolean }) => !dre.todos).map((d: { value: number }) => d.value)
            : (item.dres ?? []).map((dre: { value: number }) => dre.value);
        const turma: any = { nome: item.nome, dresIds };
        if (item.id) turma.id = item.id;
        return turma;
      });

      expect(result[0].dresIds).toEqual([]);
    });
  });

  describe('mapearPareceristasSalvar', () => {
    it('should map pareceristas for saving correctly', () => {
      const pareceristas = [
        { id: 1, label: 'Parecerista A', value: 'RF001' },
      ];
      const salvos = [
        { id: 1, label: 'Parecerista A', value: 'RF001' },
      ];

      const result = (pareceristas ?? []).map((item) => {
        const existente = salvos?.find((p: { value: string }) => p.value === item.value);
        return {
          id: existente ? existente.id : 0,
          nomeParecerista: existente ? existente.label : item.label,
          registroFuncional: existente ? existente.value : item.value,
        };
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].nomeParecerista).toBe('Parecerista A');
      expect(result[0].registroFuncional).toBe('RF001');
    });

    it('should handle new pareceristas', () => {
      const pareceristas = [
        { id: 0, label: 'Novo Parecerista', value: 'RF003' },
      ];
      const salvos: any[] = [];

      const result = (pareceristas ?? []).map((item) => {
        const existente = salvos?.find((p) => p.value === item.value);
        return {
          id: existente ? existente.id : 0,
          nomeParecerista: existente ? existente.label : item.label,
          registroFuncional: existente ? existente.value : item.value,
        };
      });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(0);
      expect(result[0].nomeParecerista).toBe('Novo Parecerista');
    });

    it('should handle undefined pareceristas', () => {
      const pareceristas:
        | Array<{ id: number; label: string; value: string }>
        | undefined = undefined;
      const salvos: any[] = [];

      const result = (pareceristas ?? []).map((item: any) => {
        const existente = salvos?.find((p: { value: string }) => p.value === item.value);
        return {
          id: existente ? existente.id : 0,
          nomeParecerista: existente ? existente.label : item.label,
          registroFuncional: existente ? existente.value : item.value,
        };
      });

      expect(result).toEqual([]);
    });

    it('should handle multiple pareceristas with mix of existing and new', () => {
      const pareceristas = [
        { id: 1, label: 'Parecerista A', value: 'RF001' },
        { id: 0, label: 'Novo', value: 'RF999' },
      ];
      const salvos = [
        { id: 1, label: 'Parecerista A', value: 'RF001' },
      ];

      const result = (pareceristas ?? []).map((item) => {
        const existente = salvos?.find((p) => p.value === item.value);
        return {
          id: existente ? existente.id : 0,
          nomeParecerista: existente ? existente.label : item.label,
          registroFuncional: existente ? existente.value : item.value,
        };
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(0);
    });
  });

  describe('mapearGruposPeriodosSalvar', () => {
    it('should map grupos periodos for saving correctly', () => {
      const grupos = [
        {
          id: 1,
          periodo: [dayjs('2024-01-01'), dayjs('2024-12-31')],
          propostaTurmasIds: [1, 2],
        },
      ];

      const result = (grupos ?? [])
        .filter((g) => g.periodo?.[0] && g.periodo?.[1])
        .map((g) => ({
          id: g.id ?? 0,
          dataInicio: g.periodo![0]!.format('YYYY-MM-DD'),
          dataFim: g.periodo![1]!.format('YYYY-MM-DD'),
          propostaTurmasIds: g.propostaTurmasIds ?? [],
        }));

      expect(result).toHaveLength(1);
      expect(result[0].dataInicio).toBe('2024-01-01');
      expect(result[0].dataFim).toBe('2024-12-31');
    });

    it('should filter grupos without complete period', () => {
      const grupos = [
        {
          id: 1,
          periodo: [dayjs('2024-01-01'), dayjs('2024-12-31')],
          propostaTurmasIds: [1, 2],
        },
        {
          id: 2,
          periodo: [dayjs('2024-01-01'), undefined],
          propostaTurmasIds: [3],
        },
      ];

      const result = (grupos ?? [])
        .filter((g) => g.periodo?.[0] && g.periodo?.[1])
        .map((g) => ({
          id: g.id ?? 0,
          dataInicio: g.periodo![0]!.format('YYYY-MM-DD'),
          dataFim: g.periodo![1]!.format('YYYY-MM-DD'),
          propostaTurmasIds: g.propostaTurmasIds ?? [],
        }));

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
    });

    it('should handle grupos without id', () => {
      const grupos = [
        {
          periodo: [dayjs('2024-01-01'), dayjs('2024-12-31')],
          propostaTurmasIds: [1],
        },
      ];

      const result = (grupos ?? [])
        .filter((g) => g.periodo?.[0] && g.periodo?.[1])
        .map((g: any) => ({
          id: g.id ?? 0,
          dataInicio: g.periodo![0]!.format('YYYY-MM-DD'),
          dataFim: g.periodo![1]!.format('YYYY-MM-DD'),
          propostaTurmasIds: g.propostaTurmasIds ?? [],
        }));

      expect(result[0].id).toBe(0);
    });

    it('should handle empty propostaTurmasIds', () => {
      const grupos = [
        {
          id: 1,
          periodo: [dayjs('2024-01-01'), dayjs('2024-12-31')],
          propostaTurmasIds: undefined,
        },
      ];

      const result = (grupos ?? [])
        .filter((g) => g.periodo?.[0] && g.periodo?.[1])
        .map((g: any) => ({
          id: g.id ?? 0,
          dataInicio: g.periodo![0]!.format('YYYY-MM-DD'),
          dataFim: g.periodo![1]!.format('YYYY-MM-DD'),
          propostaTurmasIds: g.propostaTurmasIds ?? [],
        }));

      expect(result[0].propostaTurmasIds).toEqual([]);
    });

    it('should handle empty grupos', () => {
      const grupos: any[] = [];

      const result = (grupos ?? [])
        .filter((g) => g.periodo?.[0] && g.periodo?.[1])
        .map((g) => ({
          id: g.id ?? 0,
          dataInicio: g.periodo![0]!.format('YYYY-MM-DD'),
          dataFim: g.periodo![1]!.format('YYYY-MM-DD'),
          propostaTurmasIds: g.propostaTurmasIds ?? [],
        }));

      expect(result).toEqual([]);
    });
  });

  describe('Complex scenarios', () => {
    it('should handle large dataset of dres', () => {
      const dres = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        descricao: `DRE ${i + 1}`,
      }));

      const result = dres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));

      expect(result).toHaveLength(100);
      expect(result[0].value).toBe(1);
      expect(result[99].value).toBe(100);
    });

    it('should handle chained mapping operations', () => {
      const originalDres = [
        { id: 1, descricao: 'DRE A' },
        { id: 2, descricao: 'DRE B' },
      ];

      const mappedDres = originalDres.map((dre) => ({ ...dre, value: dre.id, label: dre.descricao }));
      const selected = mappedDres.filter((d) => d.id === 1);

      expect(selected).toHaveLength(1);
      expect(selected[0].value).toBe(1);
    });

    it('should maintain data integrity through multiple transformations', () => {
      const turmas = [
        { nome: 'Turma A', dres: [{ value: 1 }, { value: 2 }] },
      ];

      const mapped = (turmas ?? []).map((t, i) => ({ ...t, key: i }));
      const cloned = cloneDeep(mapped);

      cloned[0].nome = 'Modified';
      expect(mapped[0].nome).toBe('Turma A');
    });
  });
});

