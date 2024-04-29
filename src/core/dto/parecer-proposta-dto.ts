import { CamposParecerEnum } from '../enum/campos-proposta-enum';
import { AuditoriaDTO } from './auditoria-dto';

export type PropostaParecerCompletoDTO = {
  propostaId: number;
  podeInserir?: boolean;
  auditoria?: AuditoriaDTO;
  exibirAuditoria?: boolean;
  itens: PropostaParecerDTO[];
};

export type PropostaParecerDTO = {
  id?: number;
  descricao: string;
  podeAlterar?: boolean;
  campo: CamposParecerEnum;
};

export type PropostaParecerCadastroDTO = {
  descricao: string;
  id: number | null;
} & PropostaParecerFiltroDTO;

export type PropostaParecerFiltroDTO = {
  propostaId?: number;
  campo: CamposParecerEnum;
};

export type TotalDePareceresDTO = {
  campo: CamposParecerEnum;
  quantidade: number;
};
