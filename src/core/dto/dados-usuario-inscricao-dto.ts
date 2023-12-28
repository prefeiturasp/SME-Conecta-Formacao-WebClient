export type DadosUsuarioInscricaoDTO = {
  formacaoNome?: string;
  usuarioNome: string;
  usuarioRf: string;
  usuarioCpf: string;
  usuarioEmail: string;
  usuarioCargos: number[] | string;
  usuarioFuncoes: number[];
  arquivoId?: number[];
  propostaTurmaId?: number[];
};
