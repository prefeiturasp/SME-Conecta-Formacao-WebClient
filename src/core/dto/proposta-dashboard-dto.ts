import { SituacaoProposta } from '../enum/situacao-proposta';

export type PropostasItemDTO = {
  data: string;
  nome: string;
  numero: number;
};

export type PropostaDashboardDTO = {
  situacao: SituacaoProposta;
  cor: string;
  verMais: boolean;
  totalRegistros: number;
  propostas: PropostasItemDTO[];
};
