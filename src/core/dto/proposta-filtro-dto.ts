import { Modalidade } from '../enum/modalidade';
import { SituacaoRegistro } from '../enum/situacao-registro';

export type PropostaFiltrosDTO = {
  areaPromotoraId: number | null;
  modalidade: Modalidade | null;
  publicoAlvoId: number | null;
  nomeFormacao: string | null;
  numeroHomologacao: number | null;
  periodoRealizacaoInicio: string | null;
  periodoRealizacaoFim: string | null;
  situacao: SituacaoRegistro | null;
};
