export enum SituacaoInscricao {
  Confirmada = 1,
  Enviada = 2,
  EmAnalise = 3,
  Cancelada = 4,
  EmEspera = 5,
}

export const SituacaoInscricaoTagDisplay: Record<SituacaoInscricao, string> = {
  [SituacaoInscricao.Confirmada]: 'Confirmada',
  [SituacaoInscricao.Enviada]: 'Enviada',
  [SituacaoInscricao.EmAnalise]: 'Em Análise',
  [SituacaoInscricao.Cancelada]: 'Cancelada',
  [SituacaoInscricao.EmEspera]: 'Em Espera',
};
