import api, { inserirRegistro } from './api';

const URL_DEFAULT = 'v1/Arquivo';

const fazerUploadArquivo = (formData: FormData, configuracaoHeader: any) =>
  inserirRegistro(URL_DEFAULT, formData, configuracaoHeader);

const obterArquivoParaDownload = (codigoArquivo: string) => {
  return api.get(`${URL_DEFAULT}/${codigoArquivo}`, {
    responseType: 'arraybuffer',
  });
};

export default {
  fazerUploadArquivo,
  obterArquivoParaDownload,
};
