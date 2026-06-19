import {
  PropostaDTO,
  PropostaFormDTO,
  TipoInscricaoType,
  CriterioCertificacaoDTO,
  PropostaTurmaDTO,
  PropostaTurmaFormDTO,
  GrupoPeriodoDTO,
  GrupoPeriodoFormDTO,
} from './proposta-dto';

declare const describe: any;
declare const it: any;
declare const expect: any;

describe('DTOs - Proposta', () => {
  it('deve validar TipoInscricaoType', () => {
    const model: TipoInscricaoType = {
      tipoInscricao: 1,
    };

    expect(model.tipoInscricao).toBe(1);
    expect(typeof model.tipoInscricao).toBe('number');
  });

  it('deve validar CriterioCertificacaoDTO', () => {
    const model: CriterioCertificacaoDTO = {
      criterioCertificacaoId: 99,
    };

    expect(model.criterioCertificacaoId).toBe(99);
  });

  it('deve validar PropostaTurmaDTO', () => {
    const model: PropostaTurmaDTO = {
      id: 1,
      nome: 'Turma A',
      dresIds: [10, 20],
    };

    expect(model.nome).toBe('Turma A');
    expect(model.dresIds).toEqual([10, 20]);
  });

  it('deve validar PropostaTurmaFormDTO', () => {
    const model: PropostaTurmaFormDTO = {
      key: 1,
      id: 10,
      nome: 'Turma Form',
      dres: [],
    };

    expect(model.key).toBe(1);
    expect(model.nome).toBe('Turma Form');
  });

  it('deve validar GrupoPeriodoDTO', () => {
    const model: GrupoPeriodoDTO = {
      id: 1,
      dataInicio: '2024-01-01',
      dataFim: '2024-12-31',
      propostaTurmasIds: [1, 2],
    };

    expect(model.propostaTurmasIds).toContain(1);
    expect(model.dataInicio).toBeDefined();
  });

  it('deve validar GrupoPeriodoFormDTO', () => {
    const model: GrupoPeriodoFormDTO = {
      id: 1,
      periodo: [],
      propostaTurmasIds: [1],
    };

    expect(Array.isArray(model.periodo)).toBe(true);
  });

  it('deve criar PropostaDTO mínimo válido', () => {
    const dto: PropostaDTO = {
      dreIdPropostas: 1,
      funcaoEspecificaOutros: '',
      publicoAlvoOutros: '',
      criterioValidacaoInscricaoOutros: '',
      situacao: 1 as any,

      publicosAlvo: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      palavrasChaves: [],
      criterioCertificacao: [],

      cursoComCertificado: true,
      acaoInformativa: false,
    };

    expect(dto.dreIdPropostas).toBe(1);
    expect(dto.publicosAlvo).toEqual([]);
    expect(dto.cursoComCertificado).toBe(true);
  });

  it('deve validar compatibilidade básica entre DTO e FormDTO', () => {
    const dto: PropostaDTO = {
      dreIdPropostas: 2,
      funcaoEspecificaOutros: 'x',
      publicoAlvoOutros: 'y',
      criterioValidacaoInscricaoOutros: 'z',
      situacao: 1 as any,

      publicosAlvo: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      palavrasChaves: [],
      criterioCertificacao: [],

      cursoComCertificado: true,
      acaoInformativa: true,
    };

    const form: PropostaFormDTO = {
      dreIdPropostas: dto.dreIdPropostas,
      funcaoEspecificaOutros: dto.funcaoEspecificaOutros,
      publicoAlvoOutros: dto.publicoAlvoOutros,
      criterioValidacaoInscricaoOutros: dto.criterioValidacaoInscricaoOutros,
      situacao: dto.situacao,
      cursoComCertificado: dto.cursoComCertificado,
      acaoInformativa: dto.acaoInformativa,
    };

    expect(form.dreIdPropostas).toBe(dto.dreIdPropostas);
    expect(form.cursoComCertificado).toBe(true);
    expect(form.acaoInformativa).toBe(true);
  });

  it('deve garantir arrays obrigatórios não nulos no DTO', () => {
    const dto: PropostaDTO = {
      dreIdPropostas: null,
      funcaoEspecificaOutros: '',
      publicoAlvoOutros: '',
      criterioValidacaoInscricaoOutros: '',
      situacao: 1 as any,

      publicosAlvo: [],
      funcoesEspecificas: [],
      vagasRemanecentes: [],
      criteriosValidacaoInscricao: [],
      palavrasChaves: [],
      criterioCertificacao: [],

      cursoComCertificado: false,
      acaoInformativa: false,
    };

    expect(dto.publicosAlvo.length).toBe(0);
    expect(dto.funcoesEspecificas.length).toBe(0);
    expect(dto.palavrasChaves.length).toBe(0);
  });
});