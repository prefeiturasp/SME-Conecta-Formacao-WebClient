import { AuditoriaDTO } from './auditoria-dto';

export type CadastroAreaPromotoraDTO = {
  nome: string;
  tipo: string;
} & AuditoriaDTO;
