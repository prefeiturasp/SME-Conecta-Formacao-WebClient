export type PermissaoMenusAcoesDTO = {
  podeExcluir?: boolean;
  podeAlterar?: boolean;
  podeIncluir?: boolean;
  podeConsultar?: boolean;
  customRoles?: string[];
  somenteConsulta?: boolean;
};
