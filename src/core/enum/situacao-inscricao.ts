export enum SituacaoInscricao {
  Confirmada = 1,
  Enviada = 2,
  EmAnalise = 3,
  Cancelada = 4,
  EmEspera = 5,
  Transferida = 6,
}

export const SituacaoInscricaoTagDisplay: Record<SituacaoInscricao, string> = {
  [SituacaoInscricao.Confirmada]: 'Confirmada',
  [SituacaoInscricao.Enviada]: 'Enviada',
  [SituacaoInscricao.EmAnalise]: 'Aguardando Análise',
  [SituacaoInscricao.Cancelada]: 'Cancelada',
  [SituacaoInscricao.EmEspera]: 'Em Espera',
  [SituacaoInscricao.Transferida]: 'Transferida',
};
