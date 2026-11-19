import {
  alterarRegistro,
  ApiResult,
  deletarRegistro,
  inserirRegistro,
  obterRegistro,
} from './api';
import { CodafAnexoTemporarioDTO } from './codaf-service-shared';
import { AnexoCodafDetalheDTO } from './codaf-suplementar-service';

export type FiltroCodafConferenciaDTO = {
  NomeFormacao?: string | null;
  CodigoFormacao?: number | null;
  NumeroHomologacao?: number | null;
  PropostaTurmaId?: number | null;
  AreaPromotoraId?: number | null;
  Status?: number | null;
  DataCriacao?: string | null;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CodafConferenciaDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  nomeTurma: string;
  nomeAreaPromotora: string;
  status: number;
  statusCertificacaoTurma?: number;
  codigoCursoEol?: number | null;
  codigoNivel?: number | null;
  possuiAprovacoes: boolean;
  criadoEm: string;
};

export type CodafConferenciaListagemRetornoDTO = {
  items: CodafConferenciaDTO[];
  totalRegistros: number;
  totalPaginas: number;
};

export type InscritoConferenciaDTO = {
  inscricaoId: number;
  participou: boolean | null;
};

export type AnexoConferenciaDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  tipoAnexoId?: number;
};

export type CodafConferenciaCadastroDTO = {
  propostaId: number;
  propostaTurmaId: number;
  numeroComunicado?: number | null;
  dataComunicado?: string | null;
  paginaComunicadoDom?: number | null;
  dataPublicacaoDom?: string | null;
  codigoCursoEol?: number | null;
  codigoNivel?: number | null;
  observacao?: string | null;
  inscritos: InscritoConferenciaDTO[];
  anexos?: AnexoConferenciaDTO[];
};

export type CodafConferenciaDetalheDTO = {
  id: number;
  propostaId: number;
  propostaTurmaId: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  numeroComunicado: number | null;
  dataComunicado: string | null;
  paginaComunicadoDom: number | null;
  dataPublicacaoDom: string | null;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
  observacao: string | null;
  status: number;
  dataFinalizacao: string | null;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
  certificadoEmitido: boolean;
  anexos?: AnexoCodafDetalheDTO[];
};

export type InscritoTurmaConferenciaDTO = {
  id: number;
  documento: string;
  nome: string;
  participou: boolean | null;
};

export type InscritoTurmaConferenciaRetornoDTO = {
  items: InscritoTurmaConferenciaDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export type PropostaConferenciaTurmaDTO = {
  id: number;
  nome: string;
  descricao: string;
  dataInicio?: string | null;
  dataFim?: string | null;
  possuiCodafConferencia?: boolean;
};

export type PropostaConferenciaComTurmasDTO = {
  id: number;
  nomeFormacao: string;
  numeroFormacao: number | null;
  tipoFormacao?: number | null;
  situacao?: number | null;
  turmas: PropostaConferenciaTurmaDTO[];
};

export const URL_API_CODAF_CONFERENCIA = 'v1/codaf-conferencia';

export const montarParametrosFiltroCodafConferencia = (filtros: FiltroCodafConferenciaDTO) => {
  const params: Record<string, string | number> = {
    NumeroRegistros: filtros.NumeroRegistros || 10,
    NumeroPagina: filtros.NumeroPagina || 1,
  };

  if (filtros.PropostaTurmaId) params.PropostaTurmaId = filtros.PropostaTurmaId;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.AreaPromotoraId) params.AreaPromotoraId = filtros.AreaPromotoraId;
  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.DataCriacao) params.DataCriacao = filtros.DataCriacao;
  if (filtros.Status !== null && filtros.Status !== undefined) params.Status = filtros.Status;

  return params;
};

export const obterListaCodafConferencia = (
  filtros: FiltroCodafConferenciaDTO,
): Promise<ApiResult<CodafConferenciaListagemRetornoDTO>> => {
  const params = montarParametrosFiltroCodafConferencia(filtros);
  return obterRegistro(URL_API_CODAF_CONFERENCIA, { params });
};

export const obterCodafConferenciaPorId = (
  id: number,
): Promise<ApiResult<CodafConferenciaDetalheDTO>> => {
  return obterRegistro(`${URL_API_CODAF_CONFERENCIA}/${id}`);
};

export const criarCodafConferencia = (
  dados: CodafConferenciaCadastroDTO,
): Promise<ApiResult<CodafConferenciaDetalheDTO>> => {
  return inserirRegistro(URL_API_CODAF_CONFERENCIA, dados);
};

export const atualizarCodafConferencia = (
  id: number,
  dados: CodafConferenciaCadastroDTO,
): Promise<ApiResult<any>> => {
  return alterarRegistro(`${URL_API_CODAF_CONFERENCIA}/${id}`, dados);
};

export const excluirCodafConferencia = (id: number): Promise<ApiResult<any>> => {
  return deletarRegistro(`${URL_API_CODAF_CONFERENCIA}/${id}`);
};

export const obterInscritosTurmaConferencia = (
  turmaId: number,
  numeroPagina = 1,
  numeroRegistros = 9999,
  codafConferenciaId?: number,
): Promise<ApiResult<InscritoTurmaConferenciaRetornoDTO>> => {
  const params: Record<string, number> = {
    numeroPagina,
    numeroRegistros,
  };
  if (codafConferenciaId) {
    params.codafConferenciaId = codafConferenciaId;
  }
  return obterRegistro(`${URL_API_CODAF_CONFERENCIA}/inscritos-turma/${turmaId}`, { params });
};

export const obterDetalhesPropostaConferenciaComTurmasPorId = (
  propostaId: number,
): Promise<ApiResult<PropostaConferenciaComTurmasDTO | null>> => {
  return obterRegistro(`${URL_API_CODAF_CONFERENCIA}/propostas/${propostaId}/detalhes-com-turmas`);
};

export const verificarTurmaPossuiCodafConferencia = (
  turmaId: number,
  codafConferenciaId?: number,
): Promise<ApiResult<boolean>> => {
  const params = codafConferenciaId ? { codafConferenciaId } : undefined;
  return obterRegistro(
    `${URL_API_CODAF_CONFERENCIA}/turmas/${turmaId}/possui-codaf`,
    params ? { params } : undefined,
  );
};

export const fazerUploadAnexoCodafConferencia = (
  formData: FormData,
  configuracaoHeader?: any,
): Promise<ApiResult<CodafAnexoTemporarioDTO>> => {
  return inserirRegistro(
    `${URL_API_CODAF_CONFERENCIA}/anexos/temporarios`,
    formData,
    configuracaoHeader,
  );
};
