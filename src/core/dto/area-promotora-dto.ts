import { EntidadeBaseAuditavel } from './auditoria-dto';

export type AreaPromotoraDTO = {
  nome: string;
  tipo: number;
  grupoId: string;
  telefones: string[];
  email: string;
} & EntidadeBaseAuditavel;
