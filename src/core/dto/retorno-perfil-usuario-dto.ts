import { PerfilUsuarioDTO } from './perfil-usuario-dto';

export interface RetornoPerfilUsuarioDTO {
  usuarioNome: string;
  usuarioLogin: string;
  dataHoraExpiracao: string;
  token: string;
  email: string;
  autenticado: boolean;
  perfilUsuario: PerfilUsuarioDTO[];
}
