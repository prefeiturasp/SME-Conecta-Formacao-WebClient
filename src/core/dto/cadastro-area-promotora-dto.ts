import { EntidadeBaseAuditavel } from './auditoria-dto';

export type CadastroAreaPromotoraDTO = {
  nome: string;
  tipo: string;
} & EntidadeBaseAuditavel;
