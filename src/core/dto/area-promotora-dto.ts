import { AuditoriaDTO } from './auditoria-dto';

export type EmailAreaPromotora = {
  email: string;
};

export type TelefoneAreaPromotora = {
  telefone: string;
};

export type AreaPromotoraDTO = {
  nome: string;
  tipo: number;
  dreId: number;
  grupoId: string & { label?: string; value?: string };
  telefones: TelefoneAreaPromotora[];
  emails: EmailAreaPromotora[];
  auditoria: AuditoriaDTO;
};
