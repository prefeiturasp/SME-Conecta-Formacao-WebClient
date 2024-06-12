export type UsuarioRedeParceriaPaginadoDTO = {
  id?: number;
  areaPromotoraId: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  situacao: string;
};

export type UsuarioRedeParceriaDTO = {
  areaPromotoraId: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
};
