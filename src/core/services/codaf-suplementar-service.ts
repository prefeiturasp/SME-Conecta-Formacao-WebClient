import { ApiResult, inserirRegistro, obterRegistro } from "./api";

export const URL_API_CODAF_SUPLEMENTAR = 'v1/CodafSuplementar';

export type CodafSuplementarDetalheDTO = {
  id: number;
  codafId: number;
  propostaId: number;
  propostaTurmaId: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  codigoFormacao: number;
  numeroComunicado: number;
  dataPublicacao: string | null;
  paginaComunicadoDom: number;
  dataPublicacaoDom: string | null;
  codigoCursoEol: number | null;
  codigoNivel: number;
  observacao: string | null;
  status: number;
  alteradoEm: string | null;
  alteradoPor: string | null;
  alteradoLogin: string | null;
  criadoEm: string;
  criadoPor: string;
  criadoLogin: string;
  retificacoes?: RetificacaoDTO[];
  anexos?: AnexoCodafDetalheDTO[];
};

export type AnexoCodafDetalheDTO = {
  id: number;
  codafListaPresencaId: number;
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