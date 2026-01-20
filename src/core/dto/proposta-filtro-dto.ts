import { SituacaoProposta } from '../enum/situacao-proposta';

export type PropostaFiltrosDTO = {
  id: number | null;
  areaPromotoraId: number | null;
  formato: number | null;
  publicoAlvoIds: number[] | null;
  nomeFormacao: string | null;
  numeroHomologacao: number | null;
  periodoRealizacaoInicio: string | null;
  periodoRealizacaoFim: string | null;
  situacao: SituacaoProposta | null;
  revalidacao: number | null;
};
