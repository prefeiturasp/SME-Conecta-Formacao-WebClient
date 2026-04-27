import { CadastroCoordenadoriaDTO } from '../services/coordenadoria-service';
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
  grupoId?: string | null;
  perfil?: any;
  telefones: TelefoneAreaPromotora[];
  emails: EmailAreaPromotora[];
  auditoria?: AuditoriaDTO;
  coordenadoria?: CadastroCoordenadoriaDTO;
};

export type CadastroAreaPromotoraRequestDTO = {
  nome: string;
  tipo: number;
  dreId?: number;
  coordenadoriaId?: number;
  grupoId?: string | null;
  telefones: TelefoneAreaPromotora[];
  emails: EmailAreaPromotora[];
};