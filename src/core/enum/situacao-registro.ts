export enum SituacaoRegistro {
  Publicada = 1,
  Rascunho = 2,
  Cadastrada = 3,
  AguardandoAnaliseDF = 4,
}

export const SituacaoRegistroTagDisplay: Record<SituacaoRegistro, string> = {
  [SituacaoRegistro.Publicada]: 'Publicada',
  [SituacaoRegistro.Rascunho]: 'Rascunho',
  [SituacaoRegistro.Cadastrada]: 'Cadastrada',
  [SituacaoRegistro.AguardandoAnaliseDF]: 'Aguardando Análise DF',
};
