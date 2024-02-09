export type CadastroUsuarioDTO = {
  email: string;
  codigoUe: string;
  nome: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
};

export type CadastroUsuarioFormDTO = {
  email: string;
  codigoUE: string;
  nomePessoa: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
  ues: string[];
};
