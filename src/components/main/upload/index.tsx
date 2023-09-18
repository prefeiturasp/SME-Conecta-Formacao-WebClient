import { FormInstance, FormItemProps } from 'antd';
import { DraggerProps } from 'antd/es/upload';
import React from 'react';
import UploadArquivosSME from '~/components/lib/upload';
import arquivoService from '~/core/services/arquivo-service';

type UploadArquivosCDEPProps = {
  form: FormInstance;
  formItemProps: FormItemProps & { name: string };
  draggerProps?: DraggerProps;
};
const UploadArquivosConectaFormacao: React.FC<UploadArquivosCDEPProps> = ({
  form,
  formItemProps,
  draggerProps,
}) => {
  return (
    <UploadArquivosSME
      draggerProps={draggerProps}
      form={form}
      formItemProps={formItemProps}
      tiposArquivosPermitidos='.jpg,.jpeg,.png,.tiff'
      uploadService={arquivoService.fazerUploadArquivo}
      downloadService={arquivoService.obterArquivoParaDownload}
      tamanhoMaxUploadPorArquivo={5}
    />
  );
};

export default UploadArquivosConectaFormacao;
