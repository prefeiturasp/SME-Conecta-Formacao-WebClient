import { CampoConsideracaoEnum } from '../enum/campos-proposta-enum';
import { AuditoriaDTO } from './auditoria-dto';

export type PropostaParecerCompletoDTO = {
  propostaId: number;
  podeInserir?: boolean;
  auditoria?: AuditoriaDTO;
  itens: PropostaPareceristaConsideracaoDTO[];
};

export type PropostaPareceristaConsideracaoDTO = {
  id?: number;
  descricao: string;
  podeAlterar?: boolean;
  campo: CampoConsideracaoEnum;
  auditoria?: AuditoriaDTO;
};

export type PropostaPareceristaConsideracaoCadastroDTO = {
  descricao: string;
  id: number | null;
} & PropostaParecerFiltroDTO;

export type PropostaParecerFiltroDTO = {
  propostaId?: number;
  campo: CampoConsideracaoEnum;
};

export type TotalDeConsideracoes = {
  campo: CampoConsideracaoEnum;
  quantidade: number;
};
