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

export const SituacaoPropostaCorTagDisplay: Record<SituacaoProposta, string> = {
  [SituacaoProposta.Publicada]: '#D06D12',
  [SituacaoProposta.Rascunho]: '#000000',
  [SituacaoProposta.Cadastrada]: '#297805',
  [SituacaoProposta.AguardandoAnaliseDf]: '#6464FF',
  [SituacaoProposta.AguardandoAnaliseGestao]: '#000000',
  [SituacaoProposta.Desfavoravel]: '#A50E05',
  [SituacaoProposta.Devolvida]: '#EEC25E',
};
