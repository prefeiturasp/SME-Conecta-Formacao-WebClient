import { Modalidade } from '../enum/modalidade';
import { TipoFormacao } from '../enum/tipo-formacao';

export type RetornoDetalheFormacaoDTO = {
  titulo?: string;
  areaPromotora?: string;
  tipoFormacao?: TipoFormacao;
  tipoFormacaoDescricao?: string;
  formato?: Modalidade;
  formatoDescricao?: string;
  periodo?: string;
  justificativa?: string;
  publicosAlvo?: string[];
  palavrasChaves?: string[];
  inscricaoEncerrada: boolean;
  imagemUrl?: string;
  turmas: RetornoTurmaDetalheDTO[];
};
export type RetornoTurmaDetalheDTO = {
  nome: string;
  periodos: string[];
  local: string;
  horario: string;
  inscricaoEncerrada: boolean;
};
