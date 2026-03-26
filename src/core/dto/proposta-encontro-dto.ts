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
  datas: PropostaEncontroDataDTO[];
} & PropostaEncontroDTO;

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
