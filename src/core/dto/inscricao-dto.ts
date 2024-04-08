export type InscricaoDTO = {
  propostaTurmaId: number | undefined;
  email: string;
  cargoCodigo: string | undefined;
  cargoDreCodigo: string | undefined;
  cargoUeCodigo: string | undefined;
  funcaoCodigo: string | undefined;
  funcaoDreCodigo: string | undefined;
  funcaoUeCodigo: string | undefined;
  arquivoId?: number;
  tipoVinculo: number | undefined;
};
