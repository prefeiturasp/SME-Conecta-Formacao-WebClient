export type CadastroUsuarioDTO = {
  email: string;
  codigoUnidade: string;
  nome: string;
  cpf: string;
  senha: string;
  confirmarSenha: string;
  emailEducacional: string;
  tipoEmail: number;
};

export type CadastroUsuarioFormDTO = {
  email: string;
  confirmarEmail: string;
  codigoUnidade: string;
  nomePessoa: string;
  cpf: string;
  senha: string;
  emailEducacional: string;
  confirmarSenha: string;
  tipoEmail: number;
  ues: string[];
};

export type RetornoCadastroUsuarioDTO = {
  mensagem: string;
};
