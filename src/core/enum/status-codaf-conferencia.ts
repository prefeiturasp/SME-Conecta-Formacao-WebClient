export enum StatusCodafConferencia {
  INICIADO = 1,
  AGUARDANDO_FINALIZACAO = 2,
  FINALIZADO = 3,
}

export const SituacaoCodafConferenciaTagDisplay: Record<StatusCodafConferencia, string> = {
  [StatusCodafConferencia.INICIADO]: 'Iniciado',
  [StatusCodafConferencia.AGUARDANDO_FINALIZACAO]: 'Aguardando Finalização',
  [StatusCodafConferencia.FINALIZADO]: 'Finalizado',
};
