import { Modalidade } from '../enum/modalidade';
import { TipoFormacao } from '../enum/tipo-formacao';

export type UsuarioAcessibilidadeResponseDTO = {
  usuarioId: number;
  possuiDeficiencia: boolean | null;
  descricaoDeficiencia?: string;
  necessitaAdaptacao?: boolean;
  descricaoAdaptacao?: string;
  salvar: boolean;
};

export type RetornoDetalheFormacaoDTO = {
  titulo?: string;
  areaPromotora?: string;
  tipoFormacao?: TipoFormacao;
  tipoFormacaoDescricao?: string;
  formato?: Modalidade;
  formatoDescricao?: string;
  periodo?: string;
  periodoInscricao?: string;
  justificativa?: string;
  publicosAlvo?: string[];
  palavrasChaves?: string[];
  inscricaoEncerrada: boolean;
  imagemUrl?: string;
  turmas: RetornoTurmaDetalheDTO[];
  linkParaInscricoesExterna?: string;
  usuarioAcessibilidade?: UsuarioAcessibilidadeResponseDTO | null;
};
export type RetornoTurmaDetalheDTO = {
  nome: string;
  periodos: string[];
  local: string;
  horario: string;
  inscricaoEncerrada: boolean;
};
