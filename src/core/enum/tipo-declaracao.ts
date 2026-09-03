export enum TipoDeclaracao {
  NaoDefinido = 0,
  Cursista = 1,
  Regente = 2,
}

export const TipoDeclaracaoDescricao: Record<TipoDeclaracao, string> = {
  [TipoDeclaracao.NaoDefinido]: 'Não definido',
  [TipoDeclaracao.Cursista]: 'Cursista',
  [TipoDeclaracao.Regente]: 'Regente',
};
