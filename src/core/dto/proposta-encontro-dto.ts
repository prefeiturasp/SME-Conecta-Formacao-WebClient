import { TipoEncontro } from '../enum/tipo-encontro';

export type PropostaEncontroDTO = {
  id?: number;
  propostaId: string | number;
  horaInicio: string | null;
  horaFim: string | null;
  tipo: TipoEncontro | null;
  local: string | null;
  turmas: PropostaEncontroTurmaDTO[];
  datas: PropostaEncontroDataDTO[];
};

export type PropostaEncontroPaginadoDTO = {
  id?: number;
  quantidadeDiasEncontro?: number;
  tipo: TipoEncontro | null;
  local: string | null;
  turmas: PropostaEncontroTurmaDTO[];
  cronogramaDatas: PropostaEncontroCronogramaDataDTO[];
};

export type PropostaEncontroTurmaDTO = {
  turmaId: number;
  nome?: string;
};

export type PropostaEncontroDataDTO = {
  id?: number;
  dataInicio: string;
  dataFim?: string;
  horaInicio?: string;
  horaFim?: string;
};

export type PropostaEncontroCronogramaDataDTO = {
  id?: number;
  data: string;
  horaInicio: string;
  horaFim: string;
};
