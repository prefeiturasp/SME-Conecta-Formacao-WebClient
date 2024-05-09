import { CamposParecerEnum } from '../enum/campos-proposta-enum';
import { AuditoriaDTO } from './auditoria-dto';

export type PropostaParecerCompletoDTO = {
  propostaId: number;
  podeInserir?: boolean;
  auditoria?: AuditoriaDTO;
  itens: PropostaParecerDTO[];
};

// TODO: MUDAR "PropostaParecerDTO" PARA "PropostaPareceristaConsideracaoDTO"
export type PropostaParecerDTO = {
  id?: number;
  descricao: string;
  podeAlterar?: boolean;
  campo: CamposParecerEnum;
  auditoria?: AuditoriaDTO;
};

// TODO: MUDAR "PropostaParecerCadastroDTO" PARA "PropostaPareceristaConsideracaoCadastroDTO"
export type PropostaParecerCadastroDTO = {
  descricao: string;
  id: number | null;
  // TODO: AJUSTAR PERSISTENCIA
  // propostaPareceristaId: number;
  // campo: CamposParecerEnum;
} & PropostaParecerFiltroDTO;

export type PropostaParecerFiltroDTO = {
  propostaId?: number;
  campo: CamposParecerEnum;
};

export type TotalDeConsideracoes = {
  campo: CamposParecerEnum;
  quantidade: number;
};
