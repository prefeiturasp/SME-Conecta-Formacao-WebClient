export type StepItemPropostaType = {
  NUMERO: number;
  TITULO: string;
};

type StepPropostaType = {
  INFORMACOES_GERAIS: StepItemPropostaType;
  DETALHAMENTO: StepItemPropostaType;
  DATAS: StepItemPropostaType;
  PROFISSIONAIS: StepItemPropostaType;
  CERTIFICACAO: StepItemPropostaType;
};

export enum StepPropostaEnum {
  InformacoesGerais = 0,
  Detalhamento = 1,
  Datas = 2,
  Profissionais = 3,
  Certificacao = 4,
}

export const STEP_PROPOSTA: StepPropostaType = {
  INFORMACOES_GERAIS: {
    NUMERO: StepPropostaEnum.InformacoesGerais,
    TITULO: 'Informações gerais',
  },
  DETALHAMENTO: {
    NUMERO: StepPropostaEnum.Detalhamento,
    TITULO: 'Detalhamento',
  },
  DATAS: {
    NUMERO: StepPropostaEnum.Datas,
    TITULO: 'Datas',
  },
  PROFISSIONAIS: {
    NUMERO: StepPropostaEnum.Profissionais,
    TITULO: 'Profissionais',
  },
  CERTIFICACAO: {
    NUMERO: StepPropostaEnum.Certificacao,
    TITULO: 'Certificação',
  },
};
