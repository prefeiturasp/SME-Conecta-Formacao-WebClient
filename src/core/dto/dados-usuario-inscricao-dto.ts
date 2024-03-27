export type DadosCompletoInscricaoCargoEolDTO = {
  funcoes: DadosInscricaoCargoEolDTO[] | undefined;
};

export type DadosInscricaoCargoEolDTO = {
  codigo: string;
  descricao: string;
  dreCodigo: string;
  ueCodigo: string;
  tipoVinculo: number;
} & DadosCompletoInscricaoCargoEolDTO;

export type DadosInscricaoDTO = {
  usuarioNome: string;
  usuarioRf: string;
  usuarioCpf: string;
  usuarioEmail: string;
  usuarioCargos: DadosInscricaoCargoEolDTO[];
  usuarioCargoSelecionado?: string;
  usuarioFuncaoSelecionado?: string;
  arquivoId?: number;
  propostaTurmaId?: number;
};

export type VinculoInscricaoDTO = {
  cargoCodigo: string;
  tipoVinculo: number;
}
