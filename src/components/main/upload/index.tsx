import { FormInstance, FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React from 'react';
import UploadArquivosSME from '~/components/lib/upload';
import arquivoService from '~/core/services/arquivo-service';

type UploadArquivosConectaFormacaoProps = {
  form: FormInstance;
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
  tipoArquivosPermitidos?: string;
  subTitulo?: string;
  tamanhoMaxUploadPorArquivo?: number;
  uploadService?: (formData: FormData, configuracaoHeader: any) => Promise<any>;
  downloadService?: (codigoArquivo: string) => Promise<any>;
  formDataFieldName?: string;
  mensagemFormatoNaoPermitido?: string;
  mensagemSucessoUpload?: string;
};
const UploadArquivosConectaFormacao: React.FC<UploadArquivosConectaFormacaoProps> = ({
  form,
  formItemProps,
  draggerProps,
  tipoArquivosPermitidos,
  subTitulo,
  tamanhoMaxUploadPorArquivo = 5,
  uploadService = arquivoService.fazerUploadArquivo,
  downloadService = arquivoService.obterArquivoParaDownload,
  formDataFieldName = 'file',
  mensagemFormatoNaoPermitido,
  mensagemSucessoUpload,
}) => {
  return (
    <UploadArquivosSME
      draggerProps={draggerProps}
      form={form}
      subTitulo={subTitulo}
      formItemProps={formItemProps}
      tiposArquivosPermitidos={tipoArquivosPermitidos || '.jpg,.jpeg,.png,.tiff'}
      uploadService={uploadService}
      downloadService={downloadService}
      tamanhoMaxUploadPorArquivo={tamanhoMaxUploadPorArquivo}
      formDataFieldName={formDataFieldName}
      mensagemFormatoNaoPermitido={mensagemFormatoNaoPermitido}
      mensagemSucessoUpload={mensagemSucessoUpload}
    />
  );
};

export default UploadArquivosConectaFormacao;
