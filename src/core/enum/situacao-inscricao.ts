export enum SituacaoInscricao {
  Confirmada = 1,
  Enviada = 2,
  EmAnalise = 3,
  Cancelada = 4,
}

export const SituacaoInscricaoTagDisplay: Record<SituacaoInscricao, string> = {
  [SituacaoInscricao.Confirmada]: 'Confirmada',
  [SituacaoInscricao.Enviada]: 'Enviada',
  [SituacaoInscricao.EmAnalise]: 'EmAnalise',
  [SituacaoInscricao.Cancelada]: 'Cancelada',
};
