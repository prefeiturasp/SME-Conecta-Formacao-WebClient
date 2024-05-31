export type InscricaoManualDTO = {
  cpf: string;
  propostaTurmaId: number;
  podeContinuar?: boolean;
  registroFuncional: string;
  profissionalRede: boolean;
  cargoCodigo?: string;
  cargoDreCodigo?: string;
  cargoUeCodigo?: string;
  funcaoCodigo?: string;
  funcaoDreCodigo?: string;
  funcaoUeCodigo?: string;
  tipoVinculo?: string;
};
