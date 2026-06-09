import { Modalidade } from '../enum/modalidade';
import { TipoFormacao } from '../enum/tipo-formacao';

export type UsuarioAcessibilidadeResponseDto = {
  usuarioId: number;
  possuiDeficiencia: boolean | null;
  descricaoDeficiencia?: string;
  necessitaAdaptacao?: boolean;
  descricaoAdaptacao?: string;
  salvar: boolean;
};

export type RetornoDetalheFormacaoDto = {
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
  turmas: RetornoTurmaDetalheDto[];
  linkParaInscricoesExterna?: string;
  usuarioAcessibilidade?: UsuarioAcessibilidadeResponseDto | null;
};
export type DataEncontroNovoDto = {
  dataInicial: string;
  dataFinal: string | null;
  horaInicial: string;
  horaFinal: string;
};

export type ModeloHorario = 'legado' | 'novo';

export type RetornoTurmaDetalheDto = {
  nome: string;
  periodos: string[];
  local: string;
  horario: string;
  inscricaoEncerrada: boolean;
  dataInicio?: string;
  dataFim?: string;
  dataEncontrosNovo?: DataEncontroNovoDto[];
  modeloHorario?: ModeloHorario;
};
