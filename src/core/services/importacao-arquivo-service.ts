import { PaginacaoResultadoDTO } from '../dto/paginacao-resultado-dto';
import { RegistroDaInscricaoInsconsistenteDTO } from '../dto/registros-inconsistencias-dto';
import { alterarRegistro, inserirRegistro, obterRegistro } from './api';

export const URL_IMPORTACAO_ARQUIVO = 'v1/ImportacaoArquivo';

const importarArquivoInscricaoCursista = (file: File, propostaId: number) => {
  const fmData = new FormData();
  fmData.append('arquivo', file);

  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };

  return inserirRegistro(
    `${URL_IMPORTACAO_ARQUIVO}/inscricao-cursista?propostaId=${propostaId}`,
    fmData,
    config,
  );
};

const buscarInconsistencias = (propostaId: number) =>
  obterRegistro<PaginacaoResultadoDTO<RegistroDaInscricaoInsconsistenteDTO[]>>(
    `${URL_IMPORTACAO_ARQUIVO}/${propostaId}/registros-inconsistencia`,
  );

const continuarProcessamento = (arquivoImportacaoId: number) =>
  alterarRegistro<boolean>(`${URL_IMPORTACAO_ARQUIVO}/${arquivoImportacaoId}/continuar`);

const cancelarProcessamento = (arquivoImportacaoId: number) =>
  alterarRegistro<boolean>(`${URL_IMPORTACAO_ARQUIVO}/${arquivoImportacaoId}/cancelar`);

export default {
  importarArquivoInscricaoCursista,
  continuarProcessamento,
  cancelarProcessamento,
  buscarInconsistencias,
};
