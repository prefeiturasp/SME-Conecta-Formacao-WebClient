import { ApiResult, obterRegistro } from './api';
import api from './api';

const URL_DEFAULT = 'v1/CodafCertificado';

export type CodafCertificadoFiltroDTO = {
  NumeroHomologacao?: number | null;
  NomeFormacao?: string | null;
  CodigoCertificado?: number | null;
  TipoCertificado?: number | null;
  DocumentoCursista?: string | null;
  DocumentoRegente?: string | null;
  NomeCursista?: string | null;
  DataEmissao?: string | null;
  DreId?: number | null;
  PropostaTurmaId?: number | null;
  NumeroPagina?: number;
  NumeroRegistros?: number;
};

export type CodafCertificadoDTO = {
  id: number;
  numeroHomologacao: number;
  nomeFormacao: string;
  documento: string;
  codigoCertificado: number;
  tipoCertificado: number;
  dataEmissao: string;
  nomeParticipante: string;
};

export type CodafCertificadoRetornoDTO = {
  items: CodafCertificadoDTO[];
  totalPaginas: number;
  totalRegistros: number;
};

export const obterCertificadosCodaf = (
  filtros: CodafCertificadoFiltroDTO,
): Promise<ApiResult<CodafCertificadoRetornoDTO>> => {
  const params: Record<string, unknown> = {
    NumeroPagina: filtros.NumeroPagina || 1,
    NumeroRegistros: filtros.NumeroRegistros || 10,
  };

  if (filtros.NumeroHomologacao) params.NumeroHomologacao = filtros.NumeroHomologacao;
  if (filtros.NomeFormacao) params.NomeFormacao = filtros.NomeFormacao;
  if (filtros.CodigoCertificado) params.CodigoCertificado = filtros.CodigoCertificado;
  if (filtros.TipoCertificado !== null && filtros.TipoCertificado !== undefined)
    params.TipoCertificado = filtros.TipoCertificado;
  if (filtros.DocumentoCursista) params.DocumentoCursista = filtros.DocumentoCursista;
  if (filtros.DocumentoRegente) params.DocumentoRegente = filtros.DocumentoRegente;
  if (filtros.NomeCursista) params.NomeCursista = filtros.NomeCursista;
  if (filtros.DataEmissao) params.DataEmissao = filtros.DataEmissao;
  if (filtros.DreId) params.DreId = filtros.DreId;
  if (filtros.PropostaTurmaId) params.PropostaTurmaId = filtros.PropostaTurmaId;

  return obterRegistro(URL_DEFAULT, { params });
};

export const downloadCertificadosLote = async (ids: number[]): Promise<{ sucesso: boolean; blob?: Blob; mensagensErro?: string[] }> => {
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
    return { sucesso: false, mensagensErro: ['Erro ao baixar os certificados.'] };
  }
};
