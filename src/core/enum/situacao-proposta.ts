export enum SituacaoProposta {
  Publicada = 1,
  Rascunho = 2,
  Cadastrada = 3,
  AguardandoAnaliseDf = 4,
  AguardandoAnaliseGestao = 5,
  Desfavoravel = 6,
  Devolvida = 7,
}

export const SituacaoPropostaTagDisplay: Record<SituacaoProposta, string> = {
  [SituacaoProposta.Publicada]: 'Publicada',
  [SituacaoProposta.Rascunho]: 'Rascunho',
  [SituacaoProposta.Cadastrada]: 'Cadastrada',
  [SituacaoProposta.AguardandoAnaliseDf]: 'Aguardando Análise DF',
  [SituacaoProposta.AguardandoAnaliseGestao]: 'Aguardando Análise da Gestão',
  [SituacaoProposta.Desfavoravel]: 'Desfavorável',
  [SituacaoProposta.Devolvida]: 'Devolvida',
};
