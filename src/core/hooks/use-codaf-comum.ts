import { useState } from 'react';
import { notification } from '~/components/lib/notification';
import { downloadBlob } from '~/core/utils/functions';
import {
  baixarModeloTermoResponsabilidade,
  obterAnexoCodafParaDownload,
} from '~/core/services/codaf-lista-presenca-service';

export const useCodafComum = () => {
  const [loadingComum, setLoadingComum] = useState(false);

  const mapearAnexosParaFormulario = (anexos: any[] = []) =>
    anexos
      .filter(
        (anexo) =>
          anexo?.arquivoCodigo != null && anexo?.arquivoCodigo !== '' && anexo?.arquivoCodigo !== '0',
      )
      .map((anexo) => ({
        uid: anexo.arquivoCodigo,
        name: anexo.nomeArquivo,
        status: 'done',
        xhr: anexo.arquivoCodigo,
        arquivoCodigo: anexo.arquivoCodigo,
        nomeArquivo: anexo.nomeArquivo,
        tipoAnexoId: anexo.tipoAnexoId,
        urlDownload: anexo.urlDownload,
      }));

  const onBaixarModelo = async () => {
    try {
      setLoadingComum(true);
      const response = await baixarModeloTermoResponsabilidade();

      if (response.status === 200) {
        const contentDisposition = response.headers['content-disposition'];
        const contentType = response.headers['content-type'];
        let fileName = 'Modelo_Termo_Responsabilidade';

        if (contentType?.includes('pdf')) {
          fileName += '.pdf';
        } else if (contentType?.includes('wordprocessingml') || contentType?.includes('msword')) {
          fileName += '.docx';
        } else {
          fileName += '.pdf';
        }

        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch?.[1]) {
            fileName = fileNameMatch[1].replaceAll(/['"]/g, '');
          }
        }

        downloadBlob(response.data, fileName);
        notification.success({ message: 'Sucesso', description: 'Modelo baixado com sucesso!' });
      } else {
        notification.error({ message: 'Erro', description: 'Erro ao baixar modelo do termo de responsabilidade' });
      }
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      notification.error({ message: 'Erro', description: 'Erro ao baixar modelo do termo de responsabilidade' });
    } finally {
      setLoadingComum(false);
    }
  };

  const onDownloadAnexo = async (arquivo: any) => {
    try {
      if (arquivo.urlDownload) {
        window.open(arquivo.urlDownload, '_blank');
        return;
      }

      const codigoArquivo = arquivo.xhr || arquivo.arquivoCodigo || arquivo.response;

      if (!codigoArquivo) {
        notification.error({ message: 'Erro', description: 'Código do arquivo não encontrado' });
        return;
      }

      const response = await obterAnexoCodafParaDownload(codigoArquivo);

      if (response.status === 200) {
        downloadBlob(response.data, arquivo.name);
      } else {
        notification.error({ message: 'Erro', description: 'Erro ao fazer download do arquivo' });
      }
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      notification.error({ message: 'Erro', description: 'Erro ao fazer download do arquivo' });
    }
  };

  const exibirErroSalvar = (error: any, modoEdicao: boolean) => {
    const mensagemPadraoErro = modoEdicao ? 'Erro ao atualizar o registro' : 'Erro ao salvar o registro';
    const mensagemErro =
      error?.response?.data?.erros?.[0] ??
      error?.response?.data?.mensagens?.[0] ??
      error?.message ??
      mensagemPadraoErro;

    notification.error({ message: 'Erro', description: mensagemErro });
  };

  return {
    loadingComum,
    mapearAnexosParaFormulario,
    onBaixarModelo,
    onDownloadAnexo,
    exibirErroSalvar
  };
};