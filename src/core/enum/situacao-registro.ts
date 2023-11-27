export enum SituacaoRegistro {
  Favoravel = 1,
  Rascunho = 2,
  Cadastrada = 3,
  AguardandoAnaliseDF = 4,
  AguardandoAnaliseGestao = 5,
  Desfavoravel = 6,
  Devolvida = 7,
}

export const SituacaoRegistroTagDisplay: Record<SituacaoRegistro, string> = {
  [SituacaoRegistro.Favoravel]: 'Favorável',
  [SituacaoRegistro.Rascunho]: 'Rascunho',
  [SituacaoRegistro.Cadastrada]: 'Cadastrada',
  [SituacaoRegistro.AguardandoAnaliseDF]: 'Aguardando Análise DF',
  [SituacaoRegistro.AguardandoAnaliseGestao]: 'Aguardando Análise Gestão',
  [SituacaoRegistro.Desfavoravel]: 'Desfavorável',
  [SituacaoRegistro.Devolvida]: 'Devolvida',
};
