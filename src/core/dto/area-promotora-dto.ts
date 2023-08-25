import { EntidadeBaseAuditavel } from './auditoria-dto';

export type AreaPromotoraDTO = {
  nome: string;
  tipoId: number;
  grupoId: string;
  telefone: string;
  email: string;
} & EntidadeBaseAuditavel;
