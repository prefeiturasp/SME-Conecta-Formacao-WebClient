export enum StatusCodafSuplementar {
  Iniciado = 1,
  Aguardando = 2,
  Finalizado = 3
}

export const SituacaoCodafSuplementarTagDisplay: Record<StatusCodafSuplementar, string> = {
  [StatusCodafSuplementar.Iniciado]: 'Iniciado',
  [StatusCodafSuplementar.Aguardando]: 'Aguardando',
  [StatusCodafSuplementar.Finalizado]: 'Finalizado'
};
