import api, { alterarRegistro, ApiResult, deletarRegistro, inserirRegistro, obterRegistro } from "./api";
import {
  CodafAnexoDTO,
  CodafAnexoTemporarioDTO,
  CodafListagemFiltroBaseDTO,
  montarParametrosFiltroCodaf,
} from "./codaf-service-shared";
import { AnexoCodafDetalheDTO } from "./codaf-suplementar-service";

export type CodafNaoHomologadoListagemFiltroDTO = CodafListagemFiltroBaseDTO;

export type CodafNaoHomologadoListagemDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  nomeTurma: string;
  nomeAreaPromotora: string;
  status: number;
};

export type CodafNaoHomologadoListagemRetornoDTO = {
  items: CodafNaoHomologadoListagemDTO[];
  totalRegistros: number;
  totalPaginas: number;
};

export type CodafNaoHomologadoInscritoDTO = {
  inscricaoId: number;
  participou: boolean | null;
};


export type CriarCodafNaoHomologadoDTO = {
  propostaId: number;
  propostaTurmaId: number;
  observacao: string;
  inscritos: CodafNaoHomologadoInscritoDTO[];
  anexos?: CodafAnexoDTO[];
};

export type CodafNaoHomologadoDetalheDTO = {
  id: number;
  propostaId: number;
  propostaTurmaId: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  observacao: string | null;
  status: number;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
  anexos?: AnexoCodafDetalheDTO[];
};

export const URL_API_CODAF_CURSO_NAO_HOMOLOGADO = 'v1/CodafCursoNaoHomologado';

export const obterListaCodafNaoHomologado = (
  filtros: CodafNaoHomologadoListagemFiltroDTO,
): Promise<ApiResult<CodafNaoHomologadoListagemRetornoDTO>> => {
  const params = montarParametrosFiltroCodaf(filtros, false, true);

  return obterRegistro(URL_API_CODAF_CURSO_NAO_HOMOLOGADO, { params });
};

export const criarCodafNaoHomologado = (
  dados: CriarCodafNaoHomologadoDTO,
): Promise<ApiResult<any>> => {
  return inserirRegistro(URL_API_CODAF_CURSO_NAO_HOMOLOGADO, dados);
};

export const atualizarCodafNaoHomologado = (
  id: number,
  dados: CriarCodafNaoHomologadoDTO,
): Promise<ApiResult<any>> => {
  return alterarRegistro(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/${id}`, dados);
};

export const obterCodafNaoHomologadoPorId = (codafNaoHomologadoId: number): 
Promise<ApiResult<CodafNaoHomologadoDetalheDTO>> => {
    return obterRegistro(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/${codafNaoHomologadoId}`);
};

export type InscritoTurmaDTO = {
  id: number;
  documento: string;
  nome: string;
  participou: boolean;
};

export type InscritoTurmaRetornoDTO = {
  items: InscritoTurmaDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterInscritosTurma = (
  turmaId: number,
  numeroPagina = 1,
  numeroRegistros = 9999,
): Promise<ApiResult<InscritoTurmaRetornoDTO>> => {
  const params = {
    numeroPagina,
    numeroRegistros,
  };
  return obterRegistro(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/inscritos-turma/${turmaId}`, { params });
};

export const baixarModeloTermoResponsabilidade = () => {
  return api.get(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/termo-responsabilidade/modelo`, {
    responseType: 'arraybuffer',
  });
};

export const fazerUploadAnexoCodaf = (
  formData: FormData,
  configuracaoHeader: any,
): Promise<ApiResult<CodafAnexoTemporarioDTO>> =>
  inserirRegistro(
    `${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/anexos/temporarios`,
    formData,
    configuracaoHeader,
  );

export const obterAnexoCodafParaDownload = (arquivoCodigo: string) => {
  return api.get(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/anexos/${arquivoCodigo}`, {
    responseType: 'arraybuffer',
  });
};

export const excluirCodafNaoHomologado = (
  codafNaoHomologadoId: number,
): Promise<ApiResult<any>> => {
  return deletarRegistro(`${URL_API_CODAF_CURSO_NAO_HOMOLOGADO}/${codafNaoHomologadoId}`);
};