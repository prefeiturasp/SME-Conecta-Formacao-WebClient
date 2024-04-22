export enum SituacaoImportacaoArquivoEnum {
  CarregamentoInicial = 1,
  Enviado = 2,
  Validando = 3,
  Validado = 4,
  Processando = 5,
  Processado = 6,
  Cancelado = 7,
  AguardandoProcessamento = 8,
}

export const SituacaoImportacaoArquivoEnumDisplay: Record<SituacaoImportacaoArquivoEnum, string> = {
  [SituacaoImportacaoArquivoEnum.CarregamentoInicial]: 'Carregamento inicial',
  [SituacaoImportacaoArquivoEnum.Enviado]: 'Enviado',
  [SituacaoImportacaoArquivoEnum.Validando]: 'Validando',
  [SituacaoImportacaoArquivoEnum.Validado]: 'Validado',
  [SituacaoImportacaoArquivoEnum.Processando]: 'Processando',
  [SituacaoImportacaoArquivoEnum.Processado]: 'Processado',
  [SituacaoImportacaoArquivoEnum.Cancelado]: 'Cancelado',
  [SituacaoImportacaoArquivoEnum.AguardandoProcessamento]: 'Aguardando processamento',
};
