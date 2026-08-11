/**
 * Mapeia os anexos retornados pela API para o formato esperado
 * pelo componente de upload do Ant Design (FileList).
 *
 * Compartilhado entre os cadastros CODAF Homologado e Não Homologado.
 */
export type AnexoDetalheBase = {
  arquivoCodigo: string;
  nomeArquivo: string;
  tipoAnexoId: number;
  urlDownload?: string;
};

export const mapearAnexosParaFormulario = (anexos: AnexoDetalheBase[] = []) =>
  anexos
    .filter(
      (anexo) =>
        anexo?.arquivoCodigo != null &&
        anexo?.arquivoCodigo !== '' &&
        anexo?.arquivoCodigo !== '0',
    )
    .map((anexo) => ({
      uid: anexo.arquivoCodigo,
      name: anexo.nomeArquivo,
      status: 'done' as const,
      xhr: anexo.arquivoCodigo,
      arquivoCodigo: anexo.arquivoCodigo,
      nomeArquivo: anexo.nomeArquivo,
      tipoAnexoId: anexo.tipoAnexoId,
      urlDownload: anexo.urlDownload,
    }));
