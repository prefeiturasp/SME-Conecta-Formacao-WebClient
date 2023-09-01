export type StepItemPropostaType = {
  NUMERO: number;
  TITULO: string;
};

type StepPropostaType = {
  INFORMACOES_GERAIS: StepItemPropostaType;
  DATAS: StepItemPropostaType;
  DETALHAMENTO: StepItemPropostaType;
  PROFISSIONAIS: StepItemPropostaType;
  CERTIFICACAO: StepItemPropostaType;
};

export enum StepPropostaEnum {
  InformacoesGerais = 0,
  Datas = 1,
  Detalhamento = 2,
  Profissionais = 3,
  Certificacao = 4,
}

export const STEP_PROPOSTA: StepPropostaType = {
  INFORMACOES_GERAIS: {
    NUMERO: StepPropostaEnum.InformacoesGerais,
    TITULO: 'Informações gerais',
  },
  DATAS: {
    NUMERO: StepPropostaEnum.Datas,
    TITULO: 'Datas',
  },
  DETALHAMENTO: {
    NUMERO: StepPropostaEnum.Detalhamento,
    TITULO: 'Detalhamento',
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
