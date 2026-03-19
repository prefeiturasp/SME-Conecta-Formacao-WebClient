export type UsuarioAcessibilidadeResponseDTO = {
  usuarioId?: number | null;
  possuiDeficiencia?: boolean | null;
  descricaoDeficiencia?: string;
  necessitaAdaptacao?: boolean;
  descricaoAdaptacao?: string;
  salvar?: boolean;
};

export type DadosUsuarioDTO = {
  nome?: string;
  cpf?: string;
  login?: string;
  email?: string;
  nomeUnidade?: string;
  emailEducacional?: string;
  tipo?: number;
  usuarioAcessibilidade?: UsuarioAcessibilidadeResponseDTO | null;
};
