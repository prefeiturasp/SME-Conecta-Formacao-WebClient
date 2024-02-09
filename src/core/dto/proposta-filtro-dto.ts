import { SituacaoRegistro } from '../enum/situacao-registro';

export type PropostaFiltrosDTO = {
  id: number | null;
  areaPromotoraId: number | null;
  formato: number | null;
  publicoAlvoIds: number[] | null;
  nomeFormacao: string | null;
  numeroHomologacao: number | null;
  periodoRealizacaoInicio: string | null;
  periodoRealizacaoFim: string | null;
  situacao: SituacaoRegistro | null;
};
