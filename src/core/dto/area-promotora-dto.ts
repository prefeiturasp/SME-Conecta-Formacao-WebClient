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
  visaoId: number;
  grupoId: any;
  telefones: TelefoneAreaPromotora[];
  emails: EmailAreaPromotora[];
  auditoria: AuditoriaDTO;
};
