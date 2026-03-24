export type UsuarioAcessibilidadeDTO = {
  possuiDeficiencia: boolean | null;
  descricaoDeficiencia?: string;
  necessitaAdaptacao?: boolean;
  descricaoAdaptacao?: string;
  salvar: boolean;
};

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
  usuarioAcessibilidade?: UsuarioAcessibilidadeDTO;
  usuarioLogin?: string;
};
