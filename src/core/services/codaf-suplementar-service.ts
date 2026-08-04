import { CodafBaseDetalheDTO } from "../dto/codaf-base-detalhe-dto";
import api, { alterarRegistro, ApiResult, deletarRegistro, inserirRegistro, obterRegistro } from "./api";
import { PropostaTurmaComCodafDTO } from "./codaf-lista-presenca-service";
import {
  CodafAnexoDTO,
  CodafAnexoTemporarioDTO,
  CodafInscritoDTO,
  CodafListagemBaseDTO,
  CodafListagemFiltroBaseDTO,
  CodafListagemRetornoBaseDTO,
  CodafRetificacaoDTO,
  montarParametrosFiltroCodaf,
} from './codaf-service-shared';

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
  turma: PropostaTurmaComCodafDTO;
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

export type RetificacaoDTO = CodafRetificacaoDTO;

export type InscritoDTO = CodafInscritoDTO;

export type AnexoCodafDTO = CodafAnexoDTO;

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


export type CodafSuplementarFiltroDTO = CodafListagemFiltroBaseDTO;

export type CodafSuplementarDTO = CodafListagemBaseDTO;

export type CodafSuplementarRetornoDTO = CodafListagemRetornoBaseDTO<CodafSuplementarDTO>;

export const obterCodafSuplementar = (
  filtros: CodafSuplementarFiltroDTO,
): Promise<ApiResult<CodafSuplementarRetornoDTO>> => {
  const params = montarParametrosFiltroCodaf(filtros);

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
): Promise<ApiResult<CodafAnexoTemporarioDTO>> =>
  inserirRegistro(
    `${URL_API_CODAF_SUPLEMENTAR}/anexos/temporarios`,
    formData,
    configuracaoHeader,
  );

export const deletarRetificacao = (id: string | number): Promise<ApiResult<boolean>> =>
  deletarRegistro(`${URL_API_CODAF_SUPLEMENTAR}/retificacoes/${id}`);

export const baixarArquivoRemessaEol = (codafSuplementarId: number): Promise<ApiResult<string>> =>
  inserirRegistro(`${URL_API_CODAF_SUPLEMENTAR}/${codafSuplementarId}/gerar-remessa-conclusao`,
    {},
  );

export const imprimirRelatorioCodafSuplementar = (codafListaPresencaId: number) => {
  return api.post(
    `${URL_API_CODAF_SUPLEMENTAR}/${codafListaPresencaId}/imprimir`,
    {},
    {
      responseType: 'blob',
    },
  );
};