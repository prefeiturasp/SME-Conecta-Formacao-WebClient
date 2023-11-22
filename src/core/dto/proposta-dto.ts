import { Dayjs } from 'dayjs';
import { Modalidade } from '../enum/modalidade';
import { SituacaoRegistro } from '../enum/situacao-registro';
import { TipoFormacao } from '../enum/tipo-formacao';
import { TipoInscricao } from '../enum/tipo-inscricao';
import { AuditoriaDTO } from './auditoria-dto';
import { PropostaCriterioValidacaoInscricaoDTO } from './proposta-criterio-validacao-inscricao-dto';
import { PropostaFuncaoEspecificaDTO } from './proposta-funcao-especifica-dto';
import { PropostaImagemDivulgacaoDTO } from './proposta-imagem-divulgacao-dto';
import { PropostaPublicoAlvoDTO } from './proposta-publico-alvo-dto';
import { PropostaVagaRemanecenteDTO } from './proposta-vaga-remanecente-dto';

export type PropostaDTO = {
  tipoFormacao?: TipoFormacao;
  modalidade?: Modalidade;
  tipoInscricao?: TipoInscricao;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeVagasTurma?: number | null;
  funcaoEspecificaOutros: string;
  criterioValidacaoInscricaoOutros: string;
  situacao: SituacaoRegistro;
  arquivoImagemDivulgacaoId?: number;
  dataRealizacaoInicio?: Dayjs;
  dataRealizacaoFim?: Dayjs;
  dataInscricaoInicio?: Dayjs;
  dataInscricaoFim?: Dayjs;
  publicosAlvo: PropostaPublicoAlvoDTO[];
  funcoesEspecificas: PropostaFuncaoEspecificaDTO[];
  vagasRemanecentes: PropostaVagaRemanecenteDTO[];
  criteriosValidacaoInscricao: PropostaCriterioValidacaoInscricaoDTO[];
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves: PropostaPalavraChaveDTO[];
  criterioCertificacao: CriterioCertificacaoDTO[];
  cursoComCertificado: boolean;
  acaoInformativa: boolean;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
  descricaoDaAtividade?: string;
};

export type PropostaCompletoDTO = {
  auditoria: AuditoriaDTO;
  arquivoImagemDivulgacao?: PropostaImagemDivulgacaoDTO;
} & PropostaDTO;

export type PropostaFormDTO = {
  tipoFormacao?: TipoFormacao;
  modalidade?: Modalidade;
  tipoInscricao?: TipoInscricao;
  nomeFormacao?: string;
  quantidadeTurmas?: number | null;
  quantidadeVagasTurma?: number | null;
  publicosAlvo?: number[];
  funcoesEspecificas?: number[];
  funcaoEspecificaOutros?: string;
  vagasRemanecentes?: number[];
  criteriosValidacaoInscricao?: number[];
  criterioValidacaoInscricaoOutros?: string;
  situacao: SituacaoRegistro;
  auditoria?: AuditoriaDTO;
  arquivos?: any[];
  periodoRealizacao?: Dayjs[];
  periodoInscricao?: Dayjs[];
  cargaHorariaPresencial?: string;
  cargaHorariaSincrona?: string;
  cargaHorariaDistancia?: string;
  justificativa?: string;
  objetivos?: string;
  referencia?: string;
  procedimentoMetadologico?: string;
  conteudoProgramatico?: string;
  palavrasChaves?: number[];
  criterioCertificacao: number[];
  cursoComCertificado: boolean;
  acaoInformativa: boolean;
  descricaoDaAtividade?: string;
  acaoFormativaTexto?: string;
  acaoFormativaLink?: string;
};
export type PropostaPalavraChaveDTO = {
  palavraChaveId: number;
};

export type CriterioCertificacaoDTO = {
  criterioCertificacaoId: number;
};
