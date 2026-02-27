import { Col, FormInstance, Row } from 'antd';
import React from 'react';
import UploadArquivosConectaFormacao from '~/components/main/upload';

interface SecaoAnexosProps {
  form: FormInstance;
  podeGerenciarAnexos: boolean;
  onDownloadAnexo: (arquivo: any) => void;
  fazerUploadAnexoCodaf: (formData: FormData, configuracaoHeader: any) => Promise<any>;
  obterAnexoCodafParaDownload: (arquivo: any) => Promise<any>;
}

export const SecaoAnexos: React.FC<SecaoAnexosProps> = ({
  form,
  podeGerenciarAnexos,
  onDownloadAnexo,
  fazerUploadAnexoCodaf,
  obterAnexoCodafParaDownload,
}) => {
  return (
    <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
      <Col span={24}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '20px',
            lineHeight: '100%',
            color: '#42474A',
            marginBottom: 8,
          }}
        >
          Anexos
        </div>
        <p style={{ marginBottom: 16 }}>Anexe os documentos úteis para a criação do CODAF.</p>
        <UploadArquivosConectaFormacao
          form={form}
          formItemProps={{
            name: 'anexos',
            label: '',
          }}
          draggerProps={{
            multiple: true,
            onDownload: onDownloadAnexo,
            disabled: !podeGerenciarAnexos,
          }}
          subTitulo='Deve permitir apenas arquivos PDF com no máximo 20MB cada.'
          tipoArquivosPermitidos='.pdf'
          tamanhoMaxUploadPorArquivo={20}
          uploadService={fazerUploadAnexoCodaf}
          downloadService={obterAnexoCodafParaDownload}
          formDataFieldName='arquivo'
          mensagemFormatoNaoPermitido='Arquivo deve estar no formato PDF'
          mensagemSucessoUpload='Arquivo carregado com sucesso'
        />
      </Col>
    </Row>
  );
};
