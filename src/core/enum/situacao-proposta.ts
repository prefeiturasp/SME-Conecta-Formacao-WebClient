export enum SituacaoProposta {
  Publicada = 1,
  Rascunho = 2,
  Cadastrada = 3,
  AguardandoAnaliseDf = 4,
  AguardandoAnaliseGestao = 5,
  Desfavoravel = 6,
  Devolvida = 7,
  Alterando = 8,
  Aprovada = 9,
  AguardandoAnaliseParecerista = 10,
  AguardandoAnaliseParecerDF = 11,
  AnaliseParecerAreaPromotora = 12,
}

export const SituacaoPropostaTagDisplay: Record<SituacaoProposta, string> = {
  [SituacaoProposta.Publicada]: 'Publicada',
  [SituacaoProposta.Rascunho]: 'Rascunho',
  [SituacaoProposta.Cadastrada]: 'Cadastrada',
  [SituacaoProposta.AguardandoAnaliseDf]: 'Aguardando análise da DF',
  [SituacaoProposta.AguardandoAnaliseGestao]: 'Aguardando análise da gestão',
  [SituacaoProposta.Desfavoravel]: 'Desfavorável',
  [SituacaoProposta.Devolvida]: 'Devolvida',
  [SituacaoProposta.Alterando]: 'Alterando',
  [SituacaoProposta.Aprovada]: 'Aprovada',
  [SituacaoProposta.AguardandoAnaliseParecerista]: 'Aguardando análise do Parecerista',
  [SituacaoProposta.AguardandoAnaliseParecerDF]: 'Aguardando análise do parecer (DF)',
  [SituacaoProposta.AnaliseParecerAreaPromotora]: 'Análise do parecer pela área promotora',
};
