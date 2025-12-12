export type InscricaoDTO = {
  propostaTurmaId: number | undefined;
  cargoCodigo: string | undefined;
  cargoDreCodigo: string | undefined;
  cargoUeCodigo: string | undefined;
  funcaoCodigo: string | undefined;
  funcaoDreCodigo: string | undefined;
  funcaoUeCodigo: string | undefined;
  arquivoId?: number;
  tipoVinculo: number | undefined;
  vagaRemanescente: boolean | undefined;
};
