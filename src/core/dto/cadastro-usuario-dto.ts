export type CadastroUsuarioDTO = {
  email: string;
  codigoUnidade: string;
  nome: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
};

export type CadastroUsuarioFormDTO = {
  email: string;
  codigoUnidade: string;
  nomePessoa: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
  ues: string[];
};
