import { EntidadeBaseAuditavel } from './auditoria-dto';

export type EmailAreaPromotora = {
  email: string;
};

export type TelefoneAreaPromotora = {
  telefone: string;
};

export type AreaPromotoraDTO = {
  nome: string;
  tipo: number;
  grupoId: string;
  telefones: TelefoneAreaPromotora[];
  emails: EmailAreaPromotora[];
  auditoria: EntidadeBaseAuditavel;
};
