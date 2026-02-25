export enum TipoCertificado {
  NaoDefinido = 0,
  Cursista = 1,
  Regente = 2,
}

export const TipoCertificadoDescricao: Record<TipoCertificado, string> = {
  [TipoCertificado.NaoDefinido]: 'Não definido',
  [TipoCertificado.Cursista]: 'Cursista',
  [TipoCertificado.Regente]: 'Regente',
};
