import api, { ApiResult, obterRegistro } from './api';

const URL_DEFAULT = 'v1/CodafDeclaracao';

export type CodafDeclaracaoFiltroDTO = {
  NumeroHomologacao?: number | null;
  NomeFormacao?: string | null;
  CodigoFormacao?: number | null;
  CodigoDeclaracao?: number | null;
  TipoDeclaracao?: number | null;
  TipoEmissor?: number | null;
  DocumentoCursista?: string | null;
  DocumentoRegente?: string | null;
  NomeCursista?: string | null;
  DataEmissao?: string | null;
  EmissorId?: number | null;
  TurmaId?: number | null;
  Pagina?: number;
  TamanhoPagina?: number;
};

export type CodafDeclaracaoDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  documentoCursista: string;
  documentoRegente: string;
  codigoDeclaracao: number;
  tipoDeclaracao: number;
  dataEmissao: string;
  nomeCursista: string;
  nomeRegente: string;
};

export type CodafDeclaracaoRetornoDTO = {
  items: CodafDeclaracaoDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterDeclaracoesCodaf = (
  filtros: CodafDeclaracaoFiltroDTO,
): Promise<ApiResult<CodafDeclaracaoRetornoDTO>> => {
  const params: Record<string, unknown> = {
    Pagina: filtros.Pagina || 1,
    TamanhoPagina: filtros.TamanhoPagina || 10,
  };

  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoFormacao) params.CodigoFormacao = filtros.CodigoFormacao;
  if (filtros.CodigoDeclaracao) params.CodigoDeclaracao = filtros.CodigoDeclaracao;
  if (filtros.TipoDeclaracao !== null && filtros.TipoDeclaracao !== undefined)
    params.TipoDeclaracao = filtros.TipoDeclaracao;
  if (filtros.TipoEmissor !== null && filtros.TipoEmissor !== undefined)
    params.TipoEmissor = filtros.TipoEmissor;
  if (filtros.DocumentoCursista) params.DocumentoCursista = filtros.DocumentoCursista;
  if (filtros.DocumentoRegente) params.DocumentoRegente = filtros.DocumentoRegente;
  if (filtros.NomeCursista) params.NomeCursista = filtros.NomeCursista;
  if (filtros.DataEmissao) params.DataEmissao = filtros.DataEmissao;
  if (filtros.EmissorId) params.EmissorId = filtros.EmissorId;
  if (filtros.TurmaId) params.TurmaId = filtros.TurmaId;

  return obterRegistro(URL_DEFAULT, { params });
};

export const downloadDeclaracoesLote = async (ids: number[]): Promise<{ sucesso: boolean; blob?: Blob; mensagensErro?: string[] }> => {
  try {
    const response = await api.post(`${URL_DEFAULT}/download-lote`, ids, {
      responseType: 'blob',
    });
    return { sucesso: true, blob: response.data as Blob };
  } catch (error: any) {
    const responseBlob: Blob = error?.response?.data;
    if (responseBlob) {
      const text = await responseBlob.text();
      try {
        const json = JSON.parse(text);
        return { sucesso: false, mensagensErro: json.mensagensErro ?? [] };
      } catch {
        // ignorar erro de parse
      }
    }
    return { sucesso: false, mensagensErro: ['Erro ao baixar as declarações.'] };
  }
};
