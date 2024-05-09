export enum SituacaoParecerista {
  Aprovada = 1,
  Recusada = 2,
  Enviada = 3,
  AguardandoValidacao = 4,
  AguardandoRevalidacao = 5,
  Desativado = 7,
}

export const SituacaoPareceristaEnumDisplay: Record<SituacaoParecerista, string> = {
  [SituacaoParecerista.Aprovada]: 'Aprovada',
  [SituacaoParecerista.Recusada]: 'Recusada',
  [SituacaoParecerista.Enviada]: 'Enviada',
  [SituacaoParecerista.AguardandoValidacao]: 'Aguardando Validação',
  [SituacaoParecerista.AguardandoRevalidacao]: 'Adicionando revalidação',
  [SituacaoParecerista.Desativado]: 'Desativado - Parecerista excluído',
};
