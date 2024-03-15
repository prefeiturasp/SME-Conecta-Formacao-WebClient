import { inserirRegistro } from './api';

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

export default { importarArquivoInscricaoCursista };
