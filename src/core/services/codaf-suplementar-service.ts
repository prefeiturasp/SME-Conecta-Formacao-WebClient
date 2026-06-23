import { CodafBaseDetalheDTO } from "../dto/codaf-base-detalhe-dto";
import { alterarRegistro, ApiResult, deletarRegistro, inserirRegistro, obterRegistro } from "./api";
import { AnexoTemporarioDTO } from "./codaf-lista-presenca-service";

export const URL_API_CODAF_SUPLEMENTAR = 'v1/CodafSuplementar';

export type InscritoDetalheDTO = {
  id: number;
  inscricaoId: number;
  codafSuplementarId: number;
  documento: string;
  nome: string;
  percentualFrequencia: number | null;
  conceitoFinal: string | null;
  atividadeObrigatorio: boolean | null;
  aprovado: boolean | null;
};

export interface CodafSuplementarDetalheDTO extends CodafBaseDetalheDTO {
  codafId: number;
  inscritos?: InscritoDetalheDTO[];
}

export type AnexoCodafDetalheDTO = {
  id: number;
  codafSuplementarId: number;
  arquivoCodigo: string;
  nomeArquivo: string;
  extensao: string;
  tipoAnexoId: number;
  urlDownload: string;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
};

export type RetificacaoDTO = {
  id: number;
  dataRetificacao: string | null;
  paginaRetificacaoDom: number;
};

export type InscritoDTO = {
  inscricaoId: number;
  percentualFrequencia: number | null;
  conceitoFinal: string | null;
  atividadeObrigatorio: boolean | null;
  aprovado: boolean | null;
};

export type AnexoCodafDTO = {
  arquivoCodigo: string;
  nomeArquivo: string;
  tipoAnexoId: number;
};

export type CriarCodafSuplementarDTO = {
  propostaId: number;
  propostaTurmaId: number;
  dataPublicacao: string | null;
  dataPublicacaoDom: string | null;
  numeroComunicado: number;
  paginaComunicadoDom: number;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
  observacao: string;
  inscritos: InscritoDTO[];
  retificacoes?: RetificacaoDTO[];
  anexos?: AnexoCodafDTO[];
  codafId: number;
};

export const criarCodafSuplementar = (
    dados: CriarCodafSuplementarDTO,
): Promise<ApiResult<any>> => {
  return inserirRegistro(`${URL_API_CODAF_SUPLEMENTAR}`, dados);
}

export const obterCodafOriginal = (codafId: number): Promise<ApiResult<CodafSuplementarDetalheDTO>> => {
    return obterRegistro(`${URL_API_CODAF_SUPLEMENTAR}/codaf/${codafId}`);
}

export const obterCodafSuplementarPorId = (codafSuplementarId: number): Promise<ApiResult<CodafSuplementarDetalheDTO>> => {
    return obterRegistro(`${URL_API_CODAF_SUPLEMENTAR}/${codafSuplementarId}`);
}


export type CodafSuplementarFiltroDTO = {
  NomeFormacao?: string | null;
  CodigoFormacao?: number | null;
  NumeroHomologacao?: number | null;
  PropostaTurmaId?: number | null;
  AreaPromotoraId?: number | null;
  Status?: number | null;
  DataEnvioDf?: string | null;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CodafSuplementarDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  nomeTurma: string;
  nomeAreaPromotora: string;
  status: number;
  statusCertificacaoTurma: number;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
};

export type CodafSuplementarRetornoDTO = {
  items: CodafSuplementarDTO[];
  totalRegistros: number;
  totalPaginas: number;
};

export const obterCodafSuplementar = (
  filtros: CodafSuplementarFiltroDTO,
): Promise<ApiResult<CodafSuplementarRetornoDTO>> => {
  const params: any = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.PropostaTurmaId) params.PropostaTurmaId = filtros.PropostaTurmaId;
  if (filtros.AreaPromotoraId) params.AreaPromotoraId = filtros.AreaPromotoraId;
  if (filtros.Status !== null && filtros.Status !== undefined) params.Status = filtros.Status;

  return obterRegistro(URL_API_CODAF_SUPLEMENTAR, { params });
};

export type AlterarCodafSuplementarDTO = {
  codafId: number;
  dataPublicacao: string | null;
  dataPublicacaoDom: string | null;
  numeroComunicado: number;
  paginaComunicadoDom: number;
  codigoCursoEol: number | null;
  codigoNivel: number | null;
  observacao: string;
  inscritos: InscritoDTO[];
  retificacoes?: RetificacaoDTO[];
  anexos?: AnexoCodafDTO[];
};

export const alterarCodafSuplementar = (
  id: number,
  dados: AlterarCodafSuplementarDTO,
): Promise<ApiResult<any>> => {
  return alterarRegistro(`${URL_API_CODAF_SUPLEMENTAR}/${id}`, dados);
};

export const excluirCodafSuplementar = (
  codafSuplementarId: number,
): Promise<ApiResult<any>> => {
  return deletarRegistro(`${URL_API_CODAF_SUPLEMENTAR}/${codafSuplementarId}`);
};

export const fazerUploadAnexoCodaf = (
  formData: FormData,
  configuracaoHeader: any,
): Promise<ApiResult<AnexoTemporarioDTO>> =>
  inserirRegistro(
    `${URL_API_CODAF_SUPLEMENTAR}/anexos/temporarios`,
    formData,
    configuracaoHeader,
  );

export const deletarRetificacao = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_CODAF_SUPLEMENTAR}/retificacoes/${id}`);