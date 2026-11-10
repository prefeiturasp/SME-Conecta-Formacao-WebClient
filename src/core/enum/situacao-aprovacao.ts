export enum SituacaoAprovacao {
  Aprovado = 1,
  Reprovado = 2,
  EmAndamento = 3
}

export const SituacaoAprovacaoTagDisplay: Record<SituacaoAprovacao, string> = {
  [SituacaoAprovacao.Aprovado]: 'Aprovado',
  [SituacaoAprovacao.Reprovado]: 'Reprovado',
  [SituacaoAprovacao.EmAndamento]: 'Em Andamento'
};
