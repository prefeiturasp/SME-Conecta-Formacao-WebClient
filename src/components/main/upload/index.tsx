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
};
const UploadArquivosConectaFormacao: React.FC<UploadArquivosConectaFormacaoProps> = ({
  form,
  formItemProps,
  draggerProps,
  tipoArquivosPermitidos,
  subTitulo,
  tamanhoMaxUploadPorArquivo = 5,
}) => {
  return (
    <UploadArquivosSME
      draggerProps={draggerProps}
      form={form}
      subTitulo={subTitulo}
      formItemProps={formItemProps}
      tiposArquivosPermitidos={`.jpg,.jpeg,.png,.tiff${tipoArquivosPermitidos}`}
      uploadService={arquivoService.fazerUploadArquivo}
      downloadService={arquivoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={tamanhoMaxUploadPorArquivo}
    />
  );
};

export default UploadArquivosConectaFormacao;
